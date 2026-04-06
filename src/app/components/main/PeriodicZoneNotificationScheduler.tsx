'use client';

import { useEffect, useRef } from 'react';
import {
  getAllZoneNotificationConfigs,
  getNotificationConfigById,
  ZONE_NOTIFICATION_CONFIG_UPDATED_EVENT,
} from '@/app/lib/zoneNotificationConfigStorage';
import { prependNotificationsToCache } from '@/app/lib/notificationsCacheStorage';
import { buildPeriodicZoneReminderNotification } from '@/app/lib/zoneNotificationTemplate';

const MIN_MINUTES = 1;
const MAX_MINUTES = 24 * 60;

function clampIntervalMinutes(minutes: number): number {
  if (!Number.isFinite(minutes)) return 60;
  return Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, Math.round(minutes)));
}

/** Pushes an unread local notification on each zone’s configured interval (Fréquence & notification). */
export default function PeriodicZoneNotificationScheduler() {
  const timersRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const clearTimers = () => {
      for (const t of timersRef.current.values()) {
        clearInterval(t);
      }
      timersRef.current.clear();
    };

    const scheduleAll = () => {
      clearTimers();
      const configs = getAllZoneNotificationConfigs();
      for (const cfg of configs) {
        const ms = clampIntervalMinutes(cfg.intervalMinutes) * 60 * 1000;
        const configKey = cfg.configId;
        const tick = () => {
          const latest = getNotificationConfigById(configKey);
          if (!latest) return;
          prependNotificationsToCache([
            buildPeriodicZoneReminderNotification(latest),
          ]);
        };
        const id = window.setInterval(tick, ms);
        timersRef.current.set(configKey, id);
      }
    };

    scheduleAll();
    window.addEventListener(
      ZONE_NOTIFICATION_CONFIG_UPDATED_EVENT,
      scheduleAll
    );
    return () => {
      window.removeEventListener(
        ZONE_NOTIFICATION_CONFIG_UPDATED_EVENT,
        scheduleAll
      );
      clearTimers();
    };
  }, []);

  return null;
}
