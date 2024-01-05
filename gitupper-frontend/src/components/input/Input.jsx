import { useState, useEffect } from "react";
import {
  MainContainer,
  InputContainer,
  StyledInput,
  Label,
  IconButtonContainer,
} from "./styles";
import { BiHide, BiShow } from "react-icons/bi";
import { useTheme } from "styled-components";
import { IconButton } from "@mui/material";

export default function Input({
  type,
  name,
  placeholder,
  autoFocus,
  width,
  height,
  color,
  bgColor,
  value,
  onChange,
  required,
  error,
  disabled,
  label,
  labelColor,
  lblFontSize,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  lblTop, // marginTop of label
  borderColor,
  activeColor, // color of input when focused
  iconColor,
}) {
  const [hasError, setHasError] = useState(error);
  const [isPassHidden, setIsPassHidden] = useState(true);
  const theme = useTheme();

  function handleOnClickHidePassIcon() {
    setIsPassHidden(!isPassHidden);
  }

  function handleOnRemoveError() {
    if (hasError && !error) {
      setHasError(false);
    }
  }

  useEffect(() => {
    if (error) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [error]);

  return (
    <MainContainer>
      {label && (
        <Label
          marginTop={lblTop}
          htmlFor={name}
          labelColor={labelColor}
          fontSize={lblFontSize}
          error={hasError}
        >
          {label}
        </Label>
      )}

      <InputContainer
        onClick={handleOnRemoveError}
        marginBottom={marginBottom}
        marginTop={marginTop}
        marginLeft={marginLeft}
        marginRight={marginRight}
      >
        <StyledInput
          placeholder={placeholder}
          name={name}
          autoFocus={autoFocus}
          type={
            type === "password" ? (isPassHidden ? "password" : "text") : type
          }
          value={value}
          required={required}
          onChange={(e) => onChange(e)}
          width={width}
          height={height}
          color={color}
          bgColor={bgColor}
          borderColor={borderColor}
          disabled={disabled}
          error={hasError}
          activeColor={activeColor}
        />

        {type === "password" &&
          (isPassHidden ? (
            <IconButtonContainer
              type="button"
              onClick={handleOnClickHidePassIcon}
            >
              <IconButton size="small">
                <BiShow color={iconColor || theme.colors.black} />
              </IconButton>
            </IconButtonContainer>
          ) : (
            <IconButtonContainer
              type="button"
              onClick={handleOnClickHidePassIcon}
            >
              <IconButton size="small">
                <BiHide color={iconColor || theme.colors.black} />
              </IconButton>
            </IconButtonContainer>
          ))}
      </InputContainer>
    </MainContainer>
  );
}
