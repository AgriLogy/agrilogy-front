'use client';

import React, { useState } from 'react';
import { Badge, Button, Tooltip } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNotificationBellCounts } from '@/app/hooks/useNotificationBellCounts';
import ZoneNotificationConfigureModal from '@/app/components/notifications/ZoneNotificationConfigureModal';
import { getNotificationConfigsForZone } from '@/app/lib/zoneNotificationConfigStorage';

type ZoneNotificationBellProps = {
  zoneId: number;
  zoneName: string;
};

const ZoneNotificationBell: React.FC<ZoneNotificationBellProps> = ({
  zoneId,
  zoneName,
}) => {
  const { unreadForZone, refresh } = useNotificationBellCounts();
  const count = unreadForZone(zoneId);

  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<'create' | 'edit'>('create');
  const [configId, setConfigId] = useState<string | null>(null);

  const openModal = () => {
    const list = getNotificationConfigsForZone(zoneId);
    if (list.length === 1) {
      setIntent('edit');
      setConfigId(list[0].configId);
    } else {
      setIntent('create');
      setConfigId(null);
    }
    setOpen(true);
  };

  const tooltip =
    count > 0
      ? `${count} notification(s) — ${zoneName}`
      : `Notifications — ${zoneName}`;

  return (
    <>
      <Tooltip title={tooltip} mouseEnterDelay={0.3}>
        <Badge
          count={count > 99 ? '99+' : count || 0}
          size="small"
          offset={[-2, 2]}
        >
          <Button
            type="text"
            shape="circle"
            icon={<BellOutlined />}
            aria-label={`Notifications zone ${zoneName}`}
            onClick={openModal}
          />
        </Badge>
      </Tooltip>
      <ZoneNotificationConfigureModal
        open={open}
        onClose={() => setOpen(false)}
        intent={intent}
        initialZoneId={zoneId}
        initialConfigId={configId}
        onSaved={() => {
          void refresh();
        }}
      />
    </>
  );
};

export default ZoneNotificationBell;
