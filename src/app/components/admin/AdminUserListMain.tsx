'use client';

import {
  EditOutlined,
  PlusOutlined,
  StopOutlined,
  UnlockOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { App, Badge, Button, Space, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@chakra-ui/react';

import { PageInfoBar } from '@/app/components/layout/PageInfoBar';
import { AdminCrudTable } from '@/app/components/admin/_shared/AdminCrudTable';
import { adminUserApi, type AdminUserRow } from '@/app/lib/adminUserApi';
import UserCreateDrawer from './UserCreateDrawer';

const formatDate = (iso: string | null): string => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

const AdminUserListMain = () => {
  const { message, modal } = App.useApp();
  const router = useRouter();
  const [data, setData] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await adminUserApi.list();
      setData(rows);
    } catch {
      message.error('Liste utilisateurs indisponible.');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleToggle = useCallback(
    async (row: AdminUserRow) => {
      try {
        const updated = await adminUserApi.toggleActive(row.username);
        setData((prev) =>
          prev.map((u) =>
            u.username === row.username
              ? { ...u, is_active: updated.is_active }
              : u
          )
        );
        message.success(
          updated.is_active ? 'Utilisateur réactivé.' : 'Utilisateur désactivé.'
        );
      } catch {
        message.error('Action impossible.');
      }
    },
    [message]
  );

  const handleResetPassword = useCallback(
    (row: AdminUserRow) => {
      modal.confirm({
        title: `Réinitialiser le mot de passe de ${row.username} ?`,
        content:
          'Un mot de passe aléatoire sera généré et affiché une seule fois.',
        okText: 'Réinitialiser',
        cancelText: 'Annuler',
        onOk: async () => {
          try {
            const { password } = await adminUserApi.resetPassword(row.username);
            modal.info({
              title: 'Nouveau mot de passe',
              content: (
                <Space direction="vertical">
                  <span>Communiquez ce mot de passe à l’utilisateur :</span>
                  <code
                    style={{
                      background: 'rgba(0,0,0,0.06)',
                      padding: '4px 8px',
                      borderRadius: 4,
                      userSelect: 'all',
                    }}
                  >
                    {password}
                  </code>
                </Space>
              ),
              okText: 'Fermer',
            });
          } catch {
            message.error('Échec de la réinitialisation.');
          }
        },
      });
    },
    [message, modal]
  );

  const columns = useMemo<ColumnsType<AdminUserRow>>(
    () => [
      {
        title: 'Utilisateur',
        dataIndex: 'username',
        key: 'username',
        sorter: (a, b) => a.username.localeCompare(b.username),
        render: (text: string, row) => (
          <Space direction="vertical" size={0}>
            <strong>{text}</strong>
            <span style={{ fontSize: 12, opacity: 0.7 }}>
              {row.firstname} {row.lastname}
            </span>
          </Space>
        ),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: (a, b) => a.email.localeCompare(b.email),
      },
      {
        title: 'Rôle',
        dataIndex: 'is_staff',
        key: 'is_staff',
        filters: [
          { text: 'Admin', value: true },
          { text: 'Utilisateur', value: false },
        ],
        onFilter: (val, row) => row.is_staff === val,
        render: (isStaff: boolean) =>
          isStaff ? <Tag color="brand">Admin</Tag> : <Tag>Utilisateur</Tag>,
      },
      {
        title: 'Statut',
        dataIndex: 'is_active',
        key: 'is_active',
        filters: [
          { text: 'Actif', value: true },
          { text: 'Inactif', value: false },
        ],
        onFilter: (val, row) => row.is_active === val,
        render: (active: boolean) => (
          <Badge
            status={active ? 'success' : 'error'}
            text={active ? 'Actif' : 'Inactif'}
          />
        ),
      },
      {
        title: 'Paiement',
        dataIndex: 'payement_status',
        key: 'payement_status',
        render: (value: string) => (
          <Tag color={value === 'actif' ? 'green' : 'orange'}>{value}</Tag>
        ),
      },
      {
        title: 'Zones',
        dataIndex: 'zones_count',
        key: 'zones_count',
        sorter: (a, b) => (a.zones_count ?? 0) - (b.zones_count ?? 0),
        align: 'right',
      },
      {
        title: 'Inscrit le',
        dataIndex: 'date_joined',
        key: 'date_joined',
        sorter: (a, b) => a.date_joined.localeCompare(b.date_joined),
        render: formatDate,
      },
      {
        title: 'Dernière connexion',
        dataIndex: 'last_login',
        key: 'last_login',
        render: formatDate,
      },
      {
        title: 'Actions',
        key: 'actions',
        align: 'right',
        render: (_value, row) => (
          <Space>
            <Tooltip title="Ouvrir le détail">
              <Button
                icon={<EditOutlined />}
                onClick={() =>
                  router.push(
                    `/admin/users/${encodeURIComponent(row.username)}`
                  )
                }
                aria-label={`Ouvrir ${row.username}`}
              />
            </Tooltip>
            <Tooltip title={row.is_active ? 'Désactiver' : 'Réactiver'}>
              <Button
                icon={row.is_active ? <StopOutlined /> : <UserSwitchOutlined />}
                onClick={() => handleToggle(row)}
                aria-label={`Basculer ${row.username}`}
              />
            </Tooltip>
            <Tooltip title="Réinitialiser le mot de passe">
              <Button
                icon={<UnlockOutlined />}
                onClick={() => handleResetPassword(row)}
                aria-label={`Réinitialiser le mot de passe de ${row.username}`}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [handleResetPassword, handleToggle, router]
  );

  return (
    <Box px={{ base: 3, md: 4 }} py={{ base: 3, md: 4 }}>
      <PageInfoBar
        title="Utilisateurs"
        subtitle="Gérez les comptes, leurs zones et leur observabilité."
        actions={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
            data-testid="admin-user-create"
          >
            Nouvel utilisateur
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
        <AdminCrudTable<AdminUserRow>
          rowKey="id"
          columns={columns}
          data={data}
          loading={loading}
          searchable
          searchKeys={['username', 'email', 'firstname', 'lastname']}
          searchPlaceholder="Rechercher (nom, email)…"
          emptyDescription="Aucun utilisateur"
        />
      </Box>

      <UserCreateDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCreated={() => {
          setDrawerOpen(false);
          void refresh();
        }}
      />
    </Box>
  );
};

export default AdminUserListMain;
