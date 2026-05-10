'use client';

import React from 'react';
import { DatePicker, Space, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface DateRangePickerProps {
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  /** Kept for legacy callers; unused. */
  zones?: { id: number; name: string }[];
  selectedZone?: number | null;
  setSelectedZone?: (id: number) => void;
}

const PRESETS: { label: string; value: [Dayjs, Dayjs] }[] = [
  {
    label: 'Aujourd’hui',
    value: [dayjs().startOf('day'), dayjs().endOf('day')],
  },
  { label: '7 derniers jours', value: [dayjs().subtract(7, 'day'), dayjs()] },
  { label: '30 derniers jours', value: [dayjs().subtract(30, 'day'), dayjs()] },
  { label: '3 derniers mois', value: [dayjs().subtract(3, 'month'), dayjs()] },
  { label: '6 derniers mois', value: [dayjs().subtract(6, 'month'), dayjs()] },
  { label: '12 derniers mois', value: [dayjs().subtract(1, 'year'), dayjs()] },
];

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  setStartDate,
  setEndDate,
}) => {
  const handleChange = (range: [Dayjs | null, Dayjs | null] | null) => {
    if (!range || !range[0] || !range[1]) return;
    setStartDate(range[0].format('YYYY-MM-DD'));
    setEndDate(range[1].format('YYYY-MM-DD'));
  };

  return (
    <Space size={8} align="center">
      <Typography.Text type="secondary" style={{ whiteSpace: 'nowrap' }}>
        Période
      </Typography.Text>
      <RangePicker
        size="middle"
        format="DD/MM/YYYY"
        allowClear
        presets={PRESETS}
        onChange={(range) =>
          handleChange(range as [Dayjs | null, Dayjs | null] | null)
        }
        style={{ minWidth: 280 }}
      />
    </Space>
  );
};

export default DateRangePicker;
