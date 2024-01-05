import { useState } from "react";
import { useTheme } from "styled-components";
import Badge from "@mui/material/Badge";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import PickersDay from "@mui/lab/PickersDay";
import MuiDatePicker from "@mui/lab/DatePicker";
import CalendarPickerSkeleton from "@mui/lab/CalendarPickerSkeleton";
import brLocale from "date-fns/locale/pt-BR";

export default function DatePicker({ marginRight, getCustomizedDate }) {
  const [value, setValue] = useState(null);

  const theme = useTheme();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={brLocale}>
      <MuiDatePicker
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          getCustomizedDate(newValue);
        }}
        renderInput={(params) => (
          <TextField
            variant="outlined"
            size="small"
            InputProps={{
              label: "Error",
            }}
            {...params}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontFamily: "InterRegular",
                fontSize: 14,
                height: 32,
              },
              "& .MuiSvgIcon-root": {
                width: 20,
                color: theme.colors.black80,
              },
              marginRight: marginRight || 0,
              width: 146,
            }}
          />
        )}
        renderLoading={() => <CalendarPickerSkeleton />}
        renderDay={(day, _value, DayComponentProps) => {
          return (
            <Badge key={day.toString()} overlap="circular">
              <PickersDay {...DayComponentProps} />
            </Badge>
          );
        }}
      />
    </LocalizationProvider>
  );
}
