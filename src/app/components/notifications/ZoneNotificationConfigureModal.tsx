'use client';

/**
 * Reusable full-screen Modal that hosts ZoneNotificationConfigureForm.
 *
 * Used by:
 *   - The /notifications page (Ajouter une notification de zone)
 *   - The dashboard zone bell — opens inline instead of redirecting
 *     to /notifications, so the user keeps their place on the page.
 *
 * The modal occupies the full viewport with a scrollable body, matching
 * antd's "fullscreen" pattern: width=100vw, top=0, body height capped
 * to viewport minus the header so long forms scroll inside the dialog.
 */

import React from 'react';
import { Modal } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import ZoneNotificationConfigureForm from './ZoneNotificationConfigureForm';
import styles from './ZoneNotificationConfigureForm.module.scss';

export interface ZoneNotificationConfigureModalProps {
  open: boolean;
  onClose: () => void;
  /** 'create' opens an empty form; 'edit' loads an existing config. */
  intent?: 'create' | 'edit';
  /** Pre-select a zone (used when invoked from a dashboard bell). */
  initialZoneId?: number | null;
  /** Pre-load a specific config (edit mode only). */
  initialConfigId?: string | null;
  /** Called after the form successfully saves so the parent can refresh. */
  onSaved?: () => void;
}

const ZoneNotificationConfigureModal: React.FC<
  ZoneNotificationConfigureModalProps
> = ({
  open,
  onClose,
  intent = 'create',
  initialZoneId = null,
  initialConfigId = null,
  onSaved,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width="100vw"
      style={{
        top: 0,
        margin: 0,
        padding: 0,
        maxWidth: '100vw',
        paddingBottom: 0,
      }}
      rootClassName="agri-fullscreen-modal"
      styles={{
        // Fullscreen body that scrolls. 64px ≈ antd modal header height.
        body: {
          maxHeight: 'calc(100vh - 64px)',
          overflowY: 'auto',
          paddingTop: 8,
        },
      }}
      title={
        <span className={styles.modalTitle}>
          <BellOutlined className={styles.modalTitleIcon} />
          {intent === 'edit'
            ? 'Modifier la notification de zone'
            : 'Nouvelle notification de zone'}
        </span>
      }
    >
      {open && (
        <ZoneNotificationConfigureForm
          key={`${intent}-${initialZoneId ?? 'z'}-${initialConfigId ?? 'new'}`}
          intent={intent}
          initialZoneId={initialZoneId}
          initialConfigId={initialConfigId}
          onClose={onClose}
          onSaved={() => {
            onSaved?.();
          }}
        />
      )}
    </Modal>
  );
};

export default ZoneNotificationConfigureModal;
