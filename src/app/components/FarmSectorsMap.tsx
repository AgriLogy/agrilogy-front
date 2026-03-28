'use client';

import { DeleteIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Text,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { DEFAULT_MAP_STYLES, type FarmMapStyleId } from '@/app/types/farmMap';
import {
  loadFarmSectorsFromStorage,
  saveFarmSectorsToStorage,
  type FarmSectorsFeatureCollection,
} from '@/app/utils/farmSectorsStorage';

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
  const styleRef = useRef<FarmMapStyleId>('satellite');
  const toast = useToast();

  const [mapStyle, setMapStyle] = useState<FarmMapStyleId>('satellite');
  const [drawMode, setDrawMode] = useState<string>('simple_select');
  const [sectors, setSectors] = useState<Array<{ id: string; name: string }>>(
    []
  );

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

  useEffect(() => {
    if (!token || !containerRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: DEFAULT_MAP_STYLES[styleRef.current],
      center: [lon, lat],
      zoom: 14,
      attributionControl: true,
    });

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: true }),
      'top-right'
    );
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 100 }), 'bottom-left');

    const drawControl = new MapboxDraw({
      displayControlsDefault: false,
      defaultMode: 'simple_select',
      controls: {},
    }) as unknown as mapboxgl.IControl;

    drawControlRef.current = drawControl;
    const draw = asDraw(drawControl);
    drawRef.current = draw;
    map.addControl(drawControl, 'top-left');

    const hydrate = () => {
      const stored = loadFarmSectorsFromStorage();
      draw.deleteAll();
      if (stored.features.length > 0) {
        draw.add(stored as unknown as object);
        fitMapToCollection(map, stored);
      }
      syncFromDraw();
    };

    const onLoad = () => {
      hydrate();
      requestAnimationFrame(() => map.resize());
    };

    if (map.isStyleLoaded()) onLoad();
    else map.once('load', onLoad);

    const onDraw = () => syncFromDraw();
    map.on('draw.update', onDraw);
    map.on('draw.delete', onDraw);
    map.on('draw.modechange', (e: { mode: string }) =>
      setDrawMode(e.mode ?? 'simple_select')
    );

    map.on('draw.create', (e: { features: Array<{ id?: string }> }) => {
      const id = e.features[0]?.id;
      if (id != null) {
        const n = draw.getAll().features.length;
        draw.setFeatureProperty(String(id), 'name', `Secteur ${n}`);
      }
      syncFromDraw();
    });

    const onWinResize = () => map.resize();
    window.addEventListener('resize', onWinResize);

    mapRef.current = map;

    return () => {
      window.removeEventListener('resize', onWinResize);
      drawRef.current = null;
      drawControlRef.current = null;
      mapRef.current = null;
      map.remove();
    };
  }, [lat, lon, syncFromDraw, token]);

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
      requestAnimationFrame(() => map.resize());
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
    <VStack align="stretch" spacing={3} w="100%">
      <Wrap spacing={2}>
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
      </Wrap>

      <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
        Tracez des polygones (parcelles / secteurs), nommez-les, puis
        enregistrez. Mode Éditer : après sélection d&apos;un secteur, ajustez
        les sommets.
      </Text>

      <Box
        ref={containerRef}
        w="100%"
        borderRadius="md"
        overflow="hidden"
        minH={{ base: '260px', md: '320px' }}
        h={{ base: '280px', md: '360px' }}
        bg="gray.900"
      />

      {sectors.length > 0 && (
        <Box>
          <Text fontWeight="semibold" fontSize="sm" mb={2}>
            Secteurs
          </Text>
          <VStack align="stretch" spacing={2} maxH="200px" overflowY="auto">
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
                    placeholder="Nom du secteur"
                  />
                </FormControl>
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
    </VStack>
  );
}
