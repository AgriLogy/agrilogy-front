'use client';

import React, { useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import {
  App,
  Badge,
  Button,
  Col,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import {
  ApiOutlined,
  ClusterOutlined,
  PlusOutlined,
  PoweroffOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import ValveSchematic from '@/app/components/vannes-pompes/ValveSchematic';
import PumpSchematic from '@/app/components/vannes-pompes/PumpSchematic';
import {
  dispatchVannesPompesUpdated,
  loadVannesPompesFromStorage,
  VANNES_POMPES_STORAGE_KEY,
  type Pump,
  type Vane,
} from '@/app/utils/vannesPompesStorage';
import styles from './VannesPompesMain.module.scss';

export type { Pump, Vane };

const { Title, Text, Paragraph } = Typography;

function newId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface VaneFormValues {
  name: string;
  devEui?: string;
}

interface PumpFormValues {
  name: string;
}

const VannesPompesMain = () => {
  const { message } = App.useApp();
  const [vanes, setVanes] = useState<Vane[]>([]);
  const [pumps, setPumps] = useState<Pump[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const [vaneOpen, setVaneOpen] = useState(false);
  const [pumpOpen, setPumpOpen] = useState(false);
  const [vaneForm] = Form.useForm<VaneFormValues>();
  const [pumpForm] = Form.useForm<PumpFormValues>();

  useEffect(() => {
    const { vanes: v, pumps: p } = loadVannesPompesFromStorage();
    setVanes(v);
    setPumps(p);
    setHydrated(true);
  }, []);

  const persist = useCallback((next: { vanes: Vane[]; pumps: Pump[] }) => {
    localStorage.setItem(VANNES_POMPES_STORAGE_KEY, JSON.stringify(next));
    dispatchVannesPompesUpdated();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persist({ vanes, pumps });
  }, [vanes, pumps, hydrated, persist]);

  const submitVane = (values: VaneFormValues) => {
    const name = values.name.trim();
    if (!name) return;
    const devEui = (values.devEui ?? '').trim() || '—';
    setVanes((prev) => [
      ...prev,
      { id: newId('vane'), name, devEui, active: false },
    ]);
    vaneForm.resetFields();
    setVaneOpen(false);
    void message.success('Vanne créée.');
  };

  const submitPump = (values: PumpFormValues) => {
    const name = values.name.trim();
    if (!name) return;
    setPumps((prev) => [...prev, { id: newId('pump'), name, running: false }]);
    pumpForm.resetFields();
    setPumpOpen(false);
    void message.success('Pompe créée.');
  };

  const toggleVane = (id: string) =>
    setVanes((prev) =>
      prev.map((v) => (v.id === id ? { ...v, active: !v.active } : v))
    );

  const togglePump = (id: string) =>
    setPumps((prev) =>
      prev.map((p) => (p.id === id ? { ...p, running: !p.running } : p))
    );

  return (
    <div className={styles.page} data-testid="vannes-pompes-main">
      {/* Header — matches the dashboard flow (StationMain, SoilMain, …) */}
      <Flex className={styles.header} align="center" gap={12} wrap="wrap">
        <ApiOutlined style={{ fontSize: 18 }} />
        <Title level={5} className={styles.title}>
          Vannes et pompes
        </Title>

        <div className={styles.spacer} />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setVaneOpen(true)}
        >
          Ajouter une vanne
        </Button>
        <Button icon={<PlusOutlined />} onClick={() => setPumpOpen(true)}>
          Ajouter une pompe
        </Button>
        <Tooltip title="Voir le schéma de réseau complet">
          <Button icon={<ShareAltOutlined />}>
            <NextLink href="/vannes-pompes/schema">Vue schéma</NextLink>
          </Button>
        </Tooltip>
      </Flex>

      {/* Vannes */}
      <section className={styles.section}>
        <Flex align="center" gap={8} wrap="wrap">
          <ClusterOutlined />
          <Title level={5} className={styles.sectionTitle}>
            Vannes
          </Title>
          <Tag>{vanes.length}</Tag>
        </Flex>
        {vanes.length === 0 ? (
          <Paragraph className={styles.empty}>
            Aucune vanne. Cliquez sur « Ajouter une vanne » pour en créer une.
          </Paragraph>
        ) : (
          <Row gutter={[16, 16]}>
            {vanes.map((vane, index) => (
              <Col key={vane.id} xs={24} md={12} xl={8}>
                <VaneCard
                  vane={vane}
                  schematicLabel={String(index + 1)}
                  onToggle={() => toggleVane(vane.id)}
                />
              </Col>
            ))}
          </Row>
        )}
      </section>

      {/* Pompes */}
      <section className={styles.section}>
        <Flex align="center" gap={8} wrap="wrap">
          <PoweroffOutlined />
          <Title level={5} className={styles.sectionTitle}>
            Pompes
          </Title>
          <Tag>{pumps.length}</Tag>
        </Flex>
        {pumps.length === 0 ? (
          <Paragraph className={styles.empty}>
            Aucune pompe. Utilisez « Ajouter une pompe » pour en créer une.
          </Paragraph>
        ) : (
          <Row gutter={[16, 16]}>
            {pumps.map((pump) => (
              <Col key={pump.id} xs={24} md={12} xl={8}>
                <PumpCard pump={pump} onToggle={() => togglePump(pump.id)} />
              </Col>
            ))}
          </Row>
        )}
      </section>

      {/* Modals */}
      <Modal
        title="Nouvelle vanne"
        open={vaneOpen}
        onCancel={() => setVaneOpen(false)}
        onOk={() => vaneForm.submit()}
        okText="Créer"
        cancelText="Annuler"
        destroyOnHidden
      >
        <Form
          form={vaneForm}
          layout="vertical"
          onFinish={submitVane}
          requiredMark={false}
        >
          <Form.Item
            label="Nom"
            name="name"
            rules={[{ required: true, message: 'Le nom est requis.' }]}
          >
            <Input placeholder="ex. Vanne 1" />
          </Form.Item>
          <Form.Item label="DevEUI (optionnel)" name="devEui">
            <Input
              placeholder="0004A30B00F7A7FE"
              style={{
                fontFamily:
                  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace',
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Nouvelle pompe"
        open={pumpOpen}
        onCancel={() => setPumpOpen(false)}
        onOk={() => pumpForm.submit()}
        okText="Créer"
        cancelText="Annuler"
        destroyOnHidden
      >
        <Form
          form={pumpForm}
          layout="vertical"
          onFinish={submitPump}
          requiredMark={false}
        >
          <Form.Item
            label="Nom"
            name="name"
            rules={[{ required: true, message: 'Le nom est requis.' }]}
          >
            <Input placeholder="ex. Pompe ligne principale" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

function VaneCard({
  vane,
  schematicLabel,
  onToggle,
}: {
  vane: Vane;
  schematicLabel: string;
  onToggle: () => void;
}) {
  return (
    <div
      className={`${styles.card} ${vane.active ? styles.cardActive : styles.cardInactive}`}
    >
      <div className={styles.cardRow}>
        <div style={{ flexShrink: 0 }}>
          <ValveSchematic active={vane.active} label={schematicLabel} />
        </div>
        <div className={styles.cardBody}>
          <Flex justify="space-between" align="center">
            <Title level={5} className={styles.cardName}>
              {vane.name}
            </Title>
            <Tag>Manuel</Tag>
          </Flex>
          <Text className={styles.devEui}>DevEUI : {vane.devEui}</Text>
          <span className={styles.statusRow}>
            <Badge
              status={vane.active ? 'success' : 'default'}
              text={vane.active ? 'Ouverte (active)' : 'Fermée (inactive)'}
            />
          </span>
        </div>
      </div>
      <Button
        block
        type={vane.active ? 'primary' : 'primary'}
        danger={!vane.active}
        icon={<PoweroffOutlined />}
        onClick={onToggle}
      >
        {vane.active ? 'Désactiver' : 'Activer'}
      </Button>
    </div>
  );
}

function PumpCard({ pump, onToggle }: { pump: Pump; onToggle: () => void }) {
  return (
    <div
      className={`${styles.card} ${pump.running ? styles.cardActive : styles.cardIdle}`}
    >
      <div className={styles.cardRow}>
        <div style={{ flexShrink: 0 }}>
          <PumpSchematic running={pump.running} />
        </div>
        <div className={styles.cardBody}>
          <Title level={5} className={styles.cardName}>
            {pump.name}
          </Title>
          <span className={styles.statusRow}>
            <Badge
              status={pump.running ? 'success' : 'default'}
              text={pump.running ? 'En marche' : 'Arrêtée'}
            />
          </span>
        </div>
      </div>
      <Button
        block
        type="primary"
        danger={pump.running}
        icon={<PoweroffOutlined />}
        onClick={onToggle}
      >
        {pump.running ? 'Arrêter' : 'Démarrer'}
      </Button>
    </div>
  );
}

export default VannesPompesMain;
