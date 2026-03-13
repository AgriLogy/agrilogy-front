import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { formatNumber } from '@/app/utils/formatNumber';
import type { VPDDataPoint } from './VPDChart';

const timeAgo = (timestamp: string): string => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `${diffMin} min`;
  if (diffH < 24) return `${diffH} h`;
  return then.toLocaleDateString();
};

const VPDLastData = ({ data }: { data: VPDDataPoint[] }) => {
  const latest = data[data.length - 1];
  const bgColor = useColorModeValue('purple.50', 'purple.900');
  const valueColor = useColorModeValue('purple.700', 'purple.200');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const timeColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="md"
      boxShadow="md"
      minH="300px"
      minW="250px"
      height="100%"
      width="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      <Text fontWeight="bold" fontSize="lg" mt={2} color={textColor}>
        Dernier VPD
      </Text>
      <Text fontSize="2xl" color={valueColor}>
        {latest ? `${formatNumber(latest.vpd)} kPa` : 'N/A'}
      </Text>
      <Text fontSize="sm" color={timeColor}>
        {latest ? `Mise à jour : ${timeAgo(latest.timestamp)}` : ''}
      </Text>
    </Box>
  );
};

export default VPDLastData;
