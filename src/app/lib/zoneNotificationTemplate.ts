import type { ZoneNotificationConfig } from '@/app/lib/zoneNotificationConfigStorage';

/**
 * Confirmation copy pushed to the notification cache when a zone notification is saved.
 * Replace the string below when the final template is ready.
 */
export const ZONE_NOTIFICATION_CONFIRMATION_TEMPLATE =
  'Votre notification de zone a été enregistrée. Les alertes utiliseront les seuils et canaux définis. (Modèle provisoire — à remplacer.)';

export type LocalNotificationSource = 'local_zone_template' | 'local_periodic';

export type LocalZoneConfirmationRow = {
  id: number;
  is_read: boolean;
  zone_id: number;
  zone_name: string;
  /** Binds this row to a stored zone notification configuration (secteur). */
  notification_config_id: string;
  _source: LocalNotificationSource;
  notification: {
    notification_date: string;
    template_summary: string;
    yesterday_temperature: string;
    today_temperature: string;
    yesterday_humidity?: string;
    today_humidity?: string;
    soil_humidity: string;
    soil_temperature?: string;
    soil_ph?: string;
    ET0: string;
    perfect_irrigation_period?: string;
    last_irrigation_date?: string;
    last_start_irrigation_hour?: string;
    last_finish_irrigation_hour?: string;
    used_water_irrigation?: string;
    zone_name: string;
  };
};

export function buildLocalZoneConfirmationNotification(params: {
  configId: string;
  zoneId: number;
  zoneName: string;
  notificationName: string;
  secteurLabel?: string;
}): LocalZoneConfirmationRow {
  const id = -(Date.now() * 1000 + Math.floor(Math.random() * 1000));
  const secteur = params.secteurLabel?.trim();
  const label = params.notificationName?.trim() || params.zoneName;
  const title = secteur ? `${label} — ${secteur}` : label;
  return {
    id,
    is_read: false,
    zone_id: params.zoneId,
    zone_name: params.zoneName,
    notification_config_id: params.configId,
    _source: 'local_zone_template',
    notification: {
      notification_date: new Date().toISOString(),
      template_summary: `${ZONE_NOTIFICATION_CONFIRMATION_TEMPLATE} — ${title}`,
      yesterday_temperature: '—',
      today_temperature: '—',
      yesterday_humidity: '—',
      today_humidity: '—',
      soil_humidity: '—',
      soil_temperature: '—',
      soil_ph: '—',
      ET0: '—',
      perfect_irrigation_period: '—',
      last_irrigation_date: '—',
      last_start_irrigation_hour: '—',
      last_finish_irrigation_hour: '—',
      used_water_irrigation: '—',
      zone_name: params.zoneName,
    },
  };
}

/** Recurring reminder pushed on the interval configured as Fréquence & notification (minutes). */
export function buildPeriodicZoneReminderNotification(
  config: ZoneNotificationConfig
): LocalZoneConfirmationRow {
  const id = -(Date.now() * 1000 + Math.floor(Math.random() * 1000));
  const label = config.notificationName?.trim() || `Zone ${config.zoneId}`;
  return {
    id,
    is_read: false,
    zone_id: config.zoneId,
    zone_name: label,
    notification_config_id: config.configId,
    _source: 'local_periodic',
    notification: {
      notification_date: new Date().toISOString(),
      template_summary: `Rappel planifié (toutes les ${config.intervalMinutes} min) — ${label}. Vérifiez humidité, ETo×Kc et seuils.`,
      yesterday_temperature: '—',
      today_temperature: '—',
      yesterday_humidity: '—',
      today_humidity: '—',
      soil_humidity: '—',
      soil_temperature: '—',
      soil_ph: '—',
      ET0: '—',
      perfect_irrigation_period: '—',
      last_irrigation_date: '—',
      last_start_irrigation_hour: '—',
      last_finish_irrigation_hour: '—',
      used_water_irrigation: '—',
      zone_name: label,
    },
  };
}
