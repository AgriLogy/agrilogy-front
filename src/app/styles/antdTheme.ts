import type { ThemeConfig } from 'antd';
import { colors, fontFamily, fontSize, radii, shadows } from './tokens';

const remToPx = (rem: string): number => parseFloat(rem) * 16;

/**
 * Maps our design tokens to Ant Design's theme tokens.
 * See: https://ant.design/docs/react/customize-theme
 *
 * AntD uses a single primary color and derives shades algorithmically;
 * we feed it the 600 step (the brand value).
 */
export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary[600],
    colorSuccess: colors.semantic.success,
    colorWarning: colors.semantic.warning,
    colorError: colors.semantic.danger,
    colorInfo: colors.semantic.info,
    /* Anchor / hyperlink tokens default to a separate antd blue
     * (#1677ff). Pin them to the brand so anchors, breadcrumb links,
     * Tag info text, "voir plus" links, etc. all render green. */
    colorLink: colors.primary[600],
    colorLinkHover: colors.primary[500],
    colorLinkActive: colors.primary[700],

    // Note: colorTextBase / colorBgBase are intentionally NOT set here.
    // AntD's algorithm derives them per mode (dark vs light) — overriding
    // them with static hex values defeats the dark theme.

    fontFamily: fontFamily.sans,
    fontSize: remToPx(fontSize.base),

    borderRadius: remToPx(radii.md),
    borderRadiusLG: remToPx(radii.lg),
    borderRadiusSM: remToPx(radii.sm),

    boxShadow: shadows.card,
    boxShadowSecondary: shadows.floating,
  },
  components: {
    Button: {
      controlHeight: 40,
      controlHeightLG: 48,
      fontWeight: 500,
    },
    Input: {
      controlHeight: 40,
      controlHeightLG: 48,
    },
  },
};
