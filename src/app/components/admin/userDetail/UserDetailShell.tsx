'use client';

import { App, Skeleton, Tabs } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@chakra-ui/react';

import { PageInfoBar } from '@/app/components/layout/PageInfoBar';
import { adminUserApi, type AdminUserDetail } from '@/app/lib/adminUserApi';
import ActivityTab from './ActivityTab';
import AlertsNotifsTab from './AlertsNotifsTab';
import GraphsTab from './GraphsTab';
import ParamsTab from './ParamsTab';
import ProfileTab from './ProfileTab';
import SoilDataTab from './SoilDataTab';
import StationDataTab from './StationDataTab';
import UserHeaderActions from './UserHeaderActions';
import UserStatusLine from './UserStatusLine';
import ZonesTab from './ZonesTab';

type TabKey =
  | 'profile'
  | 'zones'
  | 'params'
  | 'graphs'
  | 'soil-data'
  | 'station-data'
  | 'alerts'
  | 'activity';

const KNOWN_TABS: TabKey[] = [
  'profile',
  'zones',
  'params',
  'graphs',
  'soil-data',
  'station-data',
  'alerts',
  'activity',
];

export type UserDetailShellProps = {
  username: string;
};

export function UserDetailShell({ username }: UserDetailShellProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTab = searchParams?.get('tab') ?? 'profile';
  const activeTab: TabKey = (KNOWN_TABS as string[]).includes(rawTab)
    ? (rawTab as TabKey)
    : 'profile';

  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await adminUserApi.retrieve(username);
      setUser(next);
    } catch {
      message.error("Impossible de charger l'utilisateur.");
    } finally {
      setLoading(false);
    }
  }, [message, username]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleTabChange = (key: string) => {
    router.replace(`/admin/users/${encodeURIComponent(username)}?tab=${key}`);
  };

  const subtitle = useMemo(() => {
    if (loading || !user) return 'Chargement…';
    return <UserStatusLine user={user} />;
  }, [loading, user]);

  return (
    <Box px={{ base: 3, md: 4 }} py={{ base: 3, md: 4 }}>
      <PageInfoBar
        title={user ? `${user.firstname} ${user.lastname}` : username}
        subtitle={subtitle}
        actions={
          user ? <UserHeaderActions user={user} onChange={setUser} /> : null
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
        {loading || !user ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            destroyOnHidden
            items={[
              {
                key: 'profile',
                label: 'Profil',
                children: <ProfileTab user={user} onChange={setUser} />,
              },
              {
                key: 'zones',
                label: 'Zones',
                children: <ZonesTab username={username} />,
              },
              {
                key: 'params',
                label: 'Paramètres',
                children: <ParamsTab username={username} />,
              },
              {
                key: 'graphs',
                label: 'Graphiques',
                children: <GraphsTab username={username} />,
              },
              {
                key: 'soil-data',
                label: 'Données — Sol',
                children: <SoilDataTab username={username} />,
              },
              {
                key: 'station-data',
                label: 'Données — Station',
                children: <StationDataTab username={username} />,
              },
              {
                key: 'alerts',
                label: 'Alertes & notifs',
                children: <AlertsNotifsTab username={username} />,
              },
              {
                key: 'activity',
                label: 'Activité',
                children: <ActivityTab username={username} />,
              },
            ]}
          />
        )}
      </Box>
    </Box>
  );
}

export default UserDetailShell;
