'use client';

import {
  AlertOutlined,
  EnvironmentOutlined,
  RightOutlined,
  TeamOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { App, Button, Card, Col, Row, Skeleton, Space, Statistic } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';

import { AdminCrudTable } from '@/app/components/admin/_shared/AdminCrudTable';
import { PageInfoBar } from '@/app/components/layout/PageInfoBar';
import { adminUserApi, type AdminUserRow } from '@/app/lib/adminUserApi';

type Overview = {
  users_total: number;
  users_active: number;
  staff_total: number;
  zones_total: number;
  alerts_24h: number;
};

const formatDate = (iso: string | null): string => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('fr-FR');
  } catch {
    return iso;
  }
};

const AdminDashboardMain = () => {
  const { message } = App.useApp();
  const router = useRouter();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [recent, setRecent] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [ov, users] = await Promise.all([
        adminUserApi.overview(),
        adminUserApi.list(),
      ]);
      setOverview(ov);
      setRecent(users.slice(0, 5));
    } catch {
      message.error('Tableau de bord indisponible.');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const columns: ColumnsType<AdminUserRow> = [
    {
      title: 'Utilisateur',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Inscrit le',
      dataIndex: 'date_joined',
      key: 'date_joined',
      render: formatDate,
    },
    {
      title: '',
      key: 'open',
      align: 'right',
      render: (_v, row) => (
        <Button
          type="link"
          icon={<RightOutlined />}
          onClick={() =>
            router.push(`/admin/users/${encodeURIComponent(row.username)}`)
          }
        >
          Ouvrir
        </Button>
      ),
    },
  ];

  return (
    <Box px={{ base: 3, md: 4 }} py={{ base: 3, md: 4 }}>
      <PageInfoBar
        title="Tableau de bord administrateur"
        subtitle="KPIs globaux et accès rapide aux derniers utilisateurs."
        actions={
          <Space>
            <Button
              icon={<TeamOutlined />}
              onClick={() => router.push('/admin/users')}
            >
              Tous les utilisateurs
            </Button>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => router.push('/admin/users/new')}
            >
              Nouvel utilisateur
            </Button>
          </Space>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={12} md={8} lg={6}>
          <Card>
            {loading || !overview ? (
              <Skeleton.Input active size="small" block />
            ) : (
              <Statistic
                title="Utilisateurs"
                value={overview.users_total}
                prefix={<TeamOutlined />}
              />
            )}
          </Card>
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Card>
            {loading || !overview ? (
              <Skeleton.Input active size="small" block />
            ) : (
              <Statistic
                title="Utilisateurs actifs"
                value={overview.users_active}
              />
            )}
          </Card>
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Card>
            {loading || !overview ? (
              <Skeleton.Input active size="small" block />
            ) : (
              <Statistic title="Administrateurs" value={overview.staff_total} />
            )}
          </Card>
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Card>
            {loading || !overview ? (
              <Skeleton.Input active size="small" block />
            ) : (
              <Statistic
                title="Zones"
                value={overview.zones_total}
                prefix={<EnvironmentOutlined />}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} md={8} lg={6}>
          <Card>
            {loading || !overview ? (
              <Skeleton.Input active size="small" block />
            ) : (
              <Statistic
                title="Alertes 24 h"
                value={overview.alerts_24h}
                prefix={<AlertOutlined />}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Box mt={4}>
        <Box
          bg="app.surface"
          borderWidth="1px"
          borderColor="app.border"
          borderRadius="lg"
          px={{ base: 3, md: 4 }}
          py={{ base: 3, md: 4 }}
        >
          <h3 style={{ marginTop: 0 }}>Derniers utilisateurs</h3>
          <AdminCrudTable<AdminUserRow>
            rowKey="id"
            columns={columns}
            data={recent}
            loading={loading}
            pagination={false}
            emptyDescription="Aucun utilisateur"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboardMain;
