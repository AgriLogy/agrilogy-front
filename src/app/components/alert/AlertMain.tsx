'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@chakra-ui/react';
import {
  App,
  Button,
  Empty,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { alertApi, type AlertRecord } from '@/app/lib/alertApi';
import {
  ALERT_CHOICES,
  CONDITION_CHOICES,
  DEFAULT_SENSOR_KEYS,
  type SensorKeyOption,
} from '@/app/utils/alertChoices';
import { PageInfoBar } from '@/app/components/layout/PageInfoBar';
import AlertCreateDrawer from './AlertCreateDrawer';
import styles from './AlertMain.module.scss';

const ALERT_LIMIT = 10;

const conditionLabel = (c: string) =>
  CONDITION_CHOICES.find((cc) => cc.value === c)?.label ?? c;

const typeLabel = (t: string) =>
  ALERT_CHOICES.find((c) => c.value === t)?.label ?? t;

const AlertMain: React.FC = () => {
  const { message } = App.useApp();
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [sensorKeys, setSensorKeys] =
    useState<SensorKeyOption[]>(DEFAULT_SENSOR_KEYS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<AlertRecord | null>(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await alertApi.list();
      setAlerts(data);
    } catch {
      message.error('Impossible de charger les alertes.');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    void fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    void alertApi
      .sensorKeys()
      .then((keys) => {
        if (Array.isArray(keys) && keys.length > 0) {
          setSensorKeys(
            keys.map((k) => ({ key: k.key, label: k.label, unit: k.unit }))
          );
        }
      })
      .catch(() => {
        /* keep DEFAULT_SENSOR_KEYS */
      });
  }, []);

  const openCreate = () => {
    if (alerts.length >= ALERT_LIMIT) {
      message.warning(
        `Limite atteinte : supprimez une alerte pour en créer une autre (max ${ALERT_LIMIT}).`
      );
      return;
    }
    setEditing(null);
    setDrawerOpen(true);
  };

  const openEdit = (alert: AlertRecord) => {
    setEditing(alert);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await alertApi.remove(id);
      message.success('Alerte supprimée.');
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch {
      message.error('Échec de la suppression.');
    }
  };

  const handleToggleActive = async (alert: AlertRecord) => {
    try {
      const updated = await alertApi.update(alert.id, {
        is_active: !alert.is_active,
      });
      setAlerts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    } catch {
      message.error('Impossible de changer le statut.');
    }
  };

  const columns: ColumnsType<AlertRecord> = useMemo(
    () => [
      {
        title: 'Nom',
        dataIndex: 'name',
        key: 'name',
        render: (text: string, row) => (
          <Space size={8}>
            <strong>{text}</strong>
            {row.last_triggered_at && (
              <Tag color="red" className={styles.triggeredTag}>
                Récemment déclenchée
              </Tag>
            )}
          </Space>
        ),
      },
      {
        title: 'Capteur',
        dataIndex: 'sensor_key',
        key: 'sensor_key',
        render: (key: string) =>
          sensorKeys.find((s) => s.key === key)?.label ?? key ?? '—',
      },
      {
        title: 'Catégorie',
        dataIndex: 'type',
        key: 'type',
        render: (t: string) => <Tag>{typeLabel(t)}</Tag>,
      },
      {
        title: 'Condition',
        key: 'condition',
        render: (_, row) => (
          <span>
            {conditionLabel(row.condition)}{' '}
            <strong>{row.threshold ?? row.condition_nbr}</strong>{' '}
            <span className={styles.thresholdHint}>
              {sensorKeys.find((s) => s.key === row.sensor_key)?.unit ?? ''}
            </span>
          </span>
        ),
      },
      {
        title: 'Active',
        dataIndex: 'is_active',
        key: 'is_active',
        render: (on: boolean, row) => (
          <Tooltip title={on ? 'Désactiver' : 'Activer'}>
            <Tag
              color={on ? 'green' : 'default'}
              onClick={() => handleToggleActive(row)}
              style={{ cursor: 'pointer' }}
            >
              {on ? 'oui' : 'non'}
            </Tag>
          </Tooltip>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        align: 'right',
        render: (_, row) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => openEdit(row)}
              aria-label={`Modifier ${row.name}`}
            >
              Modifier
            </Button>
            <Popconfirm
              title="Supprimer cette alerte ?"
              okText="Supprimer"
              cancelText="Annuler"
              onConfirm={() => handleDelete(row.id)}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                aria-label={`Supprimer ${row.name}`}
              >
                Supprimer
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sensorKeys]
  );

  return (
    <Box
      px={{ base: 3, md: 4 }}
      py={{ base: 3, md: 4 }}
      data-testid="alert-main"
    >
      <PageInfoBar
        title="Gestion des alertes"
        subtitle="Configurez des seuils par capteur. Chaque alerte se trace automatiquement sur le graphique correspondant."
        actions={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreate}
            data-testid="alert-create-button"
          >
            Nouvelle alerte
          </Button>
        }
      />

      <Box
        bg="app.surface"
        borderWidth="1px"
        borderColor="app.border"
        borderRadius="lg"
        px={{ base: 3, md: 4 }}
        py={{ base: 3, md: 4 }}
        minW={0}
      >
        <Table<AlertRecord>
          rowKey="id"
          columns={columns}
          dataSource={alerts}
          loading={loading}
          pagination={false}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Aucune alerte configurée"
              />
            ),
          }}
        />
      </Box>

      <AlertCreateDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        editing={editing}
        onSaved={() => {
          closeDrawer();
          void fetchAlerts();
        }}
      />
    </Box>
  );
};

export default AlertMain;
