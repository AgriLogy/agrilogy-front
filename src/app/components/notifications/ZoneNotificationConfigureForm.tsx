'use client';

import React, { useEffect, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  App,
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
} from 'antd';
import {
  FaBell,
  FaBolt,
  FaChartLine,
  FaClock,
  FaCloud,
  FaCubes,
  FaEnvelopeOpenText,
  FaFan,
  FaFilter,
  FaInfoCircle,
  FaLeaf,
  FaMapMarkedAlt,
  FaMobileAlt,
  FaPen,
  FaPercent,
  FaRandom,
  FaSeedling,
  FaShower,
  FaSitemap,
  FaSlidersH,
  FaSun,
  FaTachometerAlt,
  FaTint,
  FaTree,
  FaVectorSquare,
  FaWater,
  FaWhatsapp,
} from 'react-icons/fa';
import api from '@/app/lib/api';
import { logOptionalApiFailure } from '@/app/utils/apiClientErrors';
import {
  saveZoneNotificationConfig,
  getNotificationConfigById,
  getNotificationConfigsForZone,
  defaultKcProtocolStages,
  representativeKcFromStages,
  type ZoneNotificationConfig,
} from '@/app/lib/zoneNotificationConfigStorage';
import KcProtocolTableModal from '@/app/components/notifications/KcProtocolTableModal';
import { evaluateV1NotificationDecision } from '@/app/lib/notificationDecisionEngine';
import { dispatchZoneNotificationOutbound } from '@/app/lib/notificationDispatch';
import {
  prependNotificationsToCache,
  removeLocalZoneTemplateNotificationsForConfig,
} from '@/app/lib/notificationsCacheStorage';
import { buildLocalZoneConfirmationNotification } from '@/app/lib/zoneNotificationTemplate';
import styles from './ZoneNotificationConfigureForm.module.scss';

const defaultConfig = (
  zoneId: number,
  configId = ''
): ZoneNotificationConfig => ({
  configId,
  zoneId,
  secteurLabel: '',
  notificationName: '',
  soilType: 'light',
  soilCharacteristics: 'TAW & RAW & FC & WP',
  soilMoistureSource: 'avg_sensors',
  kcMode: 'table',
  kc: 0.85,
  et0Source: 'weather_station',
  precipSource: 'sensor',
  krFactor: 0.4,
  zoneAreaHa: 5,
  cropType: 'Tomates',
  flowRateM3h: 30,
  irrigationMethod: 'drip_sprinkler',
  intervalMinutes: 60,
  soilPermeabilityPct: 75,
  valveMode: 'auto',
  vpdThresholdKpa: 0.5,
  rootMonitoring: 'on',
  criticalThresholdPct: 20,
  et0KcAdvisoryMm: 4,
  maxWaterM3: 50,
  notifyEmail: true,
  notifySms: false,
  notifyWhatsapp: false,
  updatedAt: '',
  kcProtocolName: 'Protocole météo culture',
  kcStages: defaultKcProtocolStages(),
  kcSensorHumidityLow: true,
  kcSensorHumidityMid: true,
  kcSensorHumidityHigh: true,
});

function normalizeKcStages(
  raw: ZoneNotificationConfig['kcStages'] | undefined
): ZoneNotificationConfig['kcStages'] {
  if (!Array.isArray(raw) || raw.length === 0) return defaultKcProtocolStages();
  return raw.map((s) => ({
    stageName: String(s.stageName ?? ''),
    durationDays: Math.max(0, Math.round(Number(s.durationDays) || 0)),
    kcStart: Math.min(2, Math.max(0, Number(s.kcStart) || 0)),
    kcEnd: Math.min(2, Math.max(0, Number(s.kcEnd) || 0)),
    amountMm: Math.max(0, Number(s.amountMm) || 0),
    active: s.active !== false,
  }));
}

function mergeZoneConfig(
  zoneId: number,
  saved?:
    | ZoneNotificationConfig
    | (Partial<ZoneNotificationConfig> & Record<string, unknown>)
): ZoneNotificationConfig {
  const base = defaultConfig(zoneId);
  if (!saved) return base;
  const {
    contactEmail: _e,
    contactPhone: _p,
    ...rest
  } = saved as Record<string, unknown>;
  const merged = {
    ...base,
    ...(rest as Partial<ZoneNotificationConfig>),
    zoneId,
  };
  if (typeof merged.configId !== 'string' || !merged.configId.trim()) {
    merged.configId = base.configId;
  }
  if (typeof merged.secteurLabel !== 'string') merged.secteurLabel = '';
  merged.kcStages = normalizeKcStages(merged.kcStages);
  if (typeof merged.kcProtocolName !== 'string') {
    merged.kcProtocolName = base.kcProtocolName;
  }
  if (merged.kcMode === 'table') {
    merged.kc = representativeKcFromStages(merged.kcStages);
  }
  if (typeof merged.kcSensorHumidityLow !== 'boolean') {
    merged.kcSensorHumidityLow = base.kcSensorHumidityLow;
  }
  if (typeof merged.kcSensorHumidityMid !== 'boolean') {
    merged.kcSensorHumidityMid = base.kcSensorHumidityMid;
  }
  if (typeof merged.kcSensorHumidityHigh !== 'boolean') {
    merged.kcSensorHumidityHigh = base.kcSensorHumidityHigh;
  }
  return merged;
}

function pickInitialZoneId(
  zones: { id: number; name: string }[],
  initialZoneId: number | null | undefined
): number | undefined {
  if (!zones.length) return undefined;
  if (
    initialZoneId != null &&
    Number.isFinite(initialZoneId) &&
    zones.some((x) => x.id === initialZoneId)
  ) {
    return initialZoneId;
  }
  return zones[0]?.id;
}

function LabelWithIcon({
  icon: Icon,
  children,
}: {
  icon: IconType;
  children: React.ReactNode;
}) {
  return (
    <span className={styles.label}>
      <Icon className={styles.labelIcon} aria-hidden />
      <span>{children}</span>
    </span>
  );
}

function PanelTitle({
  icon: Icon,
  title,
  accentClassName = 'text-primary-500',
}: {
  icon: IconType;
  title: string;
  accentClassName?: string;
}) {
  return (
    <div className={styles.panelTitle}>
      <Icon
        className={`${styles.panelTitleIcon} ${accentClassName}`}
        aria-hidden
      />
      <span className={styles.panelTitleText}>{title}</span>
    </div>
  );
}

export type ZoneNotificationConfigureFormProps = {
  initialZoneId?: number | null;
  initialConfigId?: string | null;
  intent?: 'create' | 'edit';
  onClose: () => void;
  onSaved?: () => void;
};

const ZoneNotificationConfigureForm: React.FC<
  ZoneNotificationConfigureFormProps
> = ({
  initialZoneId,
  initialConfigId,
  intent = 'create',
  onClose,
  onSaved,
}) => {
  const { message } = App.useApp();
  const [isKcTableOpen, setIsKcTableOpen] = useState(false);

  const [zones, setZones] = useState<{ id: number; name: string }[]>([]);
  const [zoneId, setZoneId] = useState<number>(0);
  const [form, setForm] = useState<ZoneNotificationConfig | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<{ id: number; name: string }[]>(
          '/api/zones-names-per-user/'
        );
        const z = res.data || [];
        setZones(z);
        if (z.length > 0) {
          let cfgId = initialConfigId?.trim() ?? '';

          if (intent === 'edit' && !cfgId) {
            const initialId = pickInitialZoneId(z, initialZoneId ?? null);
            if (initialId != null) {
              const list = getNotificationConfigsForZone(initialId);
              if (list.length === 1) {
                cfgId = list[0].configId;
              } else if (list.length > 1) {
                cfgId = list[0].configId;
                void message.info({
                  content:
                    'Plusieurs secteurs pour cette zone. Ouvrez la modification depuis la carte de notification concernée pour cibler le bon secteur.',
                  duration: 5,
                });
              }
            }
          }

          if (cfgId) {
            const cfg = getNotificationConfigById(cfgId);
            const initialId =
              cfg?.zoneId ?? pickInitialZoneId(z, initialZoneId ?? null);
            if (initialId !== undefined) {
              setZoneId(initialId);
              setForm(
                mergeZoneConfig(
                  initialId,
                  cfg ??
                    ({
                      configId: cfgId,
                      zoneId: initialId,
                    } as Partial<ZoneNotificationConfig>)
                )
              );
            }
          } else if (intent !== 'edit') {
            const initialId = pickInitialZoneId(z, initialZoneId ?? null);
            if (initialId !== undefined) {
              setZoneId(initialId);
              const draftId =
                typeof crypto !== 'undefined' && 'randomUUID' in crypto
                  ? crypto.randomUUID()
                  : `cfg-${Date.now()}`;
              setForm(
                mergeZoneConfig(initialId, {
                  configId: draftId,
                  zoneId: initialId,
                } as Partial<ZoneNotificationConfig>)
              );
            }
          } else {
            const initialId = pickInitialZoneId(z, initialZoneId ?? null);
            if (initialId !== undefined) {
              setZoneId(initialId);
              void message.warning({
                content:
                  'Configuration introuvable. Aucune notification enregistrée pour cette zone. Fermez ce panneau et utilisez « Ajouter une notification de zone ».',
              });
              setForm(mergeZoneConfig(initialId, undefined));
            }
          }
        }
      } catch (k) {
        logOptionalApiFailure('ZoneNotificationConfigure: zones', k);
        void message.error({ content: 'Impossible de charger les zones' });
      }
    };
    void load();
  }, [initialZoneId, initialConfigId, intent, message]);

  const update = <K extends keyof ZoneNotificationConfig>(
    key: K,
    value: ZoneNotificationConfig[K]
  ) => {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  };

  const apply = async () => {
    if (!form) {
      void message.warning({ content: 'Chargement…' });
      return;
    }
    if (!zones.length) {
      void message.error({ content: 'Aucune zone disponible' });
      return;
    }
    const resolvedZoneId = zones.some((z) => z.id === zoneId)
      ? zoneId
      : form.zoneId;
    if (!zones.some((z) => z.id === resolvedZoneId)) {
      void message.warning({ content: 'Veuillez sélectionner une zone' });
      return;
    }
    const cfgId = form.configId?.trim();
    if (!cfgId) {
      void message.error({
        content: 'Identifiant de configuration manquant',
      });
      return;
    }
    const hadConfigBefore =
      intent === 'edit' || getNotificationConfigById(cfgId) !== undefined;
    const toSave = { ...form, zoneId: resolvedZoneId, configId: cfgId };

    removeLocalZoneTemplateNotificationsForConfig(cfgId);
    saveZoneNotificationConfig(toSave);

    const zoneLabel =
      zones.find((z) => z.id === toSave.zoneId)?.name ??
      `Zone ${toSave.zoneId}`;
    if (!hadConfigBefore) {
      prependNotificationsToCache([
        buildLocalZoneConfirmationNotification({
          configId: cfgId,
          zoneId: toSave.zoneId,
          zoneName: zoneLabel,
          notificationName: toSave.notificationName,
          secteurLabel: toSave.secteurLabel,
        }),
      ]);
    }

    const sample = evaluateV1NotificationDecision({
      et0Mm: 5,
      soilHumidityPct: toSave.criticalThresholdPct - 1,
      kc: toSave.kc,
      thresholds: {
        humidityCriticalPct: toSave.criticalThresholdPct,
        et0KcAdvisoryMm: toSave.et0KcAdvisoryMm,
      },
    });
    sample.logs.forEach((l) => console.info('[zone-config-apply]', l));

    if (toSave.notifyEmail || toSave.notifySms || toSave.notifyWhatsapp) {
      await dispatchZoneNotificationOutbound({
        zoneId: toSave.zoneId,
        subject: `Agrilogy — configuration notification ${toSave.notificationName || zoneLabel}`,
        message:
          'La configuration des seuils de notification de zone a été enregistrée. Les canaux acceptés seront utilisés côté serveur lorsque disponibles.',
        channels: {
          email: toSave.notifyEmail,
          sms: toSave.notifySms,
          whatsapp: toSave.notifyWhatsapp,
        },
        decisionMeta: {
          rulesFired: sample.rulesFired,
          et0TimesKc: sample.et0TimesKc,
        },
      });
    }

    void message.success({
      content:
        intent === 'edit'
          ? 'Modifications enregistrées'
          : 'Configuration enregistrée',
    });
    onSaved?.();
    onClose();
  };

  if (!zones.length) {
    return (
      <div className="p-6">
        <p className="font-medium m-0">
          Aucune zone n&apos;est disponible pour ce compte.
        </p>
        <p className={`mt-2 ${styles.muted}`}>
          Créez ou assignez d&apos;abord une parcelle / zone côté Agrilogy, puis
          revenez configurer une notification.
        </p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="p-6">
        <p className="m-0">Chargement…</p>
      </div>
    );
  }

  return (
    <div>
      <KcProtocolTableModal
        isOpen={isKcTableOpen}
        onClose={() => setIsKcTableOpen(false)}
        initialProtocolName={form.kcProtocolName}
        initialStages={form.kcStages}
        onSave={({ protocolName, stages }) => {
          const kc = representativeKcFromStages(stages);
          setForm((f) =>
            f
              ? {
                  ...f,
                  kcProtocolName: protocolName,
                  kcStages: stages,
                  kc,
                }
              : f
          );
        }}
      />
      <Form layout="vertical" requiredMark={false} className="w-full">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
          <div className={styles.panel}>
            <PanelTitle icon={FaSeedling} title="Paramètres zone" />
            <p className={`${styles.muted} mb-3`}>
              {intent === 'edit'
                ? 'Enregistrer met à jour cette notification (secteur, seuils et canaux) pour la zone sélectionnée.'
                : 'Une même zone peut regrouper plusieurs secteurs : créez une notification par secteur pour des seuils et un suivi distincts. Un court message de confirmation est ajouté à la liste la première fois que vous enregistrez cette configuration.'}
            </p>

            <Form.Item
              label={<LabelWithIcon icon={FaMapMarkedAlt}>Zone</LabelWithIcon>}
            >
              <Select
                value={zoneId}
                onChange={(id) => {
                  setZoneId(id);
                  setForm((f) =>
                    f ? mergeZoneConfig(id, f) : mergeZoneConfig(id, undefined)
                  );
                }}
                options={zones.map((z) => ({ value: z.id, label: z.name }))}
              />
            </Form.Item>

            <Form.Item
              label={
                <LabelWithIcon icon={FaSitemap}>
                  Secteur (dans la zone)
                </LabelWithIcon>
              }
              help={
                <span className={styles.fineprint}>
                  Identifie la portion de la zone couverte par cette
                  notification.
                </span>
              }
            >
              <Input
                value={form.secteurLabel}
                onChange={(e) => update('secteurLabel', e.target.value)}
                placeholder="Ex. Secteur nord, Parcelle B, Bloc 2…"
              />
            </Form.Item>

            <Form.Item
              label={
                <LabelWithIcon icon={FaPen}>
                  Nom de la notification
                </LabelWithIcon>
              }
            >
              <Input
                value={form.notificationName}
                onChange={(e) => update('notificationName', e.target.value)}
                placeholder="Ex. Zone 1 pommes de terre"
              />
            </Form.Item>

            <Form.Item
              label={<LabelWithIcon icon={FaFilter}>Type de sol</LabelWithIcon>}
            >
              <Radio.Group
                value={form.soilType}
                onChange={(e) =>
                  update(
                    'soilType',
                    e.target.value as ZoneNotificationConfig['soilType']
                  )
                }
              >
                <Radio value="light">Léger</Radio>
                <Radio value="medium">Moyen</Radio>
                <Radio value="heavy">Lourd</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label={
                <LabelWithIcon icon={FaInfoCircle}>
                  Caractéristique du sol
                </LabelWithIcon>
              }
            >
              <Input
                value={form.soilCharacteristics}
                onChange={(e) => update('soilCharacteristics', e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label={
                <LabelWithIcon icon={FaTint}>
                  Humidité du sol (source)
                </LabelWithIcon>
              }
            >
              <Select
                value={form.soilMoistureSource}
                onChange={(v) => update('soilMoistureSource', v)}
                options={[
                  { value: 'avg_sensors', label: 'Capteur moyen (1+2+3)' },
                  { value: 'sensor_1', label: 'Capteur 1' },
                  { value: 'sensor_2', label: 'Capteur 2' },
                  { value: 'sensor_3', label: 'Capteur 3' },
                ]}
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label={
                  <LabelWithIcon icon={FaChartLine}>
                    Coefficient Kc
                  </LabelWithIcon>
                }
              >
                <Select
                  value={form.kcMode}
                  onChange={(v) => {
                    update('kcMode', v as ZoneNotificationConfig['kcMode']);
                    if (v === 'table') {
                      setForm((f) =>
                        f
                          ? {
                              ...f,
                              kc: representativeKcFromStages(f.kcStages),
                            }
                          : f
                      );
                      setIsKcTableOpen(true);
                    }
                  }}
                  options={[
                    { value: 'table', label: 'Table' },
                    { value: 'manual', label: 'Manuel' },
                  ]}
                />
                {form.kcMode === 'table' && (
                  <Button
                    size="small"
                    className="mt-2"
                    onClick={() => setIsKcTableOpen(true)}
                  >
                    Ouvrir la table Kc…
                  </Button>
                )}
              </Form.Item>
              <Form.Item
                label={<LabelWithIcon icon={FaBolt}>Valeur Kc</LabelWithIcon>}
                help={
                  form.kcMode === 'table' ? (
                    <span className={styles.fineprint}>
                      Moyenne pondérée (stades actifs) — éditable via la table.
                    </span>
                  ) : undefined
                }
              >
                <InputNumber
                  className="w-full"
                  value={
                    form.kcMode === 'table'
                      ? representativeKcFromStages(form.kcStages)
                      : form.kc
                  }
                  min={0}
                  max={2}
                  step={0.05}
                  readOnly={form.kcMode === 'table'}
                  onChange={(v) => {
                    if (form.kcMode === 'manual' && typeof v === 'number') {
                      update('kc', v);
                    }
                  }}
                />
              </Form.Item>
            </div>

            <div className="mt-2 grid grid-cols-1 md:grid-cols-[minmax(140px,auto)_1fr] gap-2 md:gap-6 items-start">
              <p className="text-sm font-semibold pt-1 m-0">Coefficient Kc</p>
              <div className="flex flex-col gap-2">
                <Checkbox
                  checked={form.kcSensorHumidityLow}
                  onChange={(e) =>
                    update('kcSensorHumidityLow', e.target.checked)
                  }
                >
                  Humidité basse (%)
                </Checkbox>
                <Checkbox
                  checked={form.kcSensorHumidityMid}
                  onChange={(e) =>
                    update('kcSensorHumidityMid', e.target.checked)
                  }
                >
                  Humidité moyenne (%)
                </Checkbox>
                <Checkbox
                  checked={form.kcSensorHumidityHigh}
                  onChange={(e) =>
                    update('kcSensorHumidityHigh', e.target.checked)
                  }
                >
                  Humidité haute (%)
                </Checkbox>
              </div>
            </div>

            <Form.Item
              label={<LabelWithIcon icon={FaSun}>Référence ETo</LabelWithIcon>}
              className="mt-4"
            >
              <Select
                value={form.et0Source}
                onChange={(v) =>
                  update('et0Source', v as ZoneNotificationConfig['et0Source'])
                }
                options={[
                  { value: 'weather_station', label: 'Calcul station météo' },
                  { value: 'calculated', label: 'Calcul locale' },
                ]}
              />
            </Form.Item>

            <Form.Item
              label={
                <LabelWithIcon icon={FaCloud}>Précipitations</LabelWithIcon>
              }
            >
              <Select
                value={form.precipSource}
                onChange={(v) => update('precipSource', v)}
                options={[
                  { value: 'sensor', label: 'Capteur de précipitation' },
                  { value: 'station', label: 'Station' },
                ]}
              />
            </Form.Item>

            <Form.Item
              label={
                <LabelWithIcon icon={FaPercent}>
                  Facteur KR ({form.krFactor.toFixed(2)})
                </LabelWithIcon>
              }
            >
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={form.krFactor}
                onChange={(v) => update('krFactor', v as number)}
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label={
                  <LabelWithIcon icon={FaVectorSquare}>
                    Surface (ha)
                  </LabelWithIcon>
                }
              >
                <InputNumber
                  className="w-full"
                  value={form.zoneAreaHa}
                  min={0}
                  step={0.1}
                  onChange={(v) =>
                    update('zoneAreaHa', typeof v === 'number' ? v : 0)
                  }
                />
              </Form.Item>
              <Form.Item
                label={<LabelWithIcon icon={FaLeaf}>Culture</LabelWithIcon>}
              >
                <Input
                  value={form.cropType}
                  onChange={(e) => update('cropType', e.target.value)}
                />
              </Form.Item>
            </div>

            <Form.Item
              label={<LabelWithIcon icon={FaWater}>Débit (m³/h)</LabelWithIcon>}
            >
              <InputNumber
                className="w-full"
                value={form.flowRateM3h}
                min={0}
                onChange={(v) =>
                  update('flowRateM3h', typeof v === 'number' ? v : 0)
                }
              />
            </Form.Item>
          </div>

          <div className={styles.panel}>
            <PanelTitle
              icon={FaShower}
              title="Irrigation & seuils moteur v1"
              accentClassName="text-info"
            />

            <Form.Item
              label={
                <LabelWithIcon icon={FaWater}>
                  Méthode d&apos;irrigation
                </LabelWithIcon>
              }
            >
              <Radio.Group
                value={form.irrigationMethod}
                onChange={(e) =>
                  update(
                    'irrigationMethod',
                    e.target.value as ZoneNotificationConfig['irrigationMethod']
                  )
                }
              >
                <div className="flex flex-col gap-1">
                  <Radio value="drip_sprinkler">Goutte / aspersion</Radio>
                  <Radio value="subsurface_drip">Goutte souterraine</Radio>
                </div>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label={
                <LabelWithIcon icon={FaClock}>
                  Fréquence & notification
                </LabelWithIcon>
              }
            >
              <InputNumber
                className="w-full"
                addonAfter="minutes"
                min={5}
                max={1440}
                step={5}
                value={form.intervalMinutes}
                onChange={(v) => {
                  if (typeof v !== 'number' || !Number.isFinite(v)) return;
                  update(
                    'intervalMinutes',
                    Math.min(1440, Math.max(5, Math.round(v)))
                  );
                }}
              />
            </Form.Item>

            <Form.Item
              label={
                <LabelWithIcon icon={FaSlidersH}>
                  Perméabilité ({form.soilPermeabilityPct} %)
                </LabelWithIcon>
              }
            >
              <Slider
                min={0}
                max={100}
                step={1}
                value={form.soilPermeabilityPct}
                onChange={(v) => update('soilPermeabilityPct', v as number)}
              />
            </Form.Item>

            <Form.Item
              label={<LabelWithIcon icon={FaRandom}>Vanne</LabelWithIcon>}
            >
              <Radio.Group
                value={form.valveMode}
                onChange={(e) =>
                  update(
                    'valveMode',
                    e.target.value as ZoneNotificationConfig['valveMode']
                  )
                }
              >
                <Radio value="auto">Automatique</Radio>
                <Radio value="manual">Manuelle</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label={
                <LabelWithIcon icon={FaFan}>Seuil DPV (kPa)</LabelWithIcon>
              }
            >
              <InputNumber
                className="w-full"
                value={form.vpdThresholdKpa}
                min={0}
                max={5}
                step={0.1}
                onChange={(v) =>
                  update('vpdThresholdKpa', typeof v === 'number' ? v : 0)
                }
              />
            </Form.Item>

            <Form.Item
              label={
                <LabelWithIcon icon={FaTree}>Surveillance racine</LabelWithIcon>
              }
            >
              <Select
                value={form.rootMonitoring}
                onChange={(v) =>
                  update(
                    'rootMonitoring',
                    v as ZoneNotificationConfig['rootMonitoring']
                  )
                }
                options={[
                  { value: 'on', label: 'Activée' },
                  { value: 'off', label: 'Désactivée' },
                ]}
              />
            </Form.Item>

            <Divider />

            <div className={`${styles.thresholdsHeading} mb-3`}>
              <FaTachometerAlt className="text-warning" aria-hidden />
              <span>Seuils moteur v1 (ET0 × Kc, humidité)</span>
            </div>

            <Form.Item
              label={
                <LabelWithIcon icon={FaTint}>
                  Seuil critique humidité sol (%)
                </LabelWithIcon>
              }
              help={
                <span className={styles.sliderValue}>
                  {form.criticalThresholdPct} % — en dessous = décision critique
                </span>
              }
            >
              <Slider
                min={5}
                max={60}
                step={1}
                value={form.criticalThresholdPct}
                onChange={(v) => update('criticalThresholdPct', v as number)}
              />
            </Form.Item>

            <Form.Item
              label={
                <LabelWithIcon icon={FaBolt}>
                  Seuil conseil ET0×Kc (mm)
                </LabelWithIcon>
              }
              help={
                <span className={styles.sliderValue}>
                  Au-dessus = décision advisory (demande en eau élevée)
                </span>
              }
            >
              <InputNumber
                className="w-full"
                value={form.et0KcAdvisoryMm}
                min={0}
                max={20}
                step={0.5}
                onChange={(v) =>
                  update('et0KcAdvisoryMm', typeof v === 'number' ? v : 0)
                }
              />
            </Form.Item>

            <Form.Item
              label={
                <LabelWithIcon icon={FaCubes}>
                  Volume d&apos;eau max (m³)
                </LabelWithIcon>
              }
            >
              <InputNumber
                className="w-full"
                value={form.maxWaterM3}
                min={0}
                onChange={(v) =>
                  update('maxWaterM3', typeof v === 'number' ? v : 0)
                }
              />
            </Form.Item>

            <Divider />

            <div className={`${styles.thresholdsHeading} mb-1`}>
              <FaBell className="text-info" aria-hidden />
              <span>Canaux de notification</span>
            </div>
            <p className={`${styles.muted} mb-3`}>
              Cochez les canaux que vous acceptez pour recevoir des alertes.
            </p>

            <div className="flex flex-col gap-3 pl-1">
              <Checkbox
                checked={form.notifyEmail}
                onChange={(e) => update('notifyEmail', e.target.checked)}
              >
                <span className={styles.channelsRow}>
                  <FaEnvelopeOpenText className="text-info" />
                  <span>E-mail</span>
                </span>
              </Checkbox>
              <Checkbox
                checked={form.notifySms}
                onChange={(e) => update('notifySms', e.target.checked)}
              >
                <span className={styles.channelsRow}>
                  <FaMobileAlt className="text-success" />
                  <span>SMS</span>
                </span>
              </Checkbox>
              <Checkbox
                checked={form.notifyWhatsapp}
                onChange={(e) => update('notifyWhatsapp', e.target.checked)}
              >
                <span className={styles.channelsRow}>
                  <FaWhatsapp className="text-success" />
                  <span>WhatsApp</span>
                </span>
              </Checkbox>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            type="primary"
            size="large"
            icon={<FaBell />}
            onClick={() => void apply()}
          >
            Enregistrer la notification de zone
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ZoneNotificationConfigureForm;
