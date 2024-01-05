import { useTheme } from "styled-components";
import { useState } from "react";
import {
  animated,
  useSpring,
  config,
  useSpringRef,
  useChain,
} from "react-spring";

export default function Checkbox({
  width,
  height,
  color,
  bgColor,
  checked,
  onChange,
  disabled,
}) {
  const theme = useTheme();
  
  // const [isChecked, setIsChecked] = useState(false);
  const checkboxAnimationRef = useSpringRef();
  const checkboxAnimationStyle = useSpring({
    backgroundColor: checked ? `${theme.colors.primary}` : "transparent",
    borderColor: checked
      ? bgColor || `${theme.colors.primary}`
      : theme.colors.disabledButton,
    config: config.gentle,
    ref: checkboxAnimationRef,
    border: checked
      ? `1px solid ${bgColor || `${theme.colors.primary}`}`
      : `1px solid ${theme.colors.disabledButton}`,
    borderRadius: 2,
    width: width || 16,
    height: height || 16,
  });

  const [checkmarkLength, setCheckmarkLength] = useState(null);

  const checkmarkAnimationRef = useSpringRef();
  const checkmarkAnimationStyle = useSpring({
    x: checked ? 0 : checkmarkLength,
    config: config.gentle,
    ref: checkmarkAnimationRef,
  });

  useChain(
    // isChecked
    checked
      ? [checkboxAnimationRef, checkmarkAnimationRef]
      : [checkmarkAnimationRef, checkboxAnimationRef],
    [0, 0.1]
  );

  return (
    <label>
      <input
        disabled={disabled}
        style={{ display: "none" }}
        type="checkbox"
        onChange={(e) => {
          // setIsChecked(!isChecked);
          onChange && onChange(e);
        }}
      />
      <animated.svg
        style={checkboxAnimationStyle}
        className={`checkbox ${
          // isChecked
          checked ? "checkbox--active" : ""
        }`}
        aria-hidden="true"
        viewBox="0 0 15 11"
        fill="none"
      >
        <animated.path
          d="M1 4.5L5 9L14 1"
          strokeWidth="2"
          stroke={color || "#fff"}
          ref={(ref) => {
            if (ref) {
              setCheckmarkLength(ref.getTotalLength());
            }
          }}
          strokeDasharray={checkmarkLength}
          strokeDashoffset={checkmarkAnimationStyle.x}
        />
      </animated.svg>
    </label>
  );
}
