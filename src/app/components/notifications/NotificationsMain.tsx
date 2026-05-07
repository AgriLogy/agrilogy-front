'use client';

import React, { useEffect, useState } from 'react';
import { App, Button, Modal } from 'antd';
import { BellOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import Notification, {
  type NotificationPayload,
} from '../notifications/Notification';
import axiosInstance from '@/app/lib/api';
import {
  mergeNotificationsForStorage,
  normalizeApiNotificationsList,
  NOTIFICATIONS_CACHE_UPDATED_EVENT,
  notificationRowZoneId,
  readNotificationsFromCache,
  writeNotificationsToCache,
} from '@/app/lib/notificationsCacheStorage';
import EmptyBox from '../common/EmptyBox';
import { useNotificationBellCounts } from '@/app/hooks/useNotificationBellCounts';
import ZoneNotificationConfigureForm from '@/app/components/notifications/ZoneNotificationConfigureForm';
import {
  deleteNotificationConfigById,
  getNotificationConfigById,
  getNotificationConfigsForZone,
  resolveStoredNotificationConfigId,
} from '@/app/lib/zoneNotificationConfigStorage';
import styles from './NotificationsMain.module.scss';

type CachedNotificationRow = {
  id: number;
  is_read: boolean;
  read_at: string | null;
  zone_name?: string;
  notification: NotificationPayload;
  [key: string]: unknown;
};

const NotificationsMain: React.FC = () => {
  const { message, modal } = App.useApp();
  const [notifications, setNotifications] = useState<CachedNotificationRow[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const { refresh: refreshBell } = useNotificationBellCounts();
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [configureInitialZoneId, setConfigureInitialZoneId] = useState<
    number | undefined
  >(undefined);
  const [configureConfigId, setConfigureConfigId] = useState<
    string | undefined
  >(undefined);
  const [configureIntent, setConfigureIntent] = useState<'create' | 'edit'>(
    'create'
  );
  const searchParams = useSearchParams();
  const router = useRouter();

  const stripConfigureParamsFromUrl = () => {
    if (searchParams.get('zoneId') || searchParams.get('configId')) {
      router.replace('/notifications', { scroll: false });
    }
  };

  const closeConfigureModal = () => {
    setConfigureIntent('create');
    setConfigureInitialZoneId(undefined);
    setConfigureConfigId(undefined);
    stripConfigureParamsFromUrl();
    setIsConfigureOpen(false);
  };

  const refetchNotifications = () => {
    void axiosInstance
      .get('/api/notifications-and-alerts/')
      .then((r) => {
        const apiRows = normalizeApiNotificationsList(r.data?.notifications);
        const merged = mergeNotificationsForStorage(apiRows);
        setNotifications(merged as CachedNotificationRow[]);
        writeNotificationsToCache(merged);
      })
      .catch(() => {
        setNotifications(
          readNotificationsFromCache() as CachedNotificationRow[]
        );
      });
  };

  const syncNotificationsFromCache = () => {
    setNotifications(readNotificationsFromCache() as CachedNotificationRow[]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          '/api/notifications-and-alerts/'
        );
        const apiRows = normalizeApiNotificationsList(
          response.data?.notifications
        );
        const merged = mergeNotificationsForStorage(apiRows);
        setNotifications(merged as CachedNotificationRow[]);
        writeNotificationsToCache(merged);
      } catch {
        setNotifications(
          readNotificationsFromCache() as CachedNotificationRow[]
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const syncFromCache = () => {
      setNotifications(readNotificationsFromCache() as CachedNotificationRow[]);
    };
    window.addEventListener(NOTIFICATIONS_CACHE_UPDATED_EVENT, syncFromCache);
    return () =>
      window.removeEventListener(
        NOTIFICATIONS_CACHE_UPDATED_EVENT,
        syncFromCache
      );
  }, []);

  useEffect(() => {
    if (
      isConfigureOpen &&
      configureIntent === 'edit' &&
      !configureConfigId &&
      configureInitialZoneId != null
    ) {
      const list = getNotificationConfigsForZone(configureInitialZoneId);
      if (list.length === 1) {
        setConfigureConfigId(list[0].configId);
      }
    }
  }, [
    isConfigureOpen,
    configureIntent,
    configureConfigId,
    configureInitialZoneId,
  ]);

  useEffect(() => {
    const cid = searchParams.get('configId')?.trim();
    const z = searchParams.get('zoneId');
    if (cid) {
      setConfigureIntent('edit');
      setConfigureConfigId(cid);
      const cfg = getNotificationConfigById(cid);
      setConfigureInitialZoneId(cfg?.zoneId);
      setIsConfigureOpen(true);
      return;
    }
    if (!z) return;
    const id = Number(z);
    if (!Number.isFinite(id)) return;
    const list = getNotificationConfigsForZone(id);
    if (list.length === 1) {
      setConfigureIntent('edit');
      setConfigureConfigId(list[0].configId);
      setConfigureInitialZoneId(id);
    } else {
      setConfigureIntent('create');
      setConfigureConfigId(undefined);
      setConfigureInitialZoneId(id);
    }
    setIsConfigureOpen(true);
  }, [searchParams]);

  const openConfigure = () => {
    setConfigureIntent('create');
    setConfigureInitialZoneId(undefined);
    setConfigureConfigId(undefined);
    stripConfigureParamsFromUrl();
    setIsConfigureOpen(true);
  };

  const openEditZone = (zoneId: number, configId?: string) => {
    if (configId?.trim()) {
      setConfigureIntent('edit');
      setConfigureConfigId(configId.trim());
      setConfigureInitialZoneId(zoneId);
      setIsConfigureOpen(true);
      return;
    }
    const list = getNotificationConfigsForZone(zoneId);
    if (list.length === 1) {
      setConfigureIntent('edit');
      setConfigureConfigId(list[0].configId);
      setConfigureInitialZoneId(zoneId);
      setIsConfigureOpen(true);
      return;
    }
    setConfigureIntent('create');
    setConfigureConfigId(undefined);
    setConfigureInitialZoneId(zoneId);
    setIsConfigureOpen(true);
  };

  const requestDeleteConfig = (configId: string) => {
    modal.confirm({
      title: 'Supprimer cette notification de zone ?',
      content:
        'La configuration de ce secteur est effacée sur cet appareil et les lignes locales liées disparaissent de la liste. Les autres notifications de la même zone ne sont pas modifiées.',
      okText: 'Supprimer',
      okButtonProps: { danger: true },
      cancelText: 'Annuler',
      onOk: () => {
        deleteNotificationConfigById(configId);
        setNotifications(
          readNotificationsFromCache() as CachedNotificationRow[]
        );
        void refreshBell();
        void message.success({
          content: 'Notification supprimée',
          duration: 4,
        });
      },
    });
  };

  if (loading) return <EmptyBox variant="loading" />;

  return (
    <>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Notifications</span>
        <Button
          type="primary"
          size="middle"
          icon={<PlusOutlined />}
          onClick={openConfigure}
        >
          Ajouter une notification de zone
        </Button>
      </div>

      <div className="m-1 mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {notifications.map((notification) => {
          const zid = notificationRowZoneId(notification);
          const rowCfgId = resolveStoredNotificationConfigId(notification);
          return (
            <Notification
              key={notification.id}
              id={notification.id}
              notification={{
                ...notification.notification,
                zone_id: zid,
                zone_name: notification.zone_name,
                notification_config_id: rowCfgId,
                notification_name: notification.notification?.notification_name,
              }}
              is_read={notification.is_read}
              read_at={notification.read_at}
              onEditZone={
                zid != null ? () => openEditZone(zid, rowCfgId) : undefined
              }
              onDeleteZone={
                zid != null && rowCfgId
                  ? () => requestDeleteConfig(rowCfgId)
                  : undefined
              }
            />
          );
        })}
      </div>

      <Modal
        open={isConfigureOpen}
        onCancel={closeConfigureModal}
        footer={null}
        destroyOnClose
        width="min(1200px, calc(100vw - 16px))"
        styles={{ body: { paddingTop: 8 } }}
        title={
          <span className={styles.modalTitle}>
            <BellOutlined className={styles.modalTitleIcon} />
            {configureIntent === 'edit'
              ? 'Modifier la notification de zone'
              : 'Nouvelle notification de zone'}
          </span>
        }
      >
        {isConfigureOpen && (
          <ZoneNotificationConfigureForm
            key={`${configureIntent}-${configureInitialZoneId ?? 'z'}-${configureConfigId ?? 'new'}`}
            intent={configureIntent}
            initialZoneId={configureInitialZoneId ?? null}
            initialConfigId={configureConfigId ?? null}
            onClose={closeConfigureModal}
            onSaved={() => {
              syncNotificationsFromCache();
              void refreshBell();
              refetchNotifications();
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default NotificationsMain;
