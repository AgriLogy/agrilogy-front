'use client';

import React from 'react';
import { Box, Button, HStack } from '@chakra-ui/react';

import { PageInfoBar } from '@/app/components/layout/PageInfoBar';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import FarmSettingsSection from '@/app/components/settings/FarmSettingsSection';
import SensorDirectorySettings from '@/app/components/settings/SensorDirectorySettings';
import SensorGroupsSettings from '@/app/components/settings/SensorGroupsSettings';
import SensorReadingsSettings from '@/app/components/settings/SensorReadingsSettings';
import SuperAdminUsersSettings from '@/app/components/settings/SuperAdminUsersSettings';

type SettingsTab = 'farms' | 'users' | 'sensors' | 'readings' | 'groups';

const TABS: Array<{ key: SettingsTab; label: string }> = [
  { key: 'farms', label: 'Fermes' },
  { key: 'users', label: 'Utilisateurs' },
  { key: 'sensors', label: 'Capteurs' },
  { key: 'readings', label: 'Lectures' },
  { key: 'groups', label: 'Groupes de capteurs' },
];

const SettingsMain = () => {
  const { tabAccent, iconColor } = useColorModeStyles();
  const [activeTab, setActiveTab] = React.useState<SettingsTab>('readings');
  const activeLabel =
    TABS.find((t) => t.key === activeTab)?.label ?? 'Lectures';

  return (
    <Box px={{ base: 3, md: 4 }} py={{ base: 3, md: 4 }}>
      <PageInfoBar
        title="Paramètres"
        subtitle={activeLabel}
        actions={
          <HStack
            spacing={{ base: 1, md: 2 }}
            overflowX="auto"
            whiteSpace="nowrap"
          >
            {TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <Button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  variant="ghost"
                  size="sm"
                  color={isActive ? tabAccent : iconColor}
                  borderBottomWidth="2px"
                  borderBottomColor={isActive ? tabAccent : 'transparent'}
                  borderRadius="0"
                  textTransform="uppercase"
                  fontSize="xs"
                  fontWeight="700"
                  letterSpacing="0.3px"
                  _hover={{ color: tabAccent }}
                >
                  {tab.label}
                </Button>
              );
            })}
          </HStack>
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
        {activeTab === 'readings' && <SensorReadingsSettings />}
        {activeTab === 'farms' && <FarmSettingsSection />}
        {activeTab === 'users' && <SuperAdminUsersSettings />}
        {activeTab === 'sensors' && <SensorDirectorySettings />}
        {activeTab === 'groups' && <SensorGroupsSettings />}
      </Box>
    </Box>
  );
};

export default SettingsMain;
