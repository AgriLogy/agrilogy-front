'use client';

import {
  AuditOutlined,
  DashboardOutlined,
  LogoutOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { App, Menu, Tooltip } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { useMemo } from 'react';

import useColorModeStyles from '@/app/utils/useColorModeStyles';

const AdminSidebar = () => {
  const { bg } = useColorModeStyles();
  const router = useRouter();
  const pathname = usePathname() ?? '/admin';
  const { modal } = App.useApp();

  const selectedKey = useMemo(() => {
    if (pathname.startsWith('/admin/users')) return 'users';
    if (pathname.startsWith('/admin/affirmations')) return 'affirmations';
    return 'dashboard';
  }, [pathname]);

  const handleLogout = () => {
    modal.confirm({
      title: 'Confirmer la déconnexion',
      content: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      okText: 'Se déconnecter',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk: () => {
        localStorage.clear();
        router.push('/login');
      },
    });
  };

  return (
    <div
      style={{
        background: bg,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Menu
        mode="inline"
        inlineCollapsed
        selectedKeys={[selectedKey]}
        style={{ borderInlineEnd: 'none', background: 'transparent' }}
        items={[
          {
            key: 'dashboard',
            icon: (
              <Tooltip title="Tableau de bord" placement="right">
                <DashboardOutlined />
              </Tooltip>
            ),
            onClick: () => router.push('/admin'),
          },
          {
            key: 'users',
            icon: (
              <Tooltip title="Utilisateurs" placement="right">
                <TeamOutlined />
              </Tooltip>
            ),
            onClick: () => router.push('/admin/users'),
          },
          {
            key: 'affirmations',
            icon: (
              <Tooltip title="Affirmations manager" placement="right">
                <AuditOutlined />
              </Tooltip>
            ),
            onClick: () => router.push('/admin/affirmations'),
          },
        ]}
      />
      <Menu
        mode="inline"
        inlineCollapsed
        selectable={false}
        style={{ borderInlineEnd: 'none', background: 'transparent' }}
        items={[
          {
            key: 'logout',
            danger: true,
            icon: (
              <Tooltip title="Déconnexion" placement="right">
                <LogoutOutlined />
              </Tooltip>
            ),
            onClick: handleLogout,
          },
        ]}
      />
    </div>
  );
};

export default AdminSidebar;
