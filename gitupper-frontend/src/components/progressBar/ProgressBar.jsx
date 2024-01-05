/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useTheme } from "styled-components";

import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function ProgressBar(props) {
  const [progress, setProgress] = useState(props.value);
  const [buffer, setBuffer] = useState(10);

  const theme = useTheme();

  useEffect(() => {
    if (progress > 100) {
      setProgress(100);
      setBuffer(100);
    } else {
      const diff = Math.random() * 10;
      setProgress(props.value);
      setBuffer(props.value + diff);
    }
  }, [props.value]);

  return props.variant === "buffer" ? (
    <Box sx={{ width: props.width || "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress
            sx={{
              "& .MuiLinearProgress-bar": {
                backgroundColor: theme.colors.primary,
              },
              "& .MuiLinearProgress-bar1Buffer": {
                backgroundColor: theme.colors.primary,
                opacity: 0.6,
              },
              "& .MuiLinearProgress-bar2Buffer": {
                backgroundColor: theme.colors.primary,
                opacity: 0.6,
              },
              "& .MuiLinearProgress-dashed": {
                backgroundColor: theme.colors.primary,
                opacity: 0.4,
                backgroundImage:
                  "radial-gradient(#f2ba52 0%, #f2ba52 16%, transparent 42%)",
              },
            }}
            value={progress}
            variant={props.variant}
            valueBuffer={buffer}
            {...props}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            progress
          )}%`}</Typography>
        </Box>
      </Box>
    </Box>
  ) : (
    <Box sx={{ width: props.width || "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1, color: props.color }}>
          <LinearProgress
            sx={{
              "& .MuiLinearProgress-barColorPrimary": {
                backgroundColor: theme.colors.primary,
              },
              "& .MuiLinearProgress-bar1Buffer": {
                backgroundColor: theme.colors.primary,
                opacity: 0.4,
              },
              "& .MuiLinearProgress-bar2Buffer": {
                backgroundColor: theme.colors.primary,
                opacity: 0.6,
              },
            }}
            value={progress}
            variant={props.variant}
            {...props}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            progress
          )}%`}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

ProgressBar.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};
