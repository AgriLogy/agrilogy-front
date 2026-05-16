'use client';

import {
  StopOutlined,
  UnlockOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { App, Button, Space } from 'antd';
import { useState } from 'react';

import { adminUserApi, type AdminUserDetail } from '@/app/lib/adminUserApi';

export type UserHeaderActionsProps = {
  user: AdminUserDetail;
  onChange: (next: AdminUserDetail) => void;
};

export function UserHeaderActions({ user, onChange }: UserHeaderActionsProps) {
  const { message, modal } = App.useApp();
  const [toggling, setToggling] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const updated = await adminUserApi.toggleActive(user.username);
      onChange({ ...user, is_active: updated.is_active });
      message.success(
        updated.is_active ? 'Utilisateur réactivé.' : 'Utilisateur désactivé.'
      );
    } catch {
      message.error('Action impossible.');
    } finally {
      setToggling(false);
    }
  };

  const handleReset = () => {
    modal.confirm({
      title: `Réinitialiser le mot de passe de ${user.username} ?`,
      okText: 'Réinitialiser',
      cancelText: 'Annuler',
      onOk: async () => {
        setResetting(true);
        try {
          const { password } = await adminUserApi.resetPassword(user.username);
          modal.info({
            title: 'Nouveau mot de passe',
            content: (
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
            ),
            okText: 'Fermer',
          });
        } catch {
          message.error('Échec de la réinitialisation.');
        } finally {
          setResetting(false);
        }
      },
    });
  };

  return (
    <Space>
      <Button
        icon={user.is_active ? <StopOutlined /> : <UserSwitchOutlined />}
        onClick={handleToggle}
        loading={toggling}
      >
        {user.is_active ? 'Désactiver' : 'Réactiver'}
      </Button>
      <Button
        icon={<UnlockOutlined />}
        onClick={handleReset}
        loading={resetting}
      >
        Réinitialiser MDP
      </Button>
    </Space>
  );
}

export default UserHeaderActions;
