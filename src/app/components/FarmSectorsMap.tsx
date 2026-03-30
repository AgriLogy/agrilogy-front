'use client';

import {
  AddIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  DeleteIcon,
} from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Text,
  Tooltip,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import api from '@/app/lib/api';
import type { FarmMapSensorPlacement } from '@/app/types/farmMap';
import { DEFAULT_MAP_STYLES, type FarmMapStyleId } from '@/app/types/farmMap';
import {
  FarmMapSensorMarkerIcon,
  markerBackgroundForSensor,
} from '@/app/components/FarmMapSensorMarkerIcon';
import {
  loadFarmSectorsFromStorage,
  saveFarmSectorsToStorage,
  type FarmSectorsFeatureCollection,
} from '@/app/utils/farmSectorsStorage';
import {
  loadSensorPlacements,
  saveSensorPlacements,
} from '@/app/utils/farmMapSensorPlacements';
import getActiveGraphs, {
  type ActiveGraphResponse,
} from '@/app/utils/getActiveGraphs';
import { activeGraphToMapSensorDefinitions } from '@/app/utils/mapActiveGraphToMapSensors';
import {
  escapeHtmlForPopup,
  fetchMapSensorHoverPayload,
  getMapSensorDefinition,
} from '@/app/utils/mapSensors';
import { pointInPolygonGeometry } from '@/app/utils/mapPointInSector';
import { centroidFromPolygonGeometry } from '@/app/utils/polygonCentroid';

function getScrollableParent(el: HTMLElement | null): HTMLElement | null {
  if (!el) return null;
  let p: HTMLElement | null = el.parentElement;
  while (p) {
    const y = getComputedStyle(p).overflowY;
    if (
      (y === 'auto' || y === 'scroll') &&
      p.scrollHeight > p.clientHeight + 1
    ) {
      return p;
    }
    p = p.parentElement;
  }
  return null;
}

type DrawLike = {
  add: (geojson: object) => string[];
  getAll: () => FarmSectorsFeatureCollection;
  getSelectedIds: () => string[];
  delete: (id: string) => void;
  deleteAll: () => void;
  setFeatureProperty: (id: string, key: string, value: unknown) => unknown;
  changeMode: (mode: string, opts?: Record<string, unknown>) => void;
  trash: () => void;
};

function asDraw(control: unknown): DrawLike {
  return control as DrawLike;
}

function fitMapToCollection(
  map: mapboxgl.Map,
  fc: FarmSectorsFeatureCollection
) {
  const bounds = new mapboxgl.LngLatBounds();
  let has = false;
  for (const f of fc.features) {
    const g = f.geometry;
    if (!g || typeof g !== 'object') continue;
    if (g.type === 'Polygon' && Array.isArray(g.coordinates)) {
      for (const ring of g.coordinates as number[][][]) {
        for (const c of ring) {
          bounds.extend([c[0], c[1]]);
          has = true;
        }
      }
    } else if (g.type === 'MultiPolygon' && Array.isArray(g.coordinates)) {
      for (const poly of g.coordinates as number[][][][]) {
        for (const ring of poly) {
          for (const c of ring) {
            bounds.extend([c[0], c[1]]);
            has = true;
          }
        }
      }
    }
  }
  if (has) {
    map.fitBounds(bounds, { padding: 56, maxZoom: 17, duration: 0 });
  }
}

function sectorName(props: Record<string, unknown> | null | undefined) {
  const n = props?.name;
  return typeof n === 'string' ? n : '';
}

function hashStringToUint32(str: string): number {
  let h = 2166136261; // FNV-1a
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function colorForZoneTraceId(zoneTraceId: string): string {
  // Generate a stable, widely distributed color per polygon id.
  // This avoids repeating the same limited palette when many zones are drawn.
  const h = hashStringToUint32(zoneTraceId);
  const hue = h % 360;
  const sat = 65 + (h % 20); // 65..84
  const light = 42 + ((h >>> 8) % 14); // 42..55
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

// Mapbox Draw default theme uses a single blue/orange.
// We override fill + line colors to use `feature.properties.color` per polygon.
const DRAW_BLUE = '#3bb2d0';
const DRAW_ORANGE_ACTIVE = '#fbb03b';
const DRAW_WHITE = '#fff';

const DRAW_STYLES = [
  // Polygons (fill)
  {
    id: 'gl-draw-polygon-fill',
    type: 'fill',
    filter: ['all', ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': [
        'case',
        ['==', ['get', 'active'], 'true'],
        DRAW_ORANGE_ACTIVE,
        // Mapbox Draw exposes user properties as `user_<key>` when userProperties: true.
        ['coalesce', ['get', 'user_color'], DRAW_BLUE],
      ],
      'fill-opacity': 0.1,
    },
  },
  // Polygon outline (lines)
  {
    id: 'gl-draw-lines',
    type: 'line',
    filter: ['any', ['==', '$type', 'LineString'], ['==', '$type', 'Polygon']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': [
        'case',
        ['==', ['get', 'active'], 'true'],
        DRAW_ORANGE_ACTIVE,
        // Mapbox Draw exposes user properties as `user_<key>` when userProperties: true.
        ['coalesce', ['get', 'user_color'], DRAW_BLUE],
      ],
      'line-dasharray': [
        'case',
        ['==', ['get', 'active'], 'true'],
        [0.2, 2],
        [2, 0],
      ],
      'line-width': 2,
    },
  },
  // Points (default theme for vertices is fine)
  {
    id: 'gl-draw-point-outer',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'feature']],
    paint: {
      'circle-radius': ['case', ['==', ['get', 'active'], 'true'], 7, 5],
      'circle-color': DRAW_WHITE,
    },
  },
  {
    id: 'gl-draw-point-inner',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'feature']],
    paint: {
      'circle-radius': ['case', ['==', ['get', 'active'], 'true'], 5, 3],
      'circle-color': [
        'case',
        ['==', ['get', 'active'], 'true'],
        DRAW_ORANGE_ACTIVE,
        DRAW_BLUE,
      ],
    },
  },
  {
    id: 'gl-draw-vertex-outer',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'vertex'],
      ['!=', 'mode', 'simple_select'],
    ],
    paint: {
      'circle-radius': ['case', ['==', ['get', 'active'], 'true'], 7, 5],
      'circle-color': DRAW_WHITE,
    },
  },
  {
    id: 'gl-draw-vertex-inner',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'vertex'],
      ['!=', 'mode', 'simple_select'],
    ],
    paint: {
      'circle-radius': ['case', ['==', ['get', 'active'], 'true'], 5, 3],
      'circle-color': DRAW_ORANGE_ACTIVE,
    },
  },
  {
    id: 'gl-draw-midpoint',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'midpoint']],
    paint: {
      'circle-radius': 3,
      'circle-color': DRAW_ORANGE_ACTIVE,
    },
  },
] as any;

function newPlacementId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `p_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export interface FarmSectorsMapProps {
  lat: number;
  lon: number;
}

export default function FarmSectorsMap({ lat, lon }: FarmSectorsMapProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '';
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<DrawLike | null>(null);
  const drawControlRef = useRef<mapboxgl.IControl | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapShellRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const sectorLabelsMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const updateSectorLabelRef = useRef<() => void>(() => {});
  const fetchMarkerReadRef = useRef<(placementId: string) => void>(() => {});
  const selectedSectorIdRef = useRef<string | null>(null);
  const styleRef = useRef<FarmMapStyleId>('satellite');
  const toast = useToast();

  const markerRootsRef = useRef<Map<string, Root>>(new Map());
  const markersDomRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const placementPickRef = useRef({
    active: false,
    sensorKey: null as string | null,
    sectorId: null as string | null,
  });
  const dataZoneIdRef = useRef<number | null>(null);
  const placementsRef = useRef<FarmMapSensorPlacement[]>([]);
  const rebuildMarkersRef = useRef<() => void>(() => {});
  const recomputePlacementCoordinatesRef = useRef<() => void>(() => {});

  const [mapStyle, setMapStyle] = useState<FarmMapStyleId>('satellite');
  const [drawMode, setDrawMode] = useState<string>('simple_select');
  const toolsPanelTheme = useMemo(() => {
    if (drawMode === 'draw_polygon') {
      return {
        bg: 'blue.50',
        borderColor: 'blue.200',
        darkBg: 'blue.900',
        darkBorderColor: 'blue.800',
      };
    }
    if (drawMode === 'direct_select') {
      return {
        bg: 'purple.50',
        borderColor: 'purple.200',
        darkBg: 'purple.900',
        darkBorderColor: 'purple.800',
      };
    }
    // simple_select (default)
    return {
      bg: 'gray.50',
      borderColor: 'gray.200',
      darkBg: 'whiteAlpha.50',
      darkBorderColor: 'whiteAlpha.200',
    };
  }, [drawMode]);
  const [sectors, setSectors] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [placements, setPlacements] = useState<FarmMapSensorPlacement[]>(() =>
    typeof window === 'undefined' ? [] : loadSensorPlacements()
  );
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [pickSensorKey, setPickSensorKey] = useState<string | null>(null);
  const [placementPickActive, setPlacementPickActive] = useState(false);
  const [apiZones, setApiZones] = useState<{ id: number; name: string }[]>([]);
  const [dataZoneId, setDataZoneId] = useState<number | null>(null);
  const [showMapScrollHint, setShowMapScrollHint] = useState(true);
  const [activeGraph, setActiveGraph] = useState<ActiveGraphResponse | null>(
    null
  );
  const [zoneSensorsLoading, setZoneSensorsLoading] = useState(false);
  const [markerLastRead, setMarkerLastRead] = useState<
    Record<string, { title: string; valueLine: string }>
  >({});

  const zoneMapSensors = useMemo(
    () =>
      dataZoneId == null ? [] : activeGraphToMapSensorDefinitions(activeGraph),
    [dataZoneId, activeGraph]
  );

  dataZoneIdRef.current = dataZoneId;
  placementsRef.current = placements;

  const fetchSingleMarkerRead = useCallback(async (placementId: string) => {
    const row = placementsRef.current.find((r) => r.id === placementId);
    if (!row) return;
    const def = getMapSensorDefinition(row.sensorKey);
    if (!def) return;
    try {
      const payload = await fetchMapSensorHoverPayload(
        def,
        row.zoneId ?? dataZoneIdRef.current
      );
      setMarkerLastRead((prev) => ({
        ...prev,
        [placementId]: {
          title: payload.title,
          valueLine: payload.line,
        },
      }));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchMarkerReadRef.current = (id: string) => {
      void fetchSingleMarkerRead(id);
    };
  }, [fetchSingleMarkerRead]);

  useEffect(() => {
    if (placements.length === 0) {
      setMarkerLastRead({});
      return;
    }
    let cancelled = false;
    const t = window.setTimeout(() => {
      void (async () => {
        const entries = await Promise.all(
          placements.map(async (p) => {
            const def = getMapSensorDefinition(p.sensorKey);
            if (!def) return { id: p.id, data: null as null };
            const zone = p.zoneId ?? dataZoneId;
            try {
              const payload = await fetchMapSensorHoverPayload(def, zone);
              return {
                id: p.id,
                data: {
                  title: payload.title,
                  valueLine: payload.line,
                },
              };
            } catch {
              return { id: p.id, data: null };
            }
          })
        );
        if (cancelled) return;
        const next: Record<string, { title: string; valueLine: string }> = {};
        for (const e of entries) {
          if (e.data) next[e.id] = e.data;
        }
        setMarkerLastRead(next);
      })();
    }, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [placements, dataZoneId]);

  useEffect(() => {
    api
      .get<{ id: number; name: string }[]>('/api/zones-names-per-user/')
      .then((res) => {
        const list = res.data ?? [];
        setApiZones(list);
        setDataZoneId((z) => (z == null && list.length ? list[0].id : z));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (dataZoneId == null) {
      setActiveGraph(null);
      setZoneSensorsLoading(false);
      return;
    }
    let cancelled = false;
    setZoneSensorsLoading(true);
    getActiveGraphs(dataZoneId)
      .then((ag) => {
        if (!cancelled) setActiveGraph(ag);
      })
      .catch(() => {
        if (!cancelled) setActiveGraph(null);
      })
      .finally(() => {
        if (!cancelled) setZoneSensorsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [dataZoneId]);

  useEffect(() => {
    if (!pickSensorKey) return;
    if (dataZoneId == null) {
      setPickSensorKey(null);
      setPlacementPickActive(false);
      return;
    }
    if (
      !zoneSensorsLoading &&
      !zoneMapSensors.some((d) => d.key === pickSensorKey)
    ) {
      setPickSensorKey(null);
      setPlacementPickActive(false);
    }
  }, [dataZoneId, zoneMapSensors, pickSensorKey, zoneSensorsLoading]);

  useEffect(() => {
    placementPickRef.current = {
      active: placementPickActive,
      sensorKey: pickSensorKey,
      sectorId: selectedSectorId,
    };
  }, [placementPickActive, pickSensorKey, selectedSectorId]);

  useEffect(() => {
    selectedSectorIdRef.current = selectedSectorId;
    updateSectorLabelRef.current();
  }, [selectedSectorId]);

  useEffect(() => {
    updateSectorLabelRef.current();
  }, [sectors]);

  useEffect(() => {
    const shell = mapShellRef.current;
    if (!shell) return;
    const scrollEl = getScrollableParent(shell);
    const threshold = 12;
    const onScroll = () => {
      const top = scrollEl
        ? scrollEl.scrollTop
        : window.scrollY || document.documentElement.scrollTop;
      if (top > threshold) setShowMapScrollHint(false);
    };
    const target: HTMLElement | Window = scrollEl ?? window;
    target.addEventListener('scroll', onScroll, { passive: true });
    return () => target.removeEventListener('scroll', onScroll);
  }, []);

  const syncFromDraw = useCallback(() => {
    const draw = drawRef.current;
    if (!draw) return;
    const all = draw.getAll();
    setSectors(
      all.features.map((f) => ({
        id: String(f.id ?? ''),
        name: sectorName(
          f.properties as Record<string, unknown> | null | undefined
        ),
      }))
    );
  }, []);

  const rebuildMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const oldRoots = [...markerRootsRef.current.values()];
    markerRootsRef.current.clear();
    const oldMarkers = [...markersDomRef.current.values()];
    markersDomRef.current.clear();

    for (const m of oldMarkers) {
      try {
        m.remove();
      } catch {
        /* marker déjà retiré */
      }
    }

    window.setTimeout(() => {
      for (const root of oldRoots) {
        try {
          root.unmount();
        } catch {
          /* root déjà démonté ou conteneur retiré */
        }
      }
    }, 0);

    for (const p of placementsRef.current) {
      const snap = markerLastRead[p.id];
      const shortLine =
        snap?.valueLine?.replace(/^Dernière mesure\s*:\s*/i, '').trim() ?? '';

      const wrap = document.createElement('div');
      wrap.style.cssText =
        'display:flex;flex-direction:column;align-items:center;width:auto;max-width:120px;touch-action:manipulation;';

      const chip = document.createElement('div');
      chip.style.cssText =
        'width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,.28),0 0 0 1px rgba(255,255,255,.45);cursor:grab;border:2.5px solid #fff;flex-shrink:0;touch-action:none;';
      chip.title = 'Glisser pour déplacer le capteur (dans la zone)';
      chip.style.background = markerBackgroundForSensor(p.sensorKey);
      const host = document.createElement('div');
      chip.appendChild(host);
      wrap.appendChild(chip);

      if (shortLine) {
        const cap = document.createElement('div');
        cap.textContent =
          shortLine.length > 30 ? `${shortLine.slice(0, 28)}…` : shortLine;
        cap.style.cssText =
          'font-size:10px;font-weight:700;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.95);text-align:center;line-height:1.15;margin-top:4px;max-width:116px;word-wrap:break-word;';
        wrap.appendChild(cap);
      }

      const root = createRoot(host);
      root.render(
        <FarmMapSensorMarkerIcon sensorKey={p.sensorKey} size={22} />
      );
      markerRootsRef.current.set(p.id, root);

      const marker = new mapboxgl.Marker({
        element: wrap,
        anchor: 'bottom',
        pitchAlignment: 'map',
        rotationAlignment: 'map',
        draggable: true,
      })
        .setLngLat([p.lng, p.lat])
        .addTo(map);
      markersDomRef.current.set(p.id, marker);

      let revertLngLat: [number, number] = [p.lng, p.lat];
      marker.on('dragstart', () => {
        const cur = placementsRef.current.find((r) => r.id === p.id);
        revertLngLat = cur ? [cur.lng, cur.lat] : [p.lng, p.lat];
        chip.style.cursor = 'grabbing';
      });
      marker.on('dragend', () => {
        chip.style.cursor = 'grab';
        const ll = marker.getLngLat();
        const drawInst = drawRef.current;
        if (!drawInst) return;
        const feat = drawInst
          .getAll()
          .features.find((f) => String(f.id) === p.sectorId);
        const geom = feat?.geometry;
        if (
          !geom ||
          typeof geom !== 'object' ||
          !pointInPolygonGeometry(
            ll.lng,
            ll.lat,
            geom as { type: string; coordinates: unknown }
          )
        ) {
          marker.setLngLat(revertLngLat);
          toast({
            title: 'Hors zone',
            description: 'Le capteur doit rester dans son secteur.',
            status: 'warning',
            duration: 2200,
          });
          return;
        }
        const c = centroidFromPolygonGeometry(
          geom as { type: string; coordinates: unknown }
        );
        if (!c) {
          marker.setLngLat(revertLngLat);
          return;
        }
        const relLng = ll.lng - c[0];
        const relLat = ll.lat - c[1];
        const next = placementsRef.current.map((row) =>
          row.id === p.id
            ? { ...row, lng: ll.lng, lat: ll.lat, relLng, relLat }
            : row
        );
        setPlacements(next);
        saveSensorPlacements(next);
        fetchMarkerReadRef.current(p.id);
      });

      const popup = new mapboxgl.Popup({
        offset: 28,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px',
      });

      let hideTimer: ReturnType<typeof setTimeout> | null = null;
      let popupHoverCleanup: (() => void) | null = null;
      let hoverGen = 0;

      const cancelHidePopup = () => {
        if (hideTimer) {
          clearTimeout(hideTimer);
          hideTimer = null;
        }
      };

      const scheduleHidePopup = () => {
        cancelHidePopup();
        hideTimer = setTimeout(() => {
          popupHoverCleanup?.();
          popupHoverCleanup = null;
          popup.remove();
          hideTimer = null;
        }, 550);
      };

      const bindPopupHover = () => {
        popupHoverCleanup?.();
        const pe = popup.getElement();
        if (!pe) return;
        const onPeEnter = () => cancelHidePopup();
        const onPeLeave = () => scheduleHidePopup();
        pe.addEventListener('mouseenter', onPeEnter);
        pe.addEventListener('mouseleave', onPeLeave);
        popupHoverCleanup = () => {
          pe.removeEventListener('mouseenter', onPeEnter);
          pe.removeEventListener('mouseleave', onPeLeave);
        };
      };

      wrap.addEventListener('mouseenter', () => {
        cancelHidePopup();
        const gen = ++hoverGen;
        void (async () => {
          const def = getMapSensorDefinition(p.sensorKey);
          const pos = marker.getLngLat();
          popup
            .setLngLat(pos)
            .setHTML(
              '<div style=" padding:2px; color:black; font-family:system-ui,sans-serif">Chargement…</div>'
            )
            .addTo(map);
          bindPopupHover();
          if (!def) {
            if (gen !== hoverGen) return;
            popup.setHTML(
              '<div style="padding:8px;font-family:system-ui,sans-serif">Capteur inconnu</div>'
            );
            bindPopupHover();
            return;
          }
          const zoneForReading =
            p.zoneId != null ? p.zoneId : dataZoneIdRef.current;
          const payload = await fetchMapSensorHoverPayload(def, zoneForReading);
          if (gen !== hoverGen) return;
          popup.setLngLat(marker.getLngLat());
          const esc = escapeHtmlForPopup;
          const safeTitle = esc(payload.title);
          const safeLine = esc(payload.line);
          const safeTime = payload.measuredAt ? esc(payload.measuredAt) : null;
          let deltaHtml = '';
          if (payload.deltaLine) {
            const col = payload.deltaLine.trim().startsWith('+')
              ? '#2f855a'
              : '#c53030';
            deltaHtml = `<div style="color:${col};font-size:13px;margin-top:6px;font-weight:600">${esc(payload.deltaLine)}</div>`;
          }
          const timeHtml = safeTime
            ? `<div style="font-size:12px;color:#64748b;margin-top:6px">Mesuré le ${safeTime}</div>`
            : '';
          popup.setHTML(`
            <div style="font-family:system-ui,-apple-system,sans-serif;padding:8px 6px;min-width:210px;color:#0f172a">
              <div style="font-weight:700;font-size:15px;line-height:1.3">${safeTitle}</div>
              <div style="margin-top:8px;font-size:14px;line-height:1.4">${safeLine}</div>
              ${timeHtml}
              ${deltaHtml}
            </div>
          `);
          bindPopupHover();
        })();
      });
      wrap.addEventListener('mouseleave', () => {
        scheduleHidePopup();
      });
    }
  }, [markerLastRead]);

  rebuildMarkersRef.current = rebuildMarkers;

  useEffect(() => {
    rebuildMarkers();
  }, [placements, dataZoneId, rebuildMarkers]);

  useEffect(() => {
    if (!token || !containerRef.current) return;

    const containerEl = containerRef.current;
    // Mapbox warns if container has any child nodes (incl. React comment nodes).
    while (containerEl.firstChild) {
      containerEl.removeChild(containerEl.firstChild);
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerEl,
      style: DEFAULT_MAP_STYLES[styleRef.current],
      center: [lon, lat],
      zoom: 14,
      attributionControl: false,
    });

    const logoCtl = (map as unknown as { _logoControl?: mapboxgl.IControl })
      ._logoControl;
    if (logoCtl) map.removeControl(logoCtl);

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: true }),
      'top-right'
    );
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 100 }), 'bottom-left');

    const drawControl = new MapboxDraw({
      displayControlsDefault: false,
      defaultMode: 'simple_select',
      controls: {},
      // Required so `setFeatureProperty(..., 'color', ...)` appears as `user_color` on rendered features.
      userProperties: true,
      styles: DRAW_STYLES,
    }) as unknown as mapboxgl.IControl;

    drawControlRef.current = drawControl;
    const draw = asDraw(drawControl);
    drawRef.current = draw;
    map.addControl(drawControl, 'top-left');

    const updateAllSectorLabels = () => {
      const m = mapRef.current;
      const d = drawRef.current;
      for (const mk of sectorLabelsMarkersRef.current) {
        try {
          mk.remove();
        } catch {
          /* */
        }
      }
      sectorLabelsMarkersRef.current = [];
      if (!m || !d) return;
      const sid = selectedSectorIdRef.current;
      for (const feat of d.getAll().features) {
        const geom = feat.geometry;
        if (!geom || typeof geom !== 'object') continue;
        const c = centroidFromPolygonGeometry(
          geom as { type: string; coordinates: unknown }
        );
        if (!c) continue;
        const name =
          sectorName(
            feat.properties as Record<string, unknown> | null | undefined
          ) || 'Zone';
        const el = document.createElement('div');
        el.textContent = name;
        const isSelected = sid != null && String(feat.id) === sid;
        el.style.cssText =
          'max-width:240px;padding:6px 12px;border-radius:8px;font-size:13px;font-weight:700;' +
          'background:' +
          (isSelected ? 'rgba(219,234,254,.97)' : 'rgba(255,255,255,.95)') +
          ';color:#0f172a;box-shadow:0 2px 14px rgba(0,0,0,.22);' +
          'border:1px solid ' +
          (isSelected ? 'rgba(37,99,235,.45)' : 'rgba(15,23,42,.12)') +
          ';pointer-events:none;text-align:center;line-height:1.25;' +
          'backdrop-filter:saturate(180%) blur(4px);';
        const mk = new mapboxgl.Marker({
          element: el,
          anchor: 'bottom',
          pitchAlignment: 'map',
          rotationAlignment: 'map',
        })
          .setLngLat(c)
          .addTo(m);
        sectorLabelsMarkersRef.current.push(mk);
      }
    };
    updateSectorLabelRef.current = updateAllSectorLabels;

    const recomputePlacementCoordinates = () => {
      const d = drawRef.current;
      if (!d) return;
      const fc = d.getAll().features;
      const next: FarmMapSensorPlacement[] = [];
      let changed = false;
      for (const p of placementsRef.current) {
        const feat = fc.find((f) => String(f.id) === p.sectorId);
        if (!feat?.geometry || typeof feat.geometry !== 'object') {
          changed = true;
          continue;
        }
        const c = centroidFromPolygonGeometry(
          feat.geometry as { type: string; coordinates: unknown }
        );
        if (!c) {
          next.push(p);
          continue;
        }
        let relLng = p.relLng;
        let relLat = p.relLat;
        if (relLng == null || relLat == null) {
          relLng = p.lng - c[0];
          relLat = p.lat - c[1];
          changed = true;
        }
        const lng = c[0] + relLng;
        const lat = c[1] + relLat;
        if (
          Math.abs(lng - p.lng) > 1e-12 ||
          Math.abs(lat - p.lat) > 1e-12 ||
          p.relLng !== relLng ||
          p.relLat !== relLat
        ) {
          changed = true;
        }
        next.push({ ...p, lng, lat, relLng, relLat });
      }
      if (changed || next.length !== placementsRef.current.length) {
        setPlacements(next);
        saveSensorPlacements(next);
      }
    };
    recomputePlacementCoordinatesRef.current = recomputePlacementCoordinates;

    const hydrate = () => {
      const stored = loadFarmSectorsFromStorage();
      draw.deleteAll();
      if (stored.features.length > 0) {
        draw.add(stored as unknown as object);
        fitMapToCollection(map, stored);
      }
      // Ensure older stored zones still get a per-feature color.
      for (const feat of draw.getAll().features) {
        const fid = String(feat.id);
        const props = feat.properties as Record<string, unknown> | null;
        const current = props?.color;
        if (typeof current === 'string' && current.trim()) continue;
        try {
          draw.setFeatureProperty(fid, 'color', colorForZoneTraceId(fid));
        } catch {
          /* ignore */
        }
      }
      syncFromDraw();
      updateAllSectorLabels();
    };

    const onMapClick = (e: mapboxgl.MapMouseEvent) => {
      const t = e.originalEvent.target as HTMLElement | null;
      if (t?.closest('.mapboxgl-marker')) return;

      const { active, sensorKey, sectorId } = placementPickRef.current;
      if (!active || !sensorKey || !sectorId) return;

      const feat = draw
        .getAll()
        .features.find((f) => String(f.id) === sectorId);
      const geom = feat?.geometry;
      if (!geom || typeof geom !== 'object') {
        toast({
          title: 'Zone invalide',
          status: 'warning',
          duration: 2000,
        });
        return;
      }
      if (
        !pointInPolygonGeometry(
          e.lngLat.lng,
          e.lngLat.lat,
          geom as { type: string; coordinates: unknown }
        )
      ) {
        toast({
          title: 'Hors zone',
          description: 'Placez le capteur à l’intérieur du polygone choisi.',
          status: 'warning',
          duration: 2800,
          isClosable: true,
        });
        return;
      }

      const c = centroidFromPolygonGeometry(
        geom as { type: string; coordinates: unknown }
      );
      if (!c) {
        toast({
          title: 'Zone invalide',
          description: 'Impossible de calculer le centre du polygone.',
          status: 'warning',
          duration: 2000,
        });
        return;
      }

      const id = newPlacementId();
      const row: FarmMapSensorPlacement = {
        id,
        sectorId,
        sensorKey,
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
        relLng: e.lngLat.lng - c[0],
        relLat: e.lngLat.lat - c[1],
        zoneId: dataZoneIdRef.current ?? null,
      };
      const next = [...placementsRef.current, row];
      setPlacements(next);
      saveSensorPlacements(next);
      fetchMarkerReadRef.current(id);
      toast({
        title: 'Capteur placé',
        status: 'success',
        duration: 1500,
      });
    };

    map.on('click', onMapClick);

    const onLoad = () => {
      hydrate();
      recomputePlacementCoordinates();
      rebuildMarkersRef.current();
      requestAnimationFrame(() => map.resize());
    };

    if (map.isStyleLoaded()) onLoad();
    else map.once('load', onLoad);

    const onDraw = () => {
      syncFromDraw();
      updateAllSectorLabels();
      recomputePlacementCoordinates();
    };
    map.on('draw.update', onDraw);
    map.on('draw.delete', onDraw);
    map.on('draw.modechange', (e: { mode: string }) =>
      setDrawMode(e.mode ?? 'simple_select')
    );

    map.on('draw.create', (e: { features: Array<{ id?: string }> }) => {
      const id = e.features[0]?.id;
      if (id != null) {
        const n = draw.getAll().features.length;
        const fid = String(id);
        draw.setFeatureProperty(fid, 'name', `Secteur ${n}`);
        draw.setFeatureProperty(fid, 'color', colorForZoneTraceId(fid));
      }
      syncFromDraw();
      updateAllSectorLabels();
    });

    const onWinResize = () => map.resize();
    window.addEventListener('resize', onWinResize);

    mapRef.current = map;

    return () => {
      window.removeEventListener('resize', onWinResize);
      map.off('click', onMapClick);
      recomputePlacementCoordinatesRef.current = () => {};
      for (const mk of sectorLabelsMarkersRef.current) {
        try {
          mk.remove();
        } catch {
          /* */
        }
      }
      sectorLabelsMarkersRef.current = [];
      updateSectorLabelRef.current = () => {};

      const rootsToUnmount = [...markerRootsRef.current.values()];
      markerRootsRef.current.clear();
      const markersToRemove = [...markersDomRef.current.values()];
      markersDomRef.current.clear();

      drawRef.current = null;
      drawControlRef.current = null;
      mapRef.current = null;

      const mapInstance = map;

      queueMicrotask(() => {
        for (const root of rootsToUnmount) {
          try {
            root.unmount();
          } catch {
            /* root déjà démonté ou conteneur retiré */
          }
        }
        for (const m of markersToRemove) {
          try {
            m.remove();
          } catch {
            /* marker déjà retiré */
          }
        }
        try {
          mapInstance.remove();
        } catch {
          /* carte déjà détruite */
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- map init once per token/lat/lon
  }, [lat, lon, syncFromDraw, token]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const canvas = map.getCanvas();
    if (placementPickActive && pickSensorKey && selectedSectorId) {
      canvas.style.cursor = 'crosshair';
    } else {
      canvas.style.cursor = '';
    }
  }, [placementPickActive, pickSensorKey, selectedSectorId]);

  const handleSave = () => {
    const draw = drawRef.current;
    if (!draw) return;
    saveFarmSectorsToStorage(draw.getAll());
    toast({
      title: 'Secteurs enregistrés',
      description: 'La géométrie est stockée localement (GeoJSON).',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleStyleChange = (next: FarmMapStyleId) => {
    const map = mapRef.current;
    const draw = drawRef.current;
    const drawControl = drawControlRef.current;
    if (!map || !draw || !drawControl) return;

    const current = draw.getAll();
    map.removeControl(drawControl);
    styleRef.current = next;
    setMapStyle(next);
    map.setStyle(DEFAULT_MAP_STYLES[next]);

    map.once('style.load', () => {
      map.addControl(drawControl, 'top-left');
      draw.deleteAll();
      if (current.features.length > 0) {
        draw.add(current as unknown as object);
      }
      syncFromDraw();
      requestAnimationFrame(() => {
        map.resize();
        recomputePlacementCoordinatesRef.current();
        rebuildMarkersRef.current();
        updateSectorLabelRef.current();
      });
    });
  };

  const updateSectorName = (id: string, name: string) => {
    drawRef.current?.setFeatureProperty(id, 'name', name);
    syncFromDraw();
  };

  const deleteSector = (id: string) => {
    drawRef.current?.delete(id);
    syncFromDraw();
    const draw = drawRef.current;
    if (draw) saveFarmSectorsToStorage(draw.getAll());
    setPlacements((prev) => {
      const next = prev.filter((p) => p.sectorId !== id);
      saveSensorPlacements(next);
      return next;
    });
    if (selectedSectorId === id) setSelectedSectorId(null);
  };

  const trashSelection = () => {
    const draw = drawRef.current;
    if (!draw) return;
    draw.trash();
    syncFromDraw();
  };

  const focusSector = (id: string) => {
    const map = mapRef.current;
    const draw = drawRef.current;
    if (!map || !draw) return;
    const f = draw.getAll().features.find((x) => String(x.id) === id);
    if (!f?.geometry || typeof f.geometry !== 'object') return;
    const g = f.geometry as {
      type: string;
      coordinates: unknown;
    };
    const fc: FarmSectorsFeatureCollection = {
      type: 'FeatureCollection',
      features: [f as FarmSectorsFeatureCollection['features'][number]],
    };
    if (g.type === 'Polygon' || g.type === 'MultiPolygon') {
      fitMapToCollection(map, fc);
    }
  };

  const removePlacement = (id: string) => {
    setPlacements((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveSensorPlacements(next);
      return next;
    });
  };

  const exitPlacementMode = useCallback(() => {
    setPlacementPickActive(false);
    setPickSensorKey(null);
  }, []);

  const activeSectorName =
    sectors.find((s) => s.id === selectedSectorId)?.name ?? null;

  if (!token) {
    return (
      <Alert status="warning" borderRadius="md" variant="subtle">
        <AlertIcon />
        <Box>
          <AlertTitle>Token Mapbox requis</AlertTitle>
          <AlertDescription>
            Définissez{' '}
            <Text as="span" fontFamily="mono" fontSize="sm">
              NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
            </Text>{' '}
            dans votre environnement pour afficher la carte agricole Mapbox
            (satellite / parcelles).
          </AlertDescription>
        </Box>
      </Alert>
    );
  }

  return (
    <>
      <VStack align="stretch" spacing={4} w="100%">
        <Box
          ref={mapShellRef}
          position="relative"
          w="100%"
          borderRadius="lg"
          overflow="hidden"
          borderWidth="1px"
          borderColor="gray.200"
          _dark={{ borderColor: 'whiteAlpha.200' }}
          sx={{
            '& .mapboxgl-ctrl-logo': { display: 'none !important' },
            '& .mapboxgl-ctrl-attrib': { display: 'none !important' },
            '& .mapboxgl-ctrl-attrib-button': { display: 'none !important' },
          }}
        >
          <Box
            ref={containerRef}
            w="100%"
            minH={{ base: 'min(56vh, 400px)', md: 'min(52vh, 460px)' }}
            h={{ base: 'min(56vh, 400px)', md: 'min(52vh, 460px)' }}
            bg="gray.900"
          />
          {showMapScrollHint && (
            <Button
              position="absolute"
              bottom={5}
              left="50%"
              transform="translateX(-50%)"
              zIndex={4}
              size="sm"
              fontWeight="medium"
              colorScheme="gray"
              bg="white"
              color="gray.800"
              _hover={{ bg: 'gray.50' }}
              _dark={{
                bg: 'gray.800',
                color: 'gray.100',
                _hover: { bg: 'gray.700' },
              }}
              boxShadow="lg"
              borderRadius="full"
              px={6}
              py={5}
              h="auto"
              whiteSpace="normal"
              textAlign="center"
              maxW="min(92%, 22rem)"
              lineHeight="short"
              onClick={() => {
                toolsRef.current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
                setShowMapScrollHint(false);
              }}
            >
              Scroll to edit the zone or add sensors
            </Button>
          )}
        </Box>

        <Box
          ref={toolsRef}
          borderWidth="1px"
          borderRadius="md"
          borderColor={toolsPanelTheme.borderColor}
          bg={toolsPanelTheme.bg}
          _dark={{
            borderColor: toolsPanelTheme.darkBorderColor,
            bg: toolsPanelTheme.darkBg,
          }}
          p={{ base: 2, md: 3 }}
        >
          <Flex
            direction={{ base: 'column', md: 'row' }}
            gap={3}
            align={{ md: 'flex-end' }}
            flexWrap="wrap"
          >
            <Wrap spacing={2} flex="1">
              <WrapItem>
                <ButtonGroup size="sm" isAttached variant="outline">
                  <Button
                    variant={mapStyle === 'satellite' ? 'solid' : 'outline'}
                    colorScheme="green"
                    onClick={() => handleStyleChange('satellite')}
                  >
                    Satellite
                  </Button>
                  <Button
                    variant={mapStyle === 'terrain' ? 'solid' : 'outline'}
                    colorScheme="green"
                    onClick={() => handleStyleChange('terrain')}
                  >
                    Relief
                  </Button>
                </ButtonGroup>
              </WrapItem>
              <WrapItem>
                <ButtonGroup size="sm" isAttached variant="outline">
                  <Button
                    colorScheme={drawMode === 'draw_polygon' ? 'blue' : 'gray'}
                    variant={drawMode === 'draw_polygon' ? 'solid' : 'outline'}
                    onClick={() => drawRef.current?.changeMode('draw_polygon')}
                  >
                    Tracer
                  </Button>
                  <Button
                    colorScheme={drawMode === 'simple_select' ? 'blue' : 'gray'}
                    variant={drawMode === 'simple_select' ? 'solid' : 'outline'}
                    onClick={() => drawRef.current?.changeMode('simple_select')}
                  >
                    Sélection
                  </Button>
                  <Button
                    colorScheme={drawMode === 'direct_select' ? 'blue' : 'gray'}
                    variant={drawMode === 'direct_select' ? 'solid' : 'outline'}
                    onClick={() => {
                      const d = drawRef.current;
                      const ids = d?.getSelectedIds() ?? [];
                      if (d && ids.length) {
                        d.changeMode('direct_select', { featureId: ids[0] });
                      } else {
                        toast({
                          title: 'Sélection requise',
                          description:
                            'Choisissez un secteur (mode Sélection), puis Éditer.',
                          status: 'info',
                          duration: 2500,
                        });
                      }
                    }}
                  >
                    Éditer
                  </Button>
                  <Button
                    colorScheme="orange"
                    variant="outline"
                    onClick={trashSelection}
                  >
                    Suppr. sélection
                  </Button>
                  <Button colorScheme="green" onClick={handleSave}>
                    Enregistrer
                  </Button>
                </ButtonGroup>
              </WrapItem>
              <WrapItem>
                <Popover placement="bottom-start" closeOnBlur>
                  <PopoverTrigger>
                    <Button
                      size="sm"
                      leftIcon={<AddIcon boxSize={3} />}
                      colorScheme={
                        pickSensorKey || placementPickActive ? 'blue' : 'gray'
                      }
                      variant={pickSensorKey ? 'solid' : 'outline'}
                      borderRadius="md"
                      fontWeight="semibold"
                      boxShadow={pickSensorKey ? 'sm' : 'none'}
                    >
                      Ajouter un capteur
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    w="min(92vw, 320px)"
                    maxH="min(52vh, 360px)"
                    display="flex"
                    flexDirection="column"
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor="gray.100"
                    boxShadow="0 12px 40px rgba(15, 23, 42, 0.12)"
                    _dark={{
                      borderColor: 'whiteAlpha.200',
                      bg: 'gray.800',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
                    }}
                    overflow="hidden"
                  >
                    <PopoverArrow />
                    <PopoverHeader
                      borderBottomWidth="1px"
                      borderColor="gray.100"
                      _dark={{ borderColor: 'whiteAlpha.200' }}
                      py={3}
                      px={4}
                      fontWeight="semibold"
                      fontSize="sm"
                    >
                      Placer un capteur sur la carte
                    </PopoverHeader>
                    <PopoverBody
                      p={4}
                      pt={3}
                      overflow="hidden"
                      display="flex"
                      flexDir="column"
                      flex="1"
                      minH={0}
                    >
                      <Text
                        fontSize="xs"
                        lineHeight="1.5"
                        color="gray.600"
                        _dark={{ color: 'gray.400' }}
                        mb={3}
                      >
                        Les types listés correspondent aux graphiques actifs
                        pour la zone API (comme Sol / Station / Plante).
                        Sélectionnez un type, puis cliquez{' '}
                        <Text
                          as="span"
                          fontWeight="semibold"
                          color="gray.700"
                          _dark={{ color: 'gray.300' }}
                        >
                          à l’intérieur du secteur
                        </Text>{' '}
                        sur la carte. Le marqueur affiche la dernière mesure au
                        survol.
                      </Text>
                      {dataZoneId == null && (
                        <Alert
                          status="warning"
                          variant="subtle"
                          borderRadius="md"
                          py={2}
                          mb={3}
                          fontSize="xs"
                        >
                          <AlertIcon />
                          <AlertDescription fontSize="xs" lineHeight="1.45">
                            Choisissez d&apos;abord une zone API dans le
                            sélecteur ci-dessous.
                          </AlertDescription>
                        </Alert>
                      )}
                      {dataZoneId != null && zoneSensorsLoading && (
                        <Text fontSize="xs" color="gray.500" mb={3}>
                          Chargement des capteurs de la zone…
                        </Text>
                      )}
                      {dataZoneId != null &&
                        !zoneSensorsLoading &&
                        zoneMapSensors.length === 0 && (
                          <Text fontSize="xs" color="gray.500" mb={3}>
                            Aucun capteur actif pour cette zone. Vérifiez la
                            configuration des graphiques.
                          </Text>
                        )}
                      <Divider
                        mb={2}
                        borderColor="gray.100"
                        _dark={{ borderColor: 'whiteAlpha.200' }}
                      />
                      <VStack
                        align="stretch"
                        spacing={2}
                        overflowY="auto"
                        flex="1"
                        minH={0}
                        pr={1}
                        sx={{
                          '&::-webkit-scrollbar': { width: '6px' },
                          '&::-webkit-scrollbar-thumb': {
                            background: 'var(--chakra-colors-gray-300)',
                            borderRadius: 'full',
                          },
                        }}
                      >
                        {zoneMapSensors.map((def) => {
                          const active = pickSensorKey === def.key;
                          const bg = markerBackgroundForSensor(def.key);
                          return (
                            <Button
                              key={def.key}
                              size="sm"
                              variant="unstyled"
                              justifyContent="flex-start"
                              fontWeight="normal"
                              h="auto"
                              py={2.5}
                              px={3}
                              borderRadius="lg"
                              borderWidth="2px"
                              borderColor={active ? 'blue.500' : 'transparent'}
                              bg={active ? 'blue.50' : 'gray.50'}
                              color="gray.800"
                              _dark={{
                                bg: active ? 'whiteAlpha.100' : 'whiteAlpha.50',
                                borderColor: active
                                  ? 'blue.300'
                                  : 'transparent',
                                color: 'gray.100',
                              }}
                              _hover={{
                                bg: active ? 'blue.50' : 'gray.100',
                                _dark: {
                                  bg: active
                                    ? 'whiteAlpha.150'
                                    : 'whiteAlpha.100',
                                },
                              }}
                              onClick={() => {
                                setPickSensorKey(def.key);
                                setPlacementPickActive(true);
                              }}
                            >
                              <HStack spacing={3} w="100%" align="center">
                                <Flex
                                  w="40px"
                                  h="40px"
                                  borderRadius="md"
                                  align="center"
                                  justify="center"
                                  flexShrink={0}
                                  bg={bg}
                                  boxShadow="inset 0 1px 0 rgba(255,255,255,0.12)"
                                >
                                  <FarmMapSensorMarkerIcon
                                    sensorKey={def.key}
                                    size={20}
                                    color="#ffffff"
                                  />
                                </Flex>
                                <Text
                                  fontSize="sm"
                                  textAlign="left"
                                  noOfLines={2}
                                  flex="1"
                                  fontWeight={active ? 'semibold' : 'medium'}
                                >
                                  {def.label}
                                </Text>
                                {active ? (
                                  <CheckIcon color="blue.500" boxSize={4} />
                                ) : null}
                              </HStack>
                            </Button>
                          );
                        })}
                      </VStack>
                      {placementPickActive && pickSensorKey && (
                        <Button
                          size="sm"
                          mt={4}
                          w="100%"
                          variant="outline"
                          colorScheme="gray"
                          leftIcon={<CloseIcon boxSize={3} />}
                          borderRadius="lg"
                          onClick={exitPlacementMode}
                        >
                          Annuler le placement
                        </Button>
                      )}
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </WrapItem>
              {placementPickActive && pickSensorKey && (
                <WrapItem>
                  <Button
                    size="sm"
                    colorScheme="green"
                    variant="solid"
                    leftIcon={<CheckIcon boxSize={3} />}
                    borderRadius="md"
                    fontWeight="semibold"
                    onClick={exitPlacementMode}
                  >
                    Terminer l&apos;ajout
                  </Button>
                </WrapItem>
              )}
            </Wrap>
            {apiZones.length > 0 && (
              <FormControl
                maxW={{ base: '100%', md: '220px' }}
                color="black"
                minW="180px"
              >
                <FormLabel
                  fontSize="xs"
                  mb={1}
                  color="black"
                  fontWeight="semibold"
                >
                  Zone API (données réelles)
                </FormLabel>
                <Select
                  size="sm"
                  value={dataZoneId ?? ''}
                  color="black"
                  onChange={(e) =>
                    setDataZoneId(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                >
                  {apiZones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}
          </Flex>
        </Box>

        {placementPickActive && pickSensorKey && (
          <Alert
            status="info"
            variant="left-accent"
            borderRadius="lg"
            py={3}
            borderWidth="1px"
            borderColor="blue.100"
            bg="blue.50"
            color="gray.800"
            display="flex"
            flexDirection={{ base: 'column', sm: 'row' }}
            alignItems={{ base: 'stretch', sm: 'flex-start' }}
            gap={3}
            _dark={{
              bg: 'whiteAlpha.100',
              borderColor: 'blue.800',
              color: 'gray.100',
            }}
          >
            <AlertIcon color="blue.500" mt={{ base: 0, sm: 1 }} />
            <Box flex="1" minW={0}>
              <AlertTitle fontSize="sm" mb={0.5}>
                Mode placement
              </AlertTitle>
              <AlertDescription
                fontSize="xs"
                lineHeight="1.5"
                color="gray.600"
                _dark={{ color: 'gray.400' }}
              >
                Cliquez dans le polygone du secteur{' '}
                <Text
                  as="span"
                  fontWeight="semibold"
                  color="gray.800"
                  _dark={{ color: 'gray.100' }}
                >
                  {activeSectorName ??
                    '— sélectionnez « Zone active » dans la liste Secteurs'}
                </Text>{' '}
                pour déposer le capteur. Quand vous avez fini, utilisez «
                Terminer l&apos;ajout ».
              </AlertDescription>
            </Box>
            <Button
              size="sm"
              colorScheme="blue"
              variant="solid"
              flexShrink={0}
              alignSelf={{ base: 'stretch', sm: 'center' }}
              leftIcon={<CheckIcon boxSize={3} />}
              onClick={exitPlacementMode}
            >
              Terminer l&apos;ajout des capteurs
            </Button>
          </Alert>
        )}

        {sectors.length > 0 && (
          <Box>
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color="gray.500"
              textTransform="uppercase"
              letterSpacing="0.06em"
              mb={2}
            >
              Secteurs
            </Text>
            <VStack
              align="stretch"
              color="black"
              spacing={2}
              maxH="200px"
              overflowY="auto"
            >
              {sectors.map((s) => (
                <Flex key={s.id} gap={2} align="center" flexWrap="wrap">
                  <FormControl flex="1" minW="140px">
                    <FormLabel fontSize="xs" mb={0}>
                      Nom
                    </FormLabel>
                    <Input
                      size="sm"
                      value={s.name}
                      onChange={(e) => updateSectorName(s.id, e.target.value)}
                      placeholder="Nom du secteur (ex. Zone 1)"
                    />
                  </FormControl>
                  <Button
                    size="sm"
                    variant={selectedSectorId === s.id ? 'solid' : 'outline'}
                    colorScheme="teal"
                    onClick={() => setSelectedSectorId(s.id)}
                  >
                    Zone active
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => focusSector(s.id)}
                  >
                    Centrer
                  </Button>
                  <IconButton
                    size="sm"
                    aria-label="Supprimer le secteur"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => deleteSector(s.id)}
                  />
                </Flex>
              ))}
            </VStack>
          </Box>
        )}

        {placements.length > 0 && (
          <Box>
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color="gray.500"
              textTransform="uppercase"
              letterSpacing="0.08em"
              mb={2}
            >
              Capteurs placés
            </Text>
            <VStack
              align="stretch"
              spacing={2}
              maxH="200px"
              overflowY="auto"
              pr={1}
              sx={{
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-thumb': {
                  background: 'var(--chakra-colors-gray-300)',
                  borderRadius: 'full',
                },
              }}
            >
              {placements.map((p) => {
                const def = getMapSensorDefinition(p.sensorKey);
                const bg = markerBackgroundForSensor(p.sensorKey);
                const sectorLabel =
                  sectors.find((x) => x.id === p.sectorId)?.name ?? p.sectorId;
                return (
                  <Flex
                    key={p.id}
                    align="center"
                    gap={3}
                    flexWrap="wrap"
                    p={3}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="gray.100"
                    bg="white"
                    boxShadow="sm"
                    _dark={{
                      bg: 'whiteAlpha.50',
                      borderColor: 'whiteAlpha.200',
                    }}
                  >
                    <Flex
                      w="42px"
                      h="42px"
                      borderRadius="full"
                      align="center"
                      justify="center"
                      flexShrink={0}
                      bg={bg}
                      boxShadow="0 2px 8px rgba(0,0,0,.15)"
                    >
                      <FarmMapSensorMarkerIcon
                        sensorKey={p.sensorKey}
                        size={20}
                      />
                    </Flex>
                    <Box flex="1" minW="140px">
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color="gray.800"
                        _dark={{ color: 'gray.100' }}
                        noOfLines={2}
                      >
                        {def?.label ?? p.sensorKey}
                      </Text>
                      <Text fontSize="xs" color="gray.500" mt={0.5}>
                        Secteur · {sectorLabel}
                      </Text>
                    </Box>
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      borderRadius="md"
                      onClick={() => removePlacement(p.id)}
                    >
                      Retirer
                    </Button>
                  </Flex>
                );
              })}
            </VStack>
          </Box>
        )}
      </VStack>

      <VStack
        position="fixed"
        right={{ base: 3, md: 5 }}
        top="50%"
        transform="translateY(-50%)"
        zIndex={1500}
        spacing={3}
        pointerEvents="none"
        sx={{ '& > *': { pointerEvents: 'auto' } }}
      >
        <Tooltip
          label="Voir la carte"
          placement="left"
          hasArrow
          openDelay={300}
        >
          <IconButton
            aria-label="Remonter vers la carte"
            icon={<ChevronUpIcon boxSize={5} />}
            size="md"
            borderRadius="full"
            boxShadow="lg"
            colorScheme="green"
            variant="solid"
            bg="white"
            color="green.700"
            borderWidth="1px"
            borderColor="green.200"
            _hover={{ bg: 'green.50' }}
            _dark={{
              bg: 'gray.800',
              color: 'green.200',
              borderColor: 'green.600',
              _hover: { bg: 'gray.700' },
            }}
            onClick={() => {
              mapShellRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
              setShowMapScrollHint(false);
              window.setTimeout(() => mapRef.current?.resize(), 450);
            }}
          />
        </Tooltip>
        <Tooltip
          label="Outils et configuration (zones, capteurs)"
          placement="left"
          hasArrow
          openDelay={300}
        >
          <IconButton
            aria-label="Descendre vers la configuration"
            icon={<ChevronDownIcon boxSize={5} />}
            size="md"
            borderRadius="full"
            boxShadow="lg"
            colorScheme="gray"
            variant="solid"
            bg="white"
            color="gray.700"
            borderWidth="1px"
            borderColor="gray.200"
            _hover={{ bg: 'gray.50' }}
            _dark={{
              bg: 'gray.800',
              color: 'gray.100',
              borderColor: 'whiteAlpha.300',
              _hover: { bg: 'gray.700' },
            }}
            onClick={() => {
              toolsRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }}
          />
        </Tooltip>
      </VStack>
    </>
  );
}
