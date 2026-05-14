'use client';

import { App, Button, Empty, Form, InputNumber, Select, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import {
  adminZoneApi,
  type AdminZone,
  type AdminZoneParams,
} from '@/app/lib/adminZoneApi';
import {
  adminSensorUnitsApi,
  type SensorUnitsMap,
} from '@/app/lib/adminSensorUnitsApi';

type ParamsFormValues = {
  soil_param_TAW: number;
  soil_param_FC: number;
  soil_param_WP: number;
  soil_param_RAW: number;
  critical_moisture_threshold: number;
  pomp_flow_rate: number;
  irrigation_water_quantity: number;
};

const SENSOR_UNIT_FAMILIES: Array<{
  sensor_key: string;
  label: string;
  options: string[];
}> = [
  {
    sensor_key: 'temperature_weather',
    label: 'Température (air)',
    options: ['°C', '°F'],
  },
  {
    sensor_key: 'soil_temperature',
    label: 'Température (sol)',
    options: ['°C', '°F'],
  },
  {
    sensor_key: 'wind_speed',
    label: 'Vitesse du vent',
    options: ['m/s', 'km/h', 'mph'],
  },
  {
    sensor_key: 'precipitation_rate',
    label: 'Précipitations',
    options: ['mm/h', 'mm/jour'],
  },
  {
    sensor_key: 'soil_moisture_medium',
    label: 'Humidité du sol',
    options: ['%', 'm³/m³'],
  },
  {
    sensor_key: 'water_flow',
    label: 'Débit d’eau',
    options: ['L/s', 'L/min', 'm³/h'],
  },
];

export type ParamsTabProps = { username: string };

export function ParamsTab({ username }: ParamsTabProps) {
  const { message } = App.useApp();
  const [zones, setZones] = useState<AdminZone[]>([]);
  const [zoneId, setZoneId] = useState<number | null>(null);
  const [params, setParams] = useState<AdminZoneParams | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingParams, setSavingParams] = useState(false);

  const [units, setUnits] = useState<SensorUnitsMap>({});
  const [savingUnits, setSavingUnits] = useState(false);

  const [form] = Form.useForm<ParamsFormValues>();

  const loadZones = useCallback(async () => {
    setLoading(true);
    try {
      const [zoneList, unitsMap] = await Promise.all([
        adminZoneApi.list(username),
        adminSensorUnitsApi.get(username),
      ]);
      setZones(zoneList);
      setUnits(unitsMap);
      if (zoneList.length > 0) {
        setZoneId(zoneList[0].id);
      }
    } catch {
      message.error('Chargement des paramètres impossible.');
    } finally {
      setLoading(false);
    }
  }, [message, username]);

  useEffect(() => {
    void loadZones();
  }, [loadZones]);

  useEffect(() => {
    const loadParams = async () => {
      if (zoneId === null) return;
      try {
        const data = await adminZoneApi.params.get(username, zoneId);
        setParams(data);
        form.setFieldsValue({
          soil_param_TAW: data.soil_param_TAW,
          soil_param_FC: data.soil_param_FC,
          soil_param_WP: data.soil_param_WP,
          soil_param_RAW: data.soil_param_RAW,
          critical_moisture_threshold: data.critical_moisture_threshold,
          pomp_flow_rate: data.pomp_flow_rate,
          irrigation_water_quantity: data.irrigation_water_quantity,
        });
      } catch {
        message.error('Lecture des paramètres impossible.');
      }
    };
    void loadParams();
  }, [form, message, username, zoneId]);

  const handleSaveParams = async (values: ParamsFormValues) => {
    if (zoneId === null) return;
    setSavingParams(true);
    try {
      const updated = await adminZoneApi.params.update(
        username,
        zoneId,
        values
      );
      setParams(updated);
      message.success('Paramètres enregistrés.');
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: Record<string, unknown> } })
        ?.response?.data;
      const text = detail
        ? Object.entries(detail)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' · ') : v}`)
            .join(' · ')
        : 'Échec de la sauvegarde.';
      message.error(text);
    } finally {
      setSavingParams(false);
    }
  };

  const handleUnitChange = async (sensorKey: string, unit: string) => {
    setSavingUnits(true);
    const next = { ...units, [sensorKey]: unit };
    setUnits(next);
    try {
      const updated = await adminSensorUnitsApi.patch(username, {
        [sensorKey]: unit,
      });
      setUnits((prev) => ({ ...prev, ...updated }));
      message.success('Unité enregistrée.');
    } catch {
      setUnits(units); // rollback
      message.error('Échec de la sauvegarde de l’unité.');
    } finally {
      setSavingUnits(false);
    }
  };

  if (loading) return null;
  if (zones.length === 0) {
    return <Empty description="Aucune zone à paramétrer" />;
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Space>
        <span>Zone :</span>
        <Select<number>
          value={zoneId ?? undefined}
          onChange={setZoneId}
          options={zones.map((z) => ({ value: z.id, label: z.name }))}
          style={{ minWidth: 220 }}
        />
      </Space>

      <section>
        <h3 style={{ margin: '0 0 8px' }}>Paramètres du sol & irrigation</h3>
        <Form<ParamsFormValues>
          form={form}
          layout="vertical"
          onFinish={handleSaveParams}
          initialValues={
            params
              ? {
                  soil_param_TAW: params.soil_param_TAW,
                  soil_param_FC: params.soil_param_FC,
                  soil_param_WP: params.soil_param_WP,
                  soil_param_RAW: params.soil_param_RAW,
                  critical_moisture_threshold:
                    params.critical_moisture_threshold,
                  pomp_flow_rate: params.pomp_flow_rate,
                  irrigation_water_quantity: params.irrigation_water_quantity,
                }
              : undefined
          }
        >
          <Space.Compact block>
            <Form.Item
              name="soil_param_TAW"
              label="TAW (mm)"
              style={{ flex: 1 }}
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="soil_param_RAW"
              label="RAW (mm)"
              style={{ flex: 1 }}
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Space.Compact>
          <Space.Compact block>
            <Form.Item
              name="soil_param_FC"
              label="FC (%)"
              style={{ flex: 1 }}
              rules={[{ required: true }]}
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="soil_param_WP"
              label="WP (%)"
              style={{ flex: 1 }}
              rules={[{ required: true }]}
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Space.Compact>
          <Form.Item
            name="critical_moisture_threshold"
            label="Seuil critique d’humidité (%)"
            rules={[{ required: true }, { type: 'number', min: 0, max: 100 }]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="pomp_flow_rate"
            label="Débit de pompe (L/s)"
            rules={[{ required: true }, { type: 'number', min: 0 }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="irrigation_water_quantity"
            label="Quantité d’eau d’irrigation (L)"
            rules={[{ type: 'number', min: 0 }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={savingParams}>
              Enregistrer
            </Button>
          </Form.Item>
        </Form>
      </section>

      <section>
        <h3 style={{ margin: '0 0 8px' }}>Unités préférées par capteur</h3>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {SENSOR_UNIT_FAMILIES.map((family) => (
            <Space
              key={family.sensor_key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <span>{family.label}</span>
              <Select
                disabled={savingUnits}
                value={units[family.sensor_key] ?? family.options[0]}
                onChange={(v) => handleUnitChange(family.sensor_key, v)}
                options={family.options.map((o) => ({ value: o, label: o }))}
                style={{ minWidth: 140 }}
              />
            </Space>
          ))}
        </Space>
      </section>
    </Space>
  );
}

export default ParamsTab;
