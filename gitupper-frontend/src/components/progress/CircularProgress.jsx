import { useTheme } from "styled-components";
import { CircularProgress as MuiCircularProgress } from "@mui/material";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function CircularProgress(props) {
  const variant = props.value ? "determinate" : "indeterminate";
  const theme = useTheme();
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <MuiCircularProgress
        variant={variant}
        {...props}
        size={24}
        sx={{
          color: theme.colors.primary,
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
        }}
      >
        {variant === "determinate" && (
          <Typography variant="caption" component="div" color="text.secondary">
            {`${Math.round(props.value)}`}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

CircularProgress.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};
