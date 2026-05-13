'use client';

import { Alert, Button, Empty, Select, Space } from 'antd';
import { useEffect, useState } from 'react';

import { adminZoneApi, type AdminZone } from '@/app/lib/adminZoneApi';

export type StationDataTabProps = { username: string };

export function StationDataTab({ username }: StationDataTabProps) {
  const [zones, setZones] = useState<AdminZone[]>([]);
  const [zoneId, setZoneId] = useState<number | null>(null);

  useEffect(() => {
    void adminZoneApi.list(username).then((rows) => {
      setZones(rows);
      if (rows.length > 0) setZoneId(rows[0].id);
    });
  }, [username]);

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

      <Alert
        type="info"
        showIcon
        message="Visualisation des données station"
        description={
          <Space direction="vertical">
            <span>
              Les graphiques ET0, température, humidité, rayonnement, vent,
              précipitations sont consultables depuis la vue utilisateur dédiée.
            </span>
            <Button
              type="primary"
              href={`/station${zoneId ? `?zone_id=${zoneId}` : ''}`}
              target="_blank"
            >
              Ouvrir la vue station →
            </Button>
          </Space>
        }
      />
    </Space>
  );
}

export default StationDataTab;
