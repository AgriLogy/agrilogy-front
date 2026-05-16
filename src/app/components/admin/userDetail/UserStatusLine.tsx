'use client';

import { Space, Tag } from 'antd';
import type { AdminUserDetail } from '@/app/lib/adminUserApi';

const formatDate = (iso: string | null): string => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('fr-FR');
  } catch {
    return iso;
  }
};

export function UserStatusLine({ user }: { user: AdminUserDetail }) {
  return (
    <Space size={8} wrap>
      {user.is_staff ? <Tag color="brand">Admin</Tag> : <Tag>Utilisateur</Tag>}
      <Tag color={user.is_active ? 'green' : 'red'}>
        {user.is_active ? 'Actif' : 'Inactif'}
      </Tag>
      <Tag color={user.payement_status === 'actif' ? 'green' : 'orange'}>
        Paiement : {user.payement_status}
      </Tag>
      <span style={{ opacity: 0.7 }}>
        Inscrit le {formatDate(user.date_joined)} · Dernière connexion{' '}
        {formatDate(user.last_login)}
      </span>
    </Space>
  );
}

export default UserStatusLine;
