'use client';

import { Select, useToken } from '@chakra-ui/react';

export type ZoneOption = { id: number; name: string };

export type ZoneSelectProps = {
  zones: ZoneOption[];
  value: number | null;
  onChange: (zoneId: number) => void;
  /** ARIA label - the selector is iconless so it needs a name. */
  label?: string;
};

/**
 * Token-driven zone picker. Replaces the raw `<select>` blocks the
 * analytics pages used to inline (each with their own colour math).
 */
export function ZoneSelect({
  zones,
  value,
  onChange,
  label = 'Sélectionner une zone',
}: ZoneSelectProps) {
  const [border] = useToken('colors', ['app.border']);

  return (
    <Select
      aria-label={label}
      value={value ?? ''}
      onChange={(e) => onChange(Number(e.target.value))}
      width="auto"
      minW="180px"
      size="md"
      bg="app.surface"
      color="app.text"
      borderColor={border}
      _hover={{ borderColor: 'app.accent' }}
      _focus={{ borderColor: 'app.accent', boxShadow: 'none' }}
    >
      {zones.map((zone) => (
        <option key={zone.id} value={zone.id}>
          {zone.name}
        </option>
      ))}
    </Select>
  );
}
