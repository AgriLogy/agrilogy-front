'use client';

import { Box, type BoxProps } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import {
  LAST_DATA_VARIANT_STYLES,
  type LastDataPanelVariant,
} from './lastDataPanelVariants';

export type { LastDataPanelVariant };

export type LastDataPanelProps = BoxProps & {
  /** Tinted background unique to each feature; improves separation from the chart. */
  variant?: LastDataPanelVariant;
};

/** Shared shell for “latest reading” side panels next to charts. */
export default function LastDataPanel({
  children,
  variant,
  ...props
}: LastDataPanelProps) {
  const borderBase = useColorModeValue('blackAlpha.08', 'whiteAlpha.14');
  const fallbackBg = useColorModeValue('white', 'whiteAlpha.40');

  const styles = variant ? LAST_DATA_VARIANT_STYLES[variant] : null;
  const bg = useColorModeValue(
    styles?.bgLight ?? fallbackBg,
    styles?.bgDark ?? fallbackBg
  );
  const borderAccent = useColorModeValue(
    styles?.borderLightTok,
    styles?.borderDarkTok
  );

  return (
    <Box
      borderWidth="1px"
      borderColor={borderBase}
      borderLeftWidth={variant ? '4px' : '1px'}
      borderLeftColor={variant && borderAccent ? borderAccent : undefined}
      bg={bg}
      borderRadius="2xl"
      p={{ base: 4, md: 5 }}
      minH="280px"
      minW={0}
      w="100%"
      maxW="100%"
      flex={1}
      boxShadow="sm"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="stretch"
      {...props}
    >
      {children}
    </Box>
  );
}
