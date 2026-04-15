'use client';
import React from 'react';
import st from './SettingsMain.module.css';
import { Box, HStack, Text, Button } from '@chakra-ui/react';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import SensorReadingsSettings from '@/app/components/settings/SensorReadingsSettings';
import FarmSettingsSection from '@/app/components/settings/FarmSettingsSection';
import SuperAdminUsersSettings from '@/app/components/settings/SuperAdminUsersSettings';
import SensorDirectorySettings from '@/app/components/settings/SensorDirectorySettings';
import SensorGroupsSettings from '@/app/components/settings/SensorGroupsSettings';

const SettingsMain = () => {
  const { bg, textColor, borderColor, tabAccent, iconColor } =
    useColorModeStyles();
  const [activeTab, setActiveTab] = React.useState<
    'farms' | 'users' | 'sensors' | 'readings' | 'groups'
  >('readings');

  const tabs: Array<{
    key: 'farms' | 'users' | 'sensors' | 'readings' | 'groups';
    label: string;
  }> = [
    { key: 'farms', label: 'Fermes' },
    { key: 'users', label: 'Utilisateurs' },
    { key: 'sensors', label: 'Capteurs' },
    { key: 'readings', label: 'Lectures' },
    { key: 'groups', label: 'Groupes de capteurs' },
  ];

  return (
    <div className={st.container}>
      <Box
        bg={bg}
        className={st.wide}
        borderRadius="5px"
        border="1px solid #e2e8f0"
        px={3}
        py={2}
        mb={2}
      >
        <HStack
          spacing={{ base: 1, md: 3 }}
          overflowX="auto"
          whiteSpace="nowrap"
        >
          {tabs.map((tab) => {
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
      </Box>
      <Box
        bg={bg}
        className={st.header}
        borderWidth="1px"
        borderColor={borderColor}
        borderStyle="solid"
      >
        <Text color={textColor}>
          {tabs.find((t) => t.key === activeTab)?.label ?? 'Lectures'}
        </Text>
      </Box>
      <Box
        bg={bg}
        className={`${st.wide} ${st['text-box']}`}
        borderWidth="1px"
        borderColor={borderColor}
        borderStyle="solid"
      >
        {activeTab === 'readings' && <SensorReadingsSettings />}
        {activeTab === 'farms' && <FarmSettingsSection />}
        {activeTab === 'users' && <SuperAdminUsersSettings />}
        {activeTab === 'sensors' && <SensorDirectorySettings />}
        {activeTab === 'groups' && <SensorGroupsSettings />}
      </Box>
    </div>
  );
};

export default SettingsMain;
