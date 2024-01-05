import { useState } from "react";
import FloatingLabelInput from "react-floating-label-input";
import { FloatInputContainer } from "./styles";

export default function FloatingInput({
  type,
  name,
  label,
  fontSize,
  width,
  height,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  onChange,
  onBlur,
  onFocus,
  error,
  value,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(error);

  function handleOnFocusChange() {
    setIsFocused(!isFocused);
  }

  function handleOnRemoveError() {
    if (hasError) {
      setHasError(false);
    }
  }
  return (
    <FloatInputContainer
      onClick={handleOnRemoveError}
      fontSize={fontSize}
      height={height}
      width={width}
      marginLeft={marginLeft}
      marginRight={marginRight}
      marginTop={marginTop}
      marginBottom={marginBottom}
      focused={isFocused}
      paddingLeft={isFocused ? 0 : 4}
      error={hasError}
    >
      <FloatingLabelInput
        type={type}
        autoFocus
        name={name}
        id="float-input"
        label={label || ""}
        className="custom-float-input"
        onBlur={() => handleOnFocusChange}
        onChange={onChange}
        onFocus={() => handleOnFocusChange}
        value={value}
      />
    </FloatInputContainer>
  );
}
