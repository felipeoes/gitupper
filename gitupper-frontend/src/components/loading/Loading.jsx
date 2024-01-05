import React from "react";
// import Lottie from "react-lottie";

import { useTheme } from "styled-components";

import { CircularProgress } from "@mui/material";
import { LoadingContainer } from "./styles";

export default function Loading({
  color,
  active = true,
  loadingSize,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
}) {
  const theme = useTheme();

  return (
    <LoadingContainer marginLeft={marginLeft} marginRight={marginRight} marginTop={marginTop} marginBottom={marginBottom}>
      {active && (
        <CircularProgress
          size={loadingSize}
          sx={{
            elevation: 10,
            color: color || theme.colors.primary,
            zIndex: 100,
          }}
        />
      )}
    </LoadingContainer>
  );
}
