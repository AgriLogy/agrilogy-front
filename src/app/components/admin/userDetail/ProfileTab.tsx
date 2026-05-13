'use client';

import { EnvironmentOutlined } from '@ant-design/icons';
import {
  App,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Switch,
} from 'antd';
import { useEffect, useState } from 'react';

import {
  adminUserApi,
  type AdminUserDetail,
  type AdminUserPatchPayload,
} from '@/app/lib/adminUserApi';

type FormValues = {
  email: string;
  firstname: string;
  lastname: string;
  phone_number: string | null;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  is_staff: boolean;
  payement_status: 'actif' | 'suspended';
  notify_every: number;
};

const toFormValues = (u: AdminUserDetail): FormValues => ({
  email: u.email,
  firstname: u.firstname,
  lastname: u.lastname,
  phone_number: u.phone_number,
  latitude: u.latitude,
  longitude: u.longitude,
  is_active: u.is_active,
  is_staff: u.is_staff,
  payement_status: (u.payement_status as 'actif' | 'suspended') ?? 'actif',
  notify_every: u.notify_every,
});

export type ProfileTabProps = {
  user: AdminUserDetail;
  onChange: (next: AdminUserDetail) => void;
};

export function ProfileTab({ user, onChange }: ProfileTabProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [saving, setSaving] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue(toFormValues(user));
  }, [form, user]);

  const fillLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      message.warning('Géolocalisation indisponible.');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        form.setFieldsValue({
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
        });
        setGeoLoading(false);
      },
      () => {
        setGeoLoading(false);
        message.error('Impossible de récupérer la position.');
      },
      { enableHighAccuracy: true, timeout: 7000 }
    );
  };

  const handleSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      const payload: AdminUserPatchPayload = {
        email: values.email,
        firstname: values.firstname,
        lastname: values.lastname,
        phone_number: values.phone_number,
        latitude: values.latitude,
        longitude: values.longitude,
        is_active: values.is_active,
        is_staff: values.is_staff,
        payement_status: values.payement_status,
        notify_every: values.notify_every,
      };
      const updated = await adminUserApi.update(user.username, payload);
      onChange(updated);
      message.success('Profil mis à jour.');
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
        : 'Échec de la mise à jour.';
      message.error(text);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form<FormValues>
      form={form}
      layout="vertical"
      initialValues={toFormValues(user)}
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Requis.' },
          { type: 'email', message: 'Format email invalide.' },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Space.Compact block>
        <Form.Item
          label="Prénom"
          name="firstname"
          style={{ flex: 1 }}
          rules={[{ required: true, message: 'Requis.' }]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="Nom"
          name="lastname"
          style={{ flex: 1 }}
          rules={[{ required: true, message: 'Requis.' }]}
        >
          <Input autoComplete="off" />
        </Form.Item>
      </Space.Compact>
      <Form.Item label="Téléphone" name="phone_number">
        <Input autoComplete="off" />
      </Form.Item>
      <Space.Compact block>
        <Form.Item
          label="Latitude"
          name="latitude"
          style={{ flex: 1 }}
          rules={[{ type: 'number', min: -90, max: 90, message: '-90 à 90.' }]}
        >
          <InputNumber style={{ width: '100%' }} step={0.000001} />
        </Form.Item>
        <Form.Item
          label="Longitude"
          name="longitude"
          style={{ flex: 1 }}
          rules={[
            { type: 'number', min: -180, max: 180, message: '-180 à 180.' },
          ]}
        >
          <InputNumber style={{ width: '100%' }} step={0.000001} />
        </Form.Item>
      </Space.Compact>
      <Form.Item>
        <Button
          icon={<EnvironmentOutlined />}
          onClick={fillLocation}
          loading={geoLoading}
        >
          Remplir la position automatiquement
        </Button>
      </Form.Item>

      <Space.Compact block>
        <Form.Item
          label="Statut"
          name="is_active"
          valuePropName="checked"
          style={{ flex: 1 }}
        >
          <Switch checkedChildren="Actif" unCheckedChildren="Inactif" />
        </Form.Item>
        <Form.Item
          label="Rôle administrateur"
          name="is_staff"
          valuePropName="checked"
          style={{ flex: 1 }}
        >
          <Switch checkedChildren="Admin" unCheckedChildren="Utilisateur" />
        </Form.Item>
      </Space.Compact>

      <Form.Item
        label="Paiement"
        name="payement_status"
        rules={[{ required: true }]}
      >
        <Select
          options={[
            { value: 'actif', label: 'Actif' },
            { value: 'suspended', label: 'Suspendu' },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Cadence de notifications (heures)"
        name="notify_every"
        rules={[{ required: true }, { type: 'number', min: 1, max: 168 }]}
      >
        <InputNumber min={1} max={168} style={{ width: 160 }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={saving}>
          Enregistrer
        </Button>
      </Form.Item>
    </Form>
  );
}

export default ProfileTab;
