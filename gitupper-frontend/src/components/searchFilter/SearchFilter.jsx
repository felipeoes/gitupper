import { useTheme } from "styled-components";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { MdSearch, MdClear } from "react-icons/md";
import Loading from "../loading/Loading";

export default function SearchFilter(props) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pl: { sm: 1 },

        "& .MuiOutlinedInput-root": {
          height: 40,
          width: 200,
        },
        pb: 0,
      }}
    >
      <TextField
        variant="outlined"
        size="small"
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        disabled={props.disabled}
        InputProps={{
          // startAdornment: <MdSearch size={24} style={{ marginRight: 10 }} />,

          endAdornment: (
            <IconButton
              title="Buscar"
              aria-label="Buscar"
              size="small"
              onClick={props.onClick}
              disabled={
                !props.value ||
                props?.value === "" ||
                props.disabled ||
                props.loading
              }
              sx={{
                color: "white",
                backgroundColor: theme.colors.primary,
                "&:hover": {
                  backgroundColor: theme.colors.secondary,
                },
                margin: 0,
                marginLeft: "4px",
              }}
            >
              {props.loading ? (
                <Loading loadingSize={20} />
              ) : (
                <MdSearch size={20} />
              )}
            </IconButton>
          ),

          // endAdornment: (
          //   <IconButton
          //     title="Clear"
          //     aria-label="Clear"
          //     size="small"
          //     style={{ visibility: props.value ? "visible" : "hidden" }}
          //     onClick={props.clearSearch}
          //   >
          //     <MdClear size={24} />
          //   </IconButton>
          // ),
        }}
        sx={{
          width: {
            xs: 1,
            sm: "auto",
          },
          m: (theme) => theme.spacing(1, 0.5, 1.5),
          "& .MuiSvgIcon-root": {
            mr: 0.5,
          },
          "& .MuiInput-underline:before": {
            borderBottom: 1,
            borderColor: "divider",
          },
          maxHeight: 32,
          maxWidth: 179,
        }}
      />
    </Box>
  );
}

SearchFilter.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
