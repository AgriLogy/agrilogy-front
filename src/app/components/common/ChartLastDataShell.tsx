'use client';

import {
  Box,
  IconButton,
  Stack,
  type StackProps,
  Tooltip,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export type ChartLastDataShellProps = {
  chart: ReactNode;
  lastData: ReactNode;
} & Omit<StackProps, 'children'>;

/**
 * Chart + latest-readings column with a toggle to hide the chart.
 *
 * Layout contract (md+):
 *   - Outer Box has a hard maxHeight (caller passes it via `maxH`).
 *   - Both columns stretch to the *same* height (align="stretch") — the
 *     chart sits on the left at fixed/intrinsic height, the right card
 *     fills the remaining height.
 *   - The chart slot is `overflow: visible` (a chart that grows past the
 *     cap is intentional and never scrolls).
 *   - The right "last data" slot has `overflowY: auto` + `minH: 0` so
 *     it gets a scrollbar instead of forcing the whole card taller when
 *     the metric list runs long.
 *
 * The caller-provided `align` is honoured in column mode (mobile) and
 * forced to `stretch` in row mode so the equal-height constraint holds.
 */
export default function ChartLastDataShell({
  chart,
  lastData,
  direction = { base: 'column', md: 'row' },
  spacing = 4,
  align: _align = 'stretch',
  width = '100%',
  /** Use `auto` so content (plot + date dragger) sets height; pass `100%` only inside a sized parent. */
  height = 'auto',
  maxH,
  minH,
  ...stackProps
}: ChartLastDataShellProps) {
  const [chartVisible, setChartVisible] = useState(true);

  return (
    <Box
      position="relative"
      width={width}
      maxWidth="100%"
      minWidth={0}
      height={height}
      maxH={maxH}
      minH={minH}
      overflow="hidden" /* clip the right column's scrollbar at the card edge */
    >
      <Tooltip
        label={
          chartVisible
            ? 'Masquer le graphique (données récentes seulement)'
            : 'Afficher le graphique'
        }
        hasArrow
        placement="left"
      >
        <IconButton
          aria-label={
            chartVisible ? 'Masquer le graphique' : 'Afficher le graphique'
          }
          icon={chartVisible ? <FaEyeSlash /> : <FaEye />}
          size="sm"
          variant="ghost"
          colorScheme="brand"
          position="absolute"
          top={0}
          right={0}
          zIndex={4}
          onClick={() => setChartVisible((v) => !v)}
        />
      </Tooltip>

      <Stack
        direction={direction}
        spacing={spacing}
        width="100%"
        maxWidth="100%"
        minWidth={0}
        /* Stretch in row mode so both columns are equal height. We
         *  always pass 'stretch' on md+ — `align` from callers (e.g.
         *  "start") only takes effect on mobile via the column layout. */
        align="stretch"
        height="100%"
        pt={1}
        pr={{ base: 10, md: 10 }}
        {...stackProps}
      >
        {chartVisible && (
          <Box
            /* Chart eats every horizontal pixel the right card doesn't
             *  reserve. Combined with the right card's fixed-width
             *  basis, the chart now occupies most of the row. */
            flex={{ base: '1 1 auto', md: '1 1 0' }}
            width="100%"
            minW={0}
            /* Chart is never scrollable — let it set its own height. */
            overflow="visible"
            display="flex"
            flexDirection="column"
          >
            {chart}
          </Box>
        )}
        <Box
          /* Right card width is fixed (md+) at the panel's natural max
           *  so the chart can claim everything else. Mobile stays full
           *  width via the 'auto' basis. */
          flex={{ base: '1 1 auto', md: '0 0 320px' }}
          width={{ base: '100%', md: '320px' }}
          minW={0}
          /* Right card matches the card's height; the panel inside is
           *  centered both axes — when its content is shorter than the
           *  chart, it sits in the visual middle instead of pinning at
           *  the top. When content overflows, the column scrolls. */
          minH={0}
          overflowY="auto"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          px={{ base: 0, md: 2 }}
        >
          {lastData}
        </Box>
      </Stack>
    </Box>
  );
}
