'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button, Divider, Tag } from 'antd';
import {
  evaluateV1NotificationDecision,
  logDecisionToConsole,
  parseNumericSensor,
  type DecisionEngineResult,
  type NotificationDecisionLevel,
} from '@/app/lib/notificationDecisionEngine';
import {
  findNotificationConfigForZoneRow,
  getNotificationConfigById,
  thresholdsFromConfig,
  ZONE_NOTIFICATION_CONFIG_UPDATED_EVENT,
} from '@/app/lib/zoneNotificationConfigStorage';
import styles from './Notification.module.scss';

export interface NotificationPayload {
  yesterday_temperature: string;
  today_temperature: string;
  yesterday_humidity: string;
  today_humidity: string;
  ET0: string;
  soil_humidity: string;
  soil_temperature: string;
  soil_ph: string;
  perfect_irrigation_period: string;
  last_irrigation_date: string;
  last_start_irrigation_hour: string;
  last_finish_irrigation_hour: string;
  used_water_irrigation: string;
  notification_date: string;
  zone_id?: number;
  zone_name?: string;
  notification_config_id?: string;
  notification_name?: string;
  template_summary?: string;
}

interface NotificationProps {
  id: number;
  notification: NotificationPayload;
  is_read: boolean;
  read_at: string | null;
  onEditZone?: () => void;
  onDeleteZone?: () => void;
}

const decisionTagColor = (d: NotificationDecisionLevel) => {
  if (d === 'critical') return 'red';
  if (d === 'advisory') return 'orange';
  return 'green';
};

const decisionLabelFr = (d: NotificationDecisionLevel) => {
  if (d === 'critical') return 'Critique — action irrigation';
  if (d === 'advisory') return 'Conseil — forte demande ETo×Kc';
  return 'OK — dans les seuils';
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <p className="mt-3 mb-1 text-base font-bold">{children}</p>;

const Notification: React.FC<NotificationProps> = ({
  id,
  notification,
  is_read: _isRead,
  onEditZone,
  onDeleteZone,
}) => {
  const notificationDate = new Date(notification.notification_date);
  const formattedDate = notificationDate.toLocaleString('fr-FR');
  const [engineResult, setEngineResult] = useState<DecisionEngineResult | null>(
    null
  );

  const zoneId = notification.zone_id;
  const [configRev, setConfigRev] = useState(0);

  useEffect(() => {
    const bump = () => setConfigRev((n) => n + 1);
    window.addEventListener(ZONE_NOTIFICATION_CONFIG_UPDATED_EVENT, bump);
    return () =>
      window.removeEventListener(ZONE_NOTIFICATION_CONFIG_UPDATED_EVENT, bump);
  }, []);

  const config = useMemo(() => {
    const cid = notification.notification_config_id?.trim();
    if (cid) return getNotificationConfigById(cid);
    if (zoneId == null) return undefined;
    return findNotificationConfigForZoneRow(
      zoneId,
      notification.notification_name
    );
  }, [
    zoneId,
    notification.notification_config_id,
    notification.notification_name,
    configRev,
  ]);

  const configName = config?.notificationName?.trim() ?? '';
  const secteur = config?.secteurLabel?.trim() ?? '';
  const zoneNotifName =
    configName.length > 0
      ? secteur
        ? `${configName} — ${secteur}`
        : configName
      : zoneId != null
        ? '— (nom non renseigné — modifiez la configuration)'
        : '—';
  const notificationTitle =
    configName.length > 0
      ? configName
      : notification.zone_name?.trim() ||
        (zoneId != null ? `Zone #${zoneId}` : 'Notification');

  const showLocationSub =
    Boolean(notification.zone_name?.trim()) &&
    notificationTitle !== notification.zone_name?.trim();

  useEffect(() => {
    if (notification.template_summary) {
      setEngineResult(null);
      return;
    }
    const kc = config?.kc ?? 1;
    const thresholds = thresholdsFromConfig(config);
    const result = evaluateV1NotificationDecision({
      et0Mm: parseNumericSensor(notification.ET0),
      soilHumidityPct: parseNumericSensor(notification.soil_humidity),
      kc,
      thresholds,
    });
    logDecisionToConsole(result, `notification id=${id}`);
    setEngineResult(result);
  }, [
    id,
    notification.ET0,
    notification.soil_humidity,
    zoneId,
    config?.kc,
    config?.criticalThresholdPct,
    config?.et0KcAdvisoryMm,
    notification.template_summary,
  ]);

  return (
    <div className={`${styles.card} p-4`}>
      {zoneId != null ? (
        <p className="mb-2 text-sm leading-snug">
          <span className={styles.fieldLabel}>Nom de la notification : </span>
          <span className="text-base font-bold">{zoneNotifName}</span>
        </p>
      ) : (
        <p className="text-base font-bold">{notificationTitle}</p>
      )}
      {showLocationSub && (
        <p className="mt-1 text-sm opacity-90">📍 {notification.zone_name}</p>
      )}
      <p className={`mt-2 text-sm ${styles.metaText}`}>📅 {formattedDate}</p>

      {notification.template_summary && (
        <div className={styles.confirmationPanel}>
          <Tag color="purple" className="mb-2">
            Confirmation zone
          </Tag>
          <p className="text-sm m-0">{notification.template_summary}</p>
        </div>
      )}

      {engineResult && (
        <div className="mt-3">
          <Tag color={decisionTagColor(engineResult.decision)}>
            Moteur v1 — {engineResult.decision.toUpperCase()}
          </Tag>
          <p className="mt-2 text-sm">
            {decisionLabelFr(engineResult.decision)} — ETo×Kc ={' '}
            {Number.isFinite(engineResult.et0TimesKc)
              ? engineResult.et0TimesKc.toFixed(3)
              : '—'}{' '}
            mm (Kc utilisé : {config?.kc ?? 1})
          </p>
          <p className={`mt-1 text-xs ${styles.metaText}`}>
            Règles : {engineResult.rulesFired.join(', ')}
          </p>
        </div>
      )}

      <div className="mt-4">
        <SectionTitle>🌡️ Température</SectionTitle>
        <p className="m-0 text-sm">
          • Hier : {notification.yesterday_temperature}°C
        </p>
        <p className="m-0 text-sm">
          • Aujourd’hui : {notification.today_temperature}°C
        </p>
      </div>

      <div className="mt-3">
        <SectionTitle>💧 Humidité</SectionTitle>
        <p className="m-0 text-sm">
          • Hier : {notification.yesterday_humidity}%
        </p>
        <p className="m-0 text-sm">
          • Aujourd’hui : {notification.today_humidity}%
        </p>
      </div>

      <div className="mt-3">
        <SectionTitle>🔎 ET0</SectionTitle>
        <p className="m-0 text-sm">{notification.ET0} mm</p>
      </div>

      <div className="mt-3">
        <SectionTitle>🌱 Sol</SectionTitle>
        <p className="m-0 text-sm">
          • Humidité : {notification.soil_humidity}%
        </p>
        <p className="m-0 text-sm">
          • Température : {notification.soil_temperature}°C
        </p>
        <p className="m-0 text-sm">• pH : {notification.soil_ph}</p>
      </div>

      <div className="mt-3">
        <SectionTitle>🚰 Irrigation</SectionTitle>
        <p className="m-0 text-sm">
          • Période idéale : {notification.perfect_irrigation_period}
        </p>
        <p className="m-0 text-sm">
          • Dernière date : {notification.last_irrigation_date}
        </p>
        <p className="m-0 text-sm">
          • Eau utilisée : {notification.used_water_irrigation} litres
        </p>
      </div>

      {zoneId != null && (onEditZone || onDeleteZone) && (
        <>
          <Divider className="my-4" />
          <div className="flex flex-wrap gap-3">
            {onEditZone && (
              <Button type="primary" size="small" onClick={onEditZone}>
                Modifier la notification
              </Button>
            )}
            {onDeleteZone && (
              <Button danger size="small" onClick={onDeleteZone}>
                Supprimer la notification
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Notification;
