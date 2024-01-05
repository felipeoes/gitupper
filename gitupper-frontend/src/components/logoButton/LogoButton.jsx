import { IconButton } from "@mui/material";
import { AppLogo } from "./styles";

import logo from "../../assets/images/logos/black_logo_GITUPPER.svg";

export default function LogoButton({ disabled, marginLeft }) {
  function handleOnClickLogo() {
    if (!(window.location.pathname === "/login")) {
      window.location.replace("/");
    }
  }

  return (
    <IconButton
      color="inherit"
      aria-label="open drawer"
      onClick={handleOnClickLogo}
      disableRipple
      edge="start"
      disabled={disabled}
      style={{
        marginLeft: marginLeft ? marginLeft : 0,
      }}
    >
      <AppLogo src={logo} alt="logo" />
    </IconButton>
  );
}
