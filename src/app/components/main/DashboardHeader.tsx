'use client';

import React from 'react';
import { Divider, Flex, Select, Typography } from 'antd';
import ZoneNotificationBell from '@/app/components/common/ZoneNotificationBell';
import DateRangePicker from '@/app/components/analytics/DateRangePicker';
import styles from './DashboardHeader.module.scss';

export interface DashboardHeaderProps {
  /** Left-side label (e.g. "Station météo" / "Données sur le sol"). */
  label: string;
  zones: { id: number; name: string }[];
  selectedZone: number | null;
  setSelectedZone: (id: number) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

/** Polished antd dashboard header. Layout (md+):
 *
 *   [📡 Title] [Zone Select] | [🔔]              [Période — RangePicker]
 *
 * - All controls antd-native (Select, Button+Badge bell, RangePicker).
 * - A short vertical Divider separates the zone selector from the bell
 *   so the two related controls read as a small group.
 * - Theme tokens (var(--surface-card), var(--text-primary), etc.) keep
 *   light/dark parity with the login page.
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  label,
  zones,
  selectedZone,
  setSelectedZone,
  setStartDate,
  setEndDate,
}) => {
  const zoneName = zones.find((z) => z.id === selectedZone)?.name ?? 'Zone';

  return (
    <Flex
      className={styles.header}
      align="center"
      gap={12}
      wrap="wrap"
      role="banner"
    >
      <Typography.Title level={5} className={styles.title}>
        {label}
      </Typography.Title>

      <Select
        className={styles.zoneSelect}
        value={selectedZone ?? undefined}
        onChange={(id) => setSelectedZone(Number(id))}
        options={zones.map((z) => ({ value: z.id, label: z.name }))}
        placeholder="Sélectionner une zone"
        showSearch
        optionFilterProp="label"
      />

      {selectedZone != null && (
        <>
          <Divider type="vertical" className={styles.divider} />
          <ZoneNotificationBell zoneId={selectedZone} zoneName={zoneName} />
        </>
      )}

      <div className={styles.spacer} />

      <DateRangePicker setStartDate={setStartDate} setEndDate={setEndDate} />
    </Flex>
  );
};

export default DashboardHeader;
