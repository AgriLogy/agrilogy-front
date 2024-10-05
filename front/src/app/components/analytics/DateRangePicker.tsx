import React, { useState } from "react";
import { Box, Button, HStack, Input, Text, useBreakpointValue, useColorMode } from "@chakra-ui/react";
import { subDays, subWeeks, subMonths, subYears, format } from "date-fns";

interface DateRangePickerProps {
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ setStartDate, setEndDate }) => {
  const { colorMode } = useColorMode();
  const today = new Date();
  const formattedToday = format(today, "yyyy-MM-dd");

  // State for manual date selection
  const [manualStartDate, setManualStartDate] = useState<string>("");
  const [manualEndDate, setManualEndDate] = useState<string>("");

  const handleDateRangeClick = (days: number) => {
    const startDate = format(subDays(today, days), "yyyy-MM-dd");
    setStartDate(startDate);
    setEndDate(formattedToday);
  };

  const handleWeeksClick = (weeks: number) => {
    const startDate = format(subWeeks(today, weeks), "yyyy-MM-dd");
    setStartDate(startDate);
    setEndDate(formattedToday);
  };

  const handleMonthsClick = (months: number) => {
    const startDate = format(subMonths(today, months), "yyyy-MM-dd");
    setStartDate(startDate);
    setEndDate(formattedToday);
  };

  const handleYearsClick = (years: number) => {
    const startDate = format(subYears(today, years), "yyyy-MM-dd");
    setStartDate(startDate);
    setEndDate(formattedToday);
  };

  const handleManualDateSelection = () => {
    if (manualStartDate && manualEndDate) {
      setStartDate(manualStartDate);
      setEndDate(manualEndDate);
    }
  };

  // Check screen size and hide manual date picker on smaller screens
  const showManualDatePicker = useBreakpointValue({ base: false, lg: true });

  return (
    <HStack
    mr={2}
      display="flex"
      flexWrap="wrap"
      justifyContent="space-between"
      width="100%"
      height="100%" // Ensure it takes full height of the parent
    >
      {/* Date range buttons - aligned top left */}
      <HStack alignItems="flex-start" gap="2" display="flex" flexWrap="wrap">
        <Button onClick={() => handleDateRangeClick(1)}>1d</Button>
        <Button onClick={() => handleDateRangeClick(3)}>3d</Button>
        <Button onClick={() => handleWeeksClick(1)}>1 w</Button>
        <Button onClick={() => handleWeeksClick(2)}>2 w</Button>
        <Button onClick={() => handleMonthsClick(1)}>1 m</Button> 
        {showManualDatePicker && ( <Button onClick={() => handleMonthsClick(3)}>3 m</Button> )}
        {showManualDatePicker && ( <Button onClick={() => handleMonthsClick(6)}>6 m</Button> )}
        {showManualDatePicker && ( <Button onClick={() => handleYearsClick(1)}>1 y</Button> )}
      </HStack>

      {/* Manual date range selection - only show on larger screens */}
      {showManualDatePicker && (
        <HStack alignItems="center" gap="2" ml="auto">
          <Text color={colorMode === "light" ? "gray.800" : "gray.200"} >From:</Text>
          <Input
            type="date"
            value={manualStartDate} color={colorMode === "light" ? "gray.800" : "gray.200"}
            onChange={(e) => setManualStartDate(e.target.value)}
          />
          <Text color={colorMode === "light" ? "gray.800" : "gray.200"}>To:</Text>
          <Input
            type="date"
            value={manualEndDate} color={colorMode === "light" ? "gray.800" : "gray.200"}
            onChange={(e) => setManualEndDate(e.target.value)}
          />
          <Button  color={colorMode === "light" ? "gray.800" : "gray.200"} onClick={handleManualDateSelection}>
          <Text padding={2} color={colorMode === "light" ? "gray.800" : "gray.200"} >Apply</Text>
          </Button>
        </HStack>
      )}
    </HStack>
  );
};

export default DateRangePicker;
