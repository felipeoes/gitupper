import { useState } from "react";
import { useTheme } from "styled-components";
import { Select as MuiSelect, MenuItem } from "@mui/material";
import { SelectContainer } from "./styles";

export default function Select({ onChange, color, options, containerStyle }) {
  const [selected, setSelected] = useState(options[0]);
  const theme = useTheme();
  
  return (
    <SelectContainer style={containerStyle}>
      <MuiSelect
        sx={{
          color: color,
          mr: { xs: 2, sm: 2 },
          height: 36,
          width: 160,
          zIndex: 1300,
          fontFamily: "InterMedium",
          fontSize: 14,
        }}
        labelId="simple-select-filled-label"
        id="simple-select-filled"
        value={selected.value}
        onChange={(e) => {
          setSelected(e.target);
          onChange(e);
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              color: option?.itemColor || theme.colors.black80,
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </SelectContainer>
  );
}
