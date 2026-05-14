'use client';

import { App, Card, Empty, Select, Space, Switch } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import {
  adminZoneApi,
  type ActiveGraphRecord,
  type AdminZone,
} from '@/app/lib/adminZoneApi';

const FIELD_GROUPS: Array<{ title: string; keys: string[] }> = [
  {
    title: '🌱 Sol',
    keys: [
      'soil_irrigation_status',
      'soil_ph_status',
      'soil_conductivity_status',
      'soil_moisture_status',
      'soil_temperature_status',
    ],
  },
  {
    title: '☁️ Météo',
    keys: [
      'et0_status',
      'wind_speed_status',
      'wind_direction_status',
      'solar_radiation_status',
      'temperature_humidity_weather_status',
      'precipitation_humidity_rate_status',
      'pluviometry_status',
      'data_table_status',
      'wind_radar_status',
      'cumulative_precipitation_status',
      'precipitation_rate_status',
      'weather_temperature_humidity_status',
    ],
  },
  {
    title: '💧 Eau',
    keys: [
      'water_flow_status',
      'water_pressure_status',
      'water_ph_status',
      'water_ec_status',
    ],
  },
  {
    title: '🌿 Plante',
    keys: [
      'leaf_sensor_status',
      'fruit_size_status',
      'large_fruit_diameter_status',
    ],
  },
  {
    title: '🌾 Engrais/Nutriments',
    keys: ['npk_status'],
  },
  {
    title: '⚡ Autres',
    keys: ['electricity_consumption_status'],
  },
];

const humanize = (key: string): string =>
  key.replace(/_status$/, '').replace(/_/g, ' ');

export type GraphsTabProps = { username: string };

export function GraphsTab({ username }: GraphsTabProps) {
  const { message } = App.useApp();
  const [zones, setZones] = useState<AdminZone[]>([]);
  const [zoneId, setZoneId] = useState<number | null>(null);
  const [status, setStatus] = useState<ActiveGraphRecord>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const loadZones = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await adminZoneApi.list(username);
      setZones(rows);
      if (rows.length > 0) setZoneId(rows[0].id);
    } catch {
      message.error('Liste des zones indisponible.');
    } finally {
      setLoading(false);
    }
  }, [message, username]);

  useEffect(() => {
    void loadZones();
  }, [loadZones]);

  useEffect(() => {
    const loadStatus = async () => {
      if (zoneId === null) return;
      try {
        const data = await adminZoneApi.activeGraph.get(username, zoneId);
        setStatus(data);
      } catch {
        message.error('Lecture des graphiques impossible.');
      }
    };
    void loadStatus();
  }, [message, username, zoneId]);

  const handleToggle = async (key: string, value: boolean) => {
    if (zoneId === null) return;
    setSavingKey(key);
    const optimistic = { ...status, [key]: value };
    setStatus(optimistic);
    try {
      const updated = await adminZoneApi.activeGraph.patch(username, zoneId, {
        [key]: value,
      });
      setStatus((prev) => ({ ...prev, ...updated }));
    } catch {
      setStatus(status); // rollback
      message.error('Échec de la mise à jour.');
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) return null;
  if (zones.length === 0) {
    return <Empty description="Aucune zone configurée" />;
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Space>
        <span>Zone :</span>
        <Select<number>
          value={zoneId ?? undefined}
          onChange={setZoneId}
          options={zones.map((z) => ({ value: z.id, label: z.name }))}
          style={{ minWidth: 220 }}
        />
      </Space>

      {FIELD_GROUPS.map((group) => (
        <Card key={group.title} title={group.title} size="small">
          <Space wrap size="middle">
            {group.keys.map((key) => (
              <Space key={key} size="small">
                <Switch
                  checked={Boolean(status[key])}
                  loading={savingKey === key}
                  onChange={(v) => handleToggle(key, v)}
                  size="small"
                />
                <span>{humanize(key)}</span>
              </Space>
            ))}
          </Space>
        </Card>
      ))}
    </Space>
  );
}

export default GraphsTab;
