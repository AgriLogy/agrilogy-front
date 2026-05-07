'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, LeftOutlined } from '@ant-design/icons';
import {
  type KcProtocolStageRow,
  defaultKcProtocolStages,
} from '@/app/lib/zoneNotificationConfigStorage';
import styles from './KcProtocolTableModal.module.scss';

export type KcProtocolTableModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialProtocolName: string;
  initialStages: KcProtocolStageRow[];
  onSave: (payload: {
    protocolName: string;
    stages: KcProtocolStageRow[];
  }) => void;
};

function cloneStages(rows: KcProtocolStageRow[]): KcProtocolStageRow[] {
  return rows.map((r) => ({ ...r }));
}

const emptyRow = (): KcProtocolStageRow => ({
  stageName: '',
  durationDays: 30,
  kcStart: 0.35,
  kcEnd: 0.6,
  amountMm: 0,
  active: true,
});

type Row = KcProtocolStageRow & { __index: number };

const KcProtocolTableModal: React.FC<KcProtocolTableModalProps> = ({
  isOpen,
  onClose,
  initialProtocolName,
  initialStages,
  onSave,
}) => {
  const [protocolName, setProtocolName] = useState('');
  const [stages, setStages] = useState<KcProtocolStageRow[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    setProtocolName(initialProtocolName?.trim() || '');
    setStages(
      initialStages?.length > 0
        ? cloneStages(initialStages)
        : cloneStages(defaultKcProtocolStages())
    );
  }, [isOpen, initialProtocolName, initialStages]);

  const totalDurationDays = useMemo(() => {
    return stages.reduce((acc, row) => {
      if (!row.active) return acc;
      const d = Number(row.durationDays);
      return acc + (Number.isFinite(d) && d > 0 ? Math.round(d) : 0);
    }, 0);
  }, [stages]);

  const updateRow = (index: number, patch: Partial<KcProtocolStageRow>) => {
    setStages((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );
  };

  const removeRow = (index: number) => {
    setStages((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)
    );
  };

  const addRow = () => {
    setStages((prev) => [...prev, emptyRow()]);
  };

  const handleSave = () => {
    onSave({
      protocolName: protocolName.trim() || 'Protocole Kc',
      stages: cloneStages(stages),
    });
    onClose();
  };

  const dataSource: Row[] = stages.map((row, i) => ({ ...row, __index: i }));

  const columns: ColumnsType<Row> = [
    {
      title: '#',
      key: 'index',
      width: 52,
      render: (_v, _row, i) => String(i + 1).padStart(2, '0'),
    },
    {
      title: 'Nom du stade',
      dataIndex: 'stageName',
      key: 'stageName',
      render: (_v, row) => (
        <Input
          size="small"
          value={row.stageName}
          onChange={(e) =>
            updateRow(row.__index, { stageName: e.target.value })
          }
          placeholder="ex. Avril"
        />
      ),
    },
    {
      title: 'Durée (jours)',
      dataIndex: 'durationDays',
      key: 'durationDays',
      align: 'right',
      render: (_v, row) => (
        <InputNumber
          size="small"
          min={0}
          value={row.durationDays}
          onChange={(v) =>
            updateRow(row.__index, {
              durationDays: typeof v === 'number' && Number.isFinite(v) ? v : 0,
            })
          }
        />
      ),
    },
    {
      title: 'Kc début',
      dataIndex: 'kcStart',
      key: 'kcStart',
      align: 'right',
      render: (_v, row) => (
        <InputNumber
          size="small"
          min={0}
          max={2}
          step={0.05}
          value={row.kcStart}
          onChange={(v) =>
            updateRow(row.__index, {
              kcStart: typeof v === 'number' && Number.isFinite(v) ? v : 0,
            })
          }
        />
      ),
    },
    {
      title: 'Kc fin',
      dataIndex: 'kcEnd',
      key: 'kcEnd',
      align: 'right',
      render: (_v, row) => (
        <InputNumber
          size="small"
          min={0}
          max={2}
          step={0.05}
          value={row.kcEnd}
          onChange={(v) =>
            updateRow(row.__index, {
              kcEnd: typeof v === 'number' && Number.isFinite(v) ? v : 0,
            })
          }
        />
      ),
    },
    {
      title: 'Quantité (mm)',
      dataIndex: 'amountMm',
      key: 'amountMm',
      align: 'right',
      render: (_v, row) => (
        <InputNumber
          size="small"
          min={0}
          value={row.amountMm}
          onChange={(v) =>
            updateRow(row.__index, {
              amountMm: typeof v === 'number' && Number.isFinite(v) ? v : 0,
            })
          }
        />
      ),
    },
    {
      title: 'Actif',
      dataIndex: 'active',
      key: 'active',
      align: 'center',
      width: 72,
      render: (_v, row) => (
        <Switch
          checked={row.active}
          onChange={(checked) => updateRow(row.__index, { active: checked })}
        />
      ),
    },
    {
      title: '',
      key: 'remove',
      width: 52,
      render: (_v, row) => (
        <Button
          type="text"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => removeRow(row.__index)}
          disabled={stages.length <= 1}
          aria-label="Supprimer le stade"
        />
      ),
    },
  ];

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width="min(1100px, calc(100vw - 16px))"
      destroyOnClose
      title={
        <div>
          <p className={styles.subhead}>Nouveau protocole &gt; Météo</p>
          <p className={styles.title}>Table des coefficients Kc</p>
        </div>
      }
      footer={
        <div className={styles.totalRow}>
          <Button
            shape="circle"
            icon={<LeftOutlined />}
            onClick={onClose}
            aria-label="Retour"
          />
          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-end">
            <span className={styles.total}>
              Durée totale du protocole :{' '}
              <span className={styles.totalValue}>{totalDurationDays}</span>{' '}
              jours
            </span>
            <Button type="primary" onClick={handleSave}>
              Enregistrer le protocole
            </Button>
          </div>
        </div>
      }
    >
      <Form layout="vertical" requiredMark={false}>
        <Form.Item label="Nom du protocole" className="max-w-md">
          <Input
            value={protocolName}
            onChange={(e) => setProtocolName(e.target.value)}
            placeholder="Protocole météo Pomme"
          />
        </Form.Item>
      </Form>

      <Table<Row>
        columns={columns}
        dataSource={dataSource}
        rowKey="__index"
        size="small"
        pagination={false}
        scroll={{ x: 'max-content' }}
      />

      <Button className="mt-3" onClick={addRow}>
        + Ajouter un stade
      </Button>
    </Modal>
  );
};

export default KcProtocolTableModal;
