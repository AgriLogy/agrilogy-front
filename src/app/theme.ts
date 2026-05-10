'use client';

import { extendTheme, type StyleFunctionProps } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { chakraColorModeConfig } from './colorModeConfig';
import { primary } from './styles/tokens/colors';

/**
 * Chakra reads `colorScheme="<name>"` and looks up `<name>.50…900`
 * from `theme.colors`. `brand` is the canonical scheme — every button
 * across the app uses `colorScheme="brand"`. We also alias `blue` /
 * `teal` to the same palette so any third-party / legacy callers that
 * still type those names render brand-green automatically.
 */
const brandPalette = {
  50: primary[50],
  100: primary[100],
  200: primary[200],
  300: primary[300],
  400: primary[400],
  500: primary[500],
  600: primary[600],
  700: primary[700],
  800: primary[800],
  900: primary[900],
};

/* Form controls (Input, Select, Textarea, NumberInput, …) ignore the
 * `colorScheme` prop; they use a separate `focusBorderColor` that
 * defaults to `blue.500`. Even though we aliased `blue` to the brand
 * palette, some Chakra control themes resolve focusBorderColor at
 * theme-creation time, so we set it explicitly per component. */
const formFocus = {
  baseStyle: {},
  defaultProps: {
    focusBorderColor: 'brand.500',
  },
};

export const theme = extendTheme({
  config: chakraColorModeConfig,
  colors: {
    brand: brandPalette,
    primary: brandPalette,
    /* Every "cool" Chakra colorScheme is aliased to the brand palette
     * so any legacy `colorScheme="blue"`, `="cyan"`, `="teal"`,
     * `="indigo"`, `="sky"` resolves to forest green. */
    blue: brandPalette,
    teal: brandPalette,
    cyan: brandPalette,
    indigo: brandPalette,
    sky: brandPalette,
  },
  components: {
    Input: formFocus,
    Select: formFocus,
    Textarea: formFocus,
    NumberInput: formFocus,
    PinInput: formFocus,
    Editable: formFocus,
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      html: {
        overflowX: 'hidden',
        maxWidth: '100%',
      },
      body: {
        bg: mode('gray.50', 'gray.900')(props),
        color: mode('gray.800', 'gray.100')(props),
        overflowX: 'hidden',
        maxWidth: '100%',
      },
    }),
  },
});
