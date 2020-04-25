import React, { useState } from "react";
import {
  DropButton,
  Box,
  Text,
  Keyboard,
  MaskedInput,
  Calendar,
  Button
} from "grommet";
import { Schedule } from "grommet-icons";
import styled from "styled-components";
import { dateTimeFormat, decomposeDateTime, formatTimeToAMPM } from './timeHelpers';

const styledDropButton = styled(DropButton)`
color: white;
`;


//________________________________________________________Drop content

interface DropContentContext {
  dateTime: Date | string;
  onClose: (dateTime: Date) => void;
  onDateTimeChange: (date: Date) => void; 
}


const DropContent = (context: DropContentContext) => {
  const { dateTime, onClose, onDateTimeChange } = context;

  const _date: Date = typeof dateTime === 'string' ? new Date(dateTime): dateTime; 

  let {
    date: dateStr,
    time: timeStr
  } = decomposeDateTime(_date);

  const close = () => {
    onClose(dateTimeFormat(dateStr, timeStr));
  };

  return (
    <Box align="center">
      <Calendar
        animate={false}
        date={dateStr}
        onSelect={(...args: any[]) => {
          console.log("================Calendar select==========++++>")
          console.log(args);
          if (args.length === 1) {
            onDateTimeChange(dateTimeFormat(args[0], timeStr));
          }
        }}
        showAdjacentDays={false}
      />
      <Box flex={false} pad="medium" gap="medium">
        <Keyboard
          onEnter={event => {
            event.preventDefault(); // so drop doesn't re-open
            close();
          }}
        >
          <MaskedInput
            mask={[
              {
                length: [1, 2],
                options: [
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "11",
                  "12"
                ],
                regexp: /^1[1-2]$|^[0-9]$/,
                placeholder: "hh"
              },
              { fixed: ":" },
              {
                length: 2,
                options: ["00", "15", "30", "45"],
                regexp: /^[0-5][0-9]$|^[0-9]$/,
                placeholder: "mm"
              },
              { fixed: " " },
              {
                length: 2,
                options: ["am", "pm"],
                regexp: /^[ap]m$|^[AP]M$|^[aApP]$/,
                placeholder: "ap"
              }
            ]}
            value={timeStr}
            name="maskedInput"
            onChange={(event: any) => {
              console.log("=====time changed======");
              console.log(event.target.value)
              onDateTimeChange(dateTimeFormat(dateStr, event.target.value));
            }}
          />
        </Keyboard>
        <Box flex={false}>
          <Button label="Done" onClick={close} />
        </Box>
      </Box>
    </Box>
  );
};


//____________________________________________DropdownDateTimePicker
interface DropdownDateTimePickerProps {
  placeholder: string;
  dateTime: Date,
  open: boolean,
  onDateTimeChange: (dateTime: Date) => void;
  onClose: () => void;
  onOpen: () => void;
}

export default (function DropdownDateTimePicker({ 
  dateTime,
  onDateTimeChange,
  open,
  onClose,
  onOpen,
  placeholder
}) {
  const {
    date,
    time
  } = decomposeDateTime(dateTime);

  return (
    <DropButton
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      dropContent={<DropContent dateTime={dateTime} onClose={onClose} onDateTimeChange={onDateTimeChange}/>}
    >
      <Box direction="row" gap="medium" align="center" pad="small">
        <Text color={date ? undefined : "black"}>
          {date
            ? `${new Date(date).toLocaleDateString()} ${time}`
            : placeholder}
        </Text>
        <Schedule color={"black"} />
      </Box>
    </DropButton>
  );
} as React.ComponentType<DropdownDateTimePickerProps>);