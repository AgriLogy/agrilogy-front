'use client';

import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { App, Button, Input, Modal, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';

import { AdminCrudTable } from '@/app/components/admin/_shared/AdminCrudTable';
import { PageInfoBar } from '@/app/components/layout/PageInfoBar';
import {
  managerAffirmationApi,
  type Affirmation,
  type AffirmationStatus,
} from '@/app/lib/managerAffirmationApi';

const STATUS_COLOR: Record<AffirmationStatus, string> = {
  pending: 'orange',
  approved: 'green',
  rejected: 'red',
};

const ACTION_LABEL: Record<string, string> = {
  zone_params_change: 'Modification de paramètres',
  kc_periods_change: 'Modification des périodes Kc',
  user_reactivate: 'Réactivation utilisateur',
};

const formatDate = (iso: string | null): string => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('fr-FR');
  } catch {
    return iso;
  }
};

const AdminAffirmationsMain = () => {
  const { message } = App.useApp();
  const [filter, setFilter] = useState<AffirmationStatus | 'all'>('pending');
  const [rows, setRows] = useState<Affirmation[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await managerAffirmationApi.list(
        filter === 'all' ? undefined : filter
      );
      setRows(data);
    } catch {
      message.error('Liste des affirmations indisponible.');
    } finally {
      setLoading(false);
    }
  }, [filter, message]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const decide = (row: Affirmation, decision: 'approve' | 'reject') => {
    let note = '';
    Modal.confirm({
      title:
        decision === 'approve'
          ? `Approuver la demande #${row.id} ?`
          : `Rejeter la demande #${row.id} ?`,
      content: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <span>{ACTION_LABEL[row.action] ?? row.action}</span>
          <Input.TextArea
            rows={2}
            placeholder="Note de décision (optionnel)"
            onChange={(e) => {
              note = e.target.value;
            }}
          />
        </Space>
      ),
      okText: decision === 'approve' ? 'Approuver' : 'Rejeter',
      okType: decision === 'approve' ? 'primary' : 'danger',
      cancelText: 'Annuler',
      onOk: async () => {
        setBusy(row.id);
        try {
          const updated = await managerAffirmationApi.decide(
            row.id,
            decision,
            note || undefined
          );
          setRows((prev) =>
            prev.map((r) => (r.id === updated.id ? updated : r))
          );
          message.success(
            decision === 'approve' ? 'Demande approuvée.' : 'Demande rejetée.'
          );
        } catch {
          message.error('Action impossible.');
        } finally {
          setBusy(null);
        }
      },
    });
  };

  const columns: ColumnsType<Affirmation> = [
    {
      title: 'Demande',
      dataIndex: 'id',
      key: 'id',
      render: (id: number, row) => (
        <Space direction="vertical" size={0}>
          <strong>#{id}</strong>
          <span style={{ fontSize: 12, opacity: 0.7 }}>
            {ACTION_LABEL[row.action] ?? row.action}
          </span>
        </Space>
      ),
    },
    {
      title: 'Demandeur',
      dataIndex: 'requested_by_username',
      key: 'requested_by_username',
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (s: AffirmationStatus) => <Tag color={STATUS_COLOR[s]}>{s}</Tag>,
    },
    {
      title: 'Créée le',
      dataIndex: 'created_at',
      key: 'created_at',
      render: formatDate,
    },
    {
      title: 'Décidée le',
      dataIndex: 'decided_at',
      key: 'decided_at',
      render: formatDate,
    },
    {
      title: 'Décideur',
      dataIndex: 'decided_by_username',
      key: 'decided_by_username',
      render: (v: string | null) => v ?? '—',
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_v, row) =>
        row.status === 'pending' ? (
          <Space>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              loading={busy === row.id}
              onClick={() => decide(row, 'approve')}
            >
              Approuver
            </Button>
            <Button
              danger
              icon={<CloseOutlined />}
              loading={busy === row.id}
              onClick={() => decide(row, 'reject')}
            >
              Rejeter
            </Button>
          </Space>
        ) : null,
    },
  ];

  return (
    <Box px={{ base: 3, md: 4 }} py={{ base: 3, md: 4 }}>
      <PageInfoBar
        title="Affirmations manager"
        subtitle="Approuver ou rejeter les demandes des utilisateurs."
        actions={
          <Space>
            {(['pending', 'approved', 'rejected', 'all'] as const).map(
              (key) => (
                <Button
                  key={key}
                  size="small"
                  type={filter === key ? 'primary' : 'default'}
                  onClick={() => setFilter(key)}
                >
                  {key === 'all' ? 'Toutes' : key}
                </Button>
              )
            )}
          </Space>
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
        <AdminCrudTable<Affirmation>
          rowKey="id"
          columns={columns}
          data={rows}
          loading={loading}
          emptyDescription="Aucune affirmation"
        />
      </Box>
    </Box>
  );
};

export default AdminAffirmationsMain;
