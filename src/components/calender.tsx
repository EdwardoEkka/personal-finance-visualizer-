"use client";

import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  return (
    <Card className="p-4 shadow-lg w-fit">
      <DayPicker 
        mode="single" 
        selected={selectedDate} 
        onSelect={(date: Date | undefined) => setSelectedDate(date)} 
      />
    </Card>
  );
};

export default Calendar;
