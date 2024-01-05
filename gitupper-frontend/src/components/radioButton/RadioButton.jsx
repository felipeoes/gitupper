import { useTheme } from "styled-components";
import Radio from "@mui/material/Radio";
import { RadioButtonsContainer, RadioButtonText } from "./styles";

export default function RadioButton(props) {
  const { id, label, icon, checked, onChange, onClick, ...rest } = props;
  const theme = useTheme();

  return (
    <RadioButtonsContainer>
      <Radio
        size="small"
        id={id}
        checked={checked}
        onChange={onChange}
        onClick={onClick}
        {...rest}
        value={label}
        style={{ color: checked && theme.colors.primary }}
      />
      <RadioButtonText>{label}</RadioButtonText>
    </RadioButtonsContainer>
  );
}
