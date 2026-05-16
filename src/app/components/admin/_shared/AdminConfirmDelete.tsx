'use client';

import { App, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';

export type AdminConfirmDeleteProps = {
  onConfirm: () => Promise<void>;
  title?: string;
  okText?: string;
  cancelText?: string;
  successMessage?: string;
  errorMessage?: string;
  /** Render a custom trigger (defaults to a danger `Button`). */
  trigger?: (loading: boolean) => React.ReactNode;
};

/**
 * Drop-in delete confirmation:
 *   <AdminConfirmDelete onConfirm={() => api.remove(id)} />
 *
 * Handles loading state, success/error messages, and a sensible
 * default trigger button.
 */
export function AdminConfirmDelete({
  onConfirm,
  title = 'Confirmer la suppression ?',
  okText = 'Supprimer',
  cancelText = 'Annuler',
  successMessage = 'Suppression réussie.',
  errorMessage = 'Échec de la suppression.',
  trigger,
}: AdminConfirmDeleteProps) {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    try {
      await onConfirm();
      message.success(successMessage);
    } catch {
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popconfirm
      title={title}
      okText={okText}
      okButtonProps={{ danger: true, loading }}
      cancelText={cancelText}
      onConfirm={handle}
    >
      {trigger ? (
        trigger(loading)
      ) : (
        <Button danger icon={<DeleteOutlined />} loading={loading}>
          Supprimer
        </Button>
      )}
    </Popconfirm>
  );
}

export default AdminConfirmDelete;
