import { ElevatedButton, ElevatedButtonsContainer } from "./styles";

export default function ElevatedButtons({
  value1,
  value2,
  elevated,
  type,
  border,
  color,
  bgColor,
  borderColor,
  disabled = false,
  height,
  width,
  buttonWidth,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  fontWeight,
  fontSize,
  Icon,
  onClick,
}) {
  return (
    <ElevatedButtonsContainer
      marginLeft={marginLeft}
      marginRight={marginRight}
      marginTop={marginTop}
      marginBottom={marginBottom}
      width={width}
      height={height}
      bgColor={bgColor}
    >
      <ElevatedButton
        fontWeight={fontWeight}
        fontSize={fontSize}
        border={border}
        type={type || "button"}
        color={color}
        disabled={disabled}
        bgColor={bgColor}
        borderColor={borderColor}
        onClick={() => onClick(value1)}
        height={height}
        buttonWidth={buttonWidth}
        elevated={elevated}
        first
      >
        {Icon && <Icon />}
        {value1}
      </ElevatedButton>

      <ElevatedButton
        fontWeight={fontWeight}
        fontSize={fontSize}
        border={border}
        type={type || "button"}
        disabled={disabled}
        color={color}
        bgColor={bgColor}
        borderColor={borderColor}
        onClick={() => onClick(value2)}
        marginLeft={-4}
        height={height}
        buttonWidth={buttonWidth}
        elevated={!elevated}
      >
        {Icon && <Icon />}
        {value2}
      </ElevatedButton>
    </ElevatedButtonsContainer>
  );
}
