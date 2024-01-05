import React from "react";
import { useTheme } from "styled-components";
import { VisibilityContext } from "react-horizontal-scrolling-menu";

import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import IconButton from "@mui/material/IconButton";
import { ArrowContainer } from "./styles";

function Arrow({ children, disabled, onClick, left }) {
  const theme = useTheme();
  return (
    <ArrowContainer
      left={left}
    >
      <IconButton
        onClick={onClick}
        disabled={disabled}
        sx={{
          "&:disabled": { opacity: 0.5 },
        }}
      >
        {left ? (
          <MdChevronLeft size={28} color={theme.colors.iconColor} />
        ) : (
          <MdChevronRight size={28} color={theme.colors.iconColor} />
        )}
        {children}
      </IconButton>
    </ArrowContainer>
  );
}

export function LeftArrow({ hasItem }) {
  const {
    isFirstItemVisible,
    scrollPrev,
    visibleItemsWithoutSeparators,
    initComplete,
  } = React.useContext(VisibilityContext);

  const [disabled, setDisabled] = React.useState(
    !initComplete || (initComplete && isFirstItemVisible)
  );
  React.useEffect(() => {
    // NOTE: detect if whole component visible
    if (visibleItemsWithoutSeparators.length) {
      setDisabled(isFirstItemVisible);
    }
  }, [isFirstItemVisible, visibleItemsWithoutSeparators]);

  return (
    // hasItem && (
    //   <Arrow left disabled={disabled} onClick={() => scrollPrev()}></Arrow>
    // )
    <Arrow left disabled={disabled} onClick={() => scrollPrev()} />
  );
}

export function RightArrow({ hasItem }) {
  const { isLastItemVisible, scrollNext, visibleItemsWithoutSeparators } =
    React.useContext(VisibilityContext);

  const [disabled, setDisabled] = React.useState(
    !visibleItemsWithoutSeparators.length && isLastItemVisible
  );
  React.useEffect(() => {
    if (visibleItemsWithoutSeparators.length) {
      setDisabled(isLastItemVisible);
    }
  }, [isLastItemVisible, visibleItemsWithoutSeparators]);

  return (
    // hasItem && (
    //   <Arrow right disabled={disabled} onClick={() => scrollNext()}></Arrow>
    // )
    <Arrow right disabled={disabled} onClick={() => scrollNext()}></Arrow>
  );
}
