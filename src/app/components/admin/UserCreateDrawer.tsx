'use client';

import { EnvironmentOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, Select, Space, Switch } from 'antd';
import { useState } from 'react';

import { AdminEntityDrawer } from '@/app/components/admin/_shared/AdminEntityDrawer';
import {
  adminUserApi,
  type AdminUserCreatePayload,
} from '@/app/lib/adminUserApi';

type FormValues = {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  phone_number?: string;
  latitude?: number;
  longitude?: number;
  password: string;
  is_staff: boolean;
  payement_status: 'actif' | 'suspended';
};

export type UserCreateDrawerProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

const UserCreateDrawer = ({
  open,
  onClose,
  onCreated,
}: UserCreateDrawerProps) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

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
        message.success('Position remplie.');
      },
      () => {
        setGeoLoading(false);
        message.error('Impossible de récupérer la position.');
      },
      { enableHighAccuracy: true, timeout: 7000 }
    );
  };

  const handleSubmit = async () => {
    let values: FormValues;
    try {
      values = await form.validateFields();
    } catch {
      return;
    }
    setSubmitting(true);
    try {
      const payload: AdminUserCreatePayload = {
        username: values.username.trim(),
        email: values.email.trim(),
        firstname: values.firstname.trim(),
        lastname: values.lastname.trim(),
        phone_number: values.phone_number?.trim() || undefined,
        latitude: values.latitude,
        longitude: values.longitude,
        password: values.password,
        is_staff: values.is_staff,
        payement_status: values.payement_status,
      };
      await adminUserApi.create(payload);
      message.success('Utilisateur créé.');
      form.resetFields();
      onCreated?.();
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
        : 'Échec de la création.';
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
      title="Nouvel utilisateur"
      submitting={submitting}
      submitLabel="Créer"
    >
      <Form<FormValues>
        form={form}
        layout="vertical"
        requiredMark
        initialValues={{
          is_staff: false,
          payement_status: 'actif',
        }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="username"
          label="Nom d’utilisateur"
          rules={[
            { required: true, message: 'Requis.' },
            { min: 3, message: 'Au moins 3 caractères.' },
          ]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Space.Compact block>
          <Form.Item
            name="firstname"
            label="Prénom"
            style={{ flex: 1 }}
            rules={[{ required: true, message: 'Requis.' }]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="lastname"
            label="Nom"
            style={{ flex: 1 }}
            rules={[{ required: true, message: 'Requis.' }]}
          >
            <Input autoComplete="off" />
          </Form.Item>
        </Space.Compact>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Requis.' },
            { type: 'email', message: 'Format email invalide.' },
          ]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="phone_number" label="Téléphone">
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Mot de passe"
          rules={[
            { required: true, message: 'Requis.' },
            { min: 8, message: 'Au moins 8 caractères.' },
          ]}
          extra="Le mot de passe doit être robuste (8+ caractères, lettres et chiffres)."
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Space.Compact block>
          <Form.Item
            name="latitude"
            label="Latitude"
            style={{ flex: 1 }}
            rules={[
              {
                type: 'number',
                min: -90,
                max: 90,
                message: 'Doit être entre -90 et 90.',
              },
            ]}
          >
            <Input type="number" step="any" autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="longitude"
            label="Longitude"
            style={{ flex: 1 }}
            rules={[
              {
                type: 'number',
                min: -180,
                max: 180,
                message: 'Doit être entre -180 et 180.',
              },
            ]}
          >
            <Input type="number" step="any" autoComplete="off" />
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
        <Form.Item
          name="payement_status"
          label="Statut de paiement"
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
          name="is_staff"
          label="Rôle administrateur"
          valuePropName="checked"
        >
          <Switch checkedChildren="Admin" unCheckedChildren="Utilisateur" />
        </Form.Item>
      </Form>
    </AdminEntityDrawer>
  );
};

export default UserCreateDrawer;
