'use client';

import { App, Form, InputNumber, Input, Tabs } from 'antd';
import { useEffect, useState } from 'react';

import { AdminEntityDrawer } from '@/app/components/admin/_shared/AdminEntityDrawer';
import {
  adminZoneApi,
  type AdminZone,
  type AdminZoneCreatePayload,
  type AdminZonePatchPayload,
} from '@/app/lib/adminZoneApi';

type FormValues = {
  name: string;
  space: number;
  critical_moisture_threshold: number;
  pomp_flow_rate: number;
  irrigation_water_quantity: number;
  soil_param_TAW: number;
  soil_param_FC: number;
  soil_param_WP: number;
  soil_param_RAW: number;
};

const toFormValues = (zone?: AdminZone | null): FormValues => ({
  name: zone?.name ?? '',
  space: zone?.space ?? 1000,
  critical_moisture_threshold: zone?.critical_moisture_threshold ?? 20,
  pomp_flow_rate: zone?.pomp_flow_rate ?? 1,
  irrigation_water_quantity: zone?.irrigation_water_quantity ?? 100,
  soil_param_TAW: zone?.soil_param_TAW ?? 50,
  soil_param_FC: zone?.soil_param_FC ?? 50,
  soil_param_WP: zone?.soil_param_WP ?? 50,
  soil_param_RAW: zone?.soil_param_RAW ?? 50,
});

export type ZoneFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  onSaved: (zone: AdminZone) => void;
  username: string;
  editing?: AdminZone | null;
};

export function ZoneFormDrawer({
  open,
  onClose,
  onSaved,
  username,
  editing,
}: ZoneFormDrawerProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(toFormValues(editing));
    }
  }, [editing, form, open]);

  const handleSubmit = async () => {
    let values: FormValues;
    try {
      values = await form.validateFields();
    } catch {
      return;
    }
    setSubmitting(true);
    try {
      if (editing) {
        const payload: AdminZonePatchPayload = values;
        const saved = await adminZoneApi.update(username, editing.id, payload);
        message.success('Zone mise à jour.');
        onSaved(saved);
      } else {
        const payload: AdminZoneCreatePayload = values;
        const saved = await adminZoneApi.create(username, payload);
        message.success('Zone créée.');
        onSaved(saved);
      }
      form.resetFields();
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: Record<string, unknown> } })
        ?.response?.data;
      const text = detail
        ? Object.entries(detail)
            .map(
              ([k, v]) =>
                `${k}: ${Array.isArray(v) ? v.join(' · ') : String(v)}`
            )
            .join(' · ')
        : 'Échec de l’enregistrement.';
      message.error(text);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminEntityDrawer
      open={open}
      onClose={() => {
        if (submitting) return;
        form.resetFields();
        onClose();
      }}
      onSubmit={handleSubmit}
      title={editing ? `Modifier la zone — ${editing.name}` : 'Nouvelle zone'}
      submitting={submitting}
      submitLabel={editing ? 'Mettre à jour' : 'Créer'}
    >
      <Form<FormValues>
        form={form}
        layout="vertical"
        initialValues={toFormValues(editing)}
        onFinish={handleSubmit}
      >
        <Tabs
          items={[
            {
              key: 'general',
              label: 'Général',
              children: (
                <>
                  <Form.Item
                    label="Nom"
                    name="name"
                    rules={[{ required: true, message: 'Requis.' }]}
                  >
                    <Input autoComplete="off" />
                  </Form.Item>
                  <Form.Item
                    label="Surface (m²)"
                    name="space"
                    rules={[
                      { required: true },
                      {
                        type: 'number',
                        min: 0.0001,
                        message: 'Doit être positif.',
                      },
                    ]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item
                    label="Seuil critique d’humidité (%)"
                    name="critical_moisture_threshold"
                    rules={[
                      { required: true },
                      { type: 'number', min: 0, max: 100, message: '0 à 100.' },
                    ]}
                  >
                    <InputNumber min={0} max={100} style={{ width: '100%' }} />
                  </Form.Item>
                </>
              ),
            },
            {
              key: 'irrigation',
              label: 'Irrigation',
              children: (
                <>
                  <Form.Item
                    label="Débit de pompe (L/s)"
                    name="pomp_flow_rate"
                    rules={[
                      { required: true },
                      { type: 'number', min: 0, message: 'Non négatif.' },
                    ]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item
                    label="Quantité d’eau d’irrigation (L)"
                    name="irrigation_water_quantity"
                    rules={[
                      { type: 'number', min: 0, message: 'Non négatif.' },
                    ]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </>
              ),
            },
            {
              key: 'soil',
              label: 'Sol',
              children: (
                <>
                  <Form.Item
                    label="TAW (Total Available Water, mm)"
                    name="soil_param_TAW"
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item
                    label="FC (Field Capacity, %)"
                    name="soil_param_FC"
                  >
                    <InputNumber min={0} max={100} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item label="WP (Wilting Point, %)" name="soil_param_WP">
                    <InputNumber min={0} max={100} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item
                    label="RAW (Readily Available Water, mm)"
                    name="soil_param_RAW"
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </>
              ),
            },
          ]}
        />
      </Form>
    </AdminEntityDrawer>
  );
}

export default ZoneFormDrawer;
