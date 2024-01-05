import { styled as muiStyled } from "@mui/material/styles";
import LdButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";

export const LoadingButton = muiStyled(LdButton)((props) => ({
  display: "flex",
  border: props.border ? `1px solid ${props.borderColor}` : "none",

  borderRadius: 4,
  width: props.width || 465,
  height: props.height || 36,

  marginLeft: props.marginLeft || 0,
  marginRight: props.marginRight || 0,
  marginTop: props.marginTop || 0,
  marginBottom: props.marginBottom || 0,

  fontFamily: props.fontFamily || "InterSemiBold",
  fontStyle: props.fontStyle || "normal",
  fontSize: props.fontSize || 16,
  fontWeight: props.fontWeight || "600",
  textTransform: props.textTransform || "none",
  textAlign: props.textAlign || "center",
  padding: props.padding || 0,

  color: props.textColor || "#F2F2F2",
  backgroundColor: props.bgColor || "transparent",

  "&:hover": {
    opacity: 0.8,
    backgroundColor: props.bgColor,
    borderColor: props.border && props.borderColor,
    transition: "all 0.3s ease-in-out",
  },
  "&:disabled ": {
    opacity: 0.7,
    backgroundColor: "#8C8C8C",
    cursor: "not-allowed",
    fontWeight: "bold",
    pointerEvents: "none",
    transition: "all 0.3s ease-in-out",
  },
}));

export const ButtonContainer = muiStyled(Button)((props) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  border: props.border ? `1px solid ${props.borderColor}` : "none",

  borderRadius: 4,

  width: props.width || 460,
  height: props.height || 36,

  marginLeft: props.marginLeft || 0,
  marginRight: props.marginRight || 0,
  marginTop: props.marginTop || 0,
  marginBottom: props.marginBottom || 0,

  fontFamily: props.fontFamily || "InterRegular",
  fontStyle: props.fontStyle || "normal",
  fontSize: props.fontSize || 14,
  fontWeight: props.fontWeight || "600",
  textTransform: props.textTransform || "none",

  paddingLeft: props.paddingLeft || 0,
  paddingRight: props.paddingRight || 0,
  paddingTop: props.paddingTop || 0,
  paddingBottom: props.paddingBottom || 0,

  color: props.textColor || "#F2F2F2",
  backgroundColor: props.bgColor || "transparent",

  cursor: "pointer",

  "&:hover": {
    backgroundColor: props.bgColor,
    borderColor: props.border && props.borderColor,
    transition: "all 0.3s ease-in-out",
  },
  "&:disabled ": {
    opacity: 0.3,
    backgroundColor: "#8C8C8C",
    color: "black",
    fontWeight: "bold",
    cursor: "not-allowed",
    pointerEvents: "none",
    transition: "all 0.3s ease-in-out",

    "&:hover": {
      opacity: 0.4,
    },
  },
}));
