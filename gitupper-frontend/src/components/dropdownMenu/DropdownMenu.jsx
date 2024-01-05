import { useState, useEffect, Fragment } from "react";
import { useTheme } from "styled-components";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import { MdOutlineLogout, MdAccountCircle } from "react-icons/md";
import Button from "../button/Button";

export default function DropdownMenu({
  UserIcon,
  Icon,
  iconSize,
  iconColor,
  iconMb,
  iconMl,
  iconMr,
  iconMt,
  button,
  filteringColumns,
  setFilter,
  menuItems,
  onClickItem,
  disabled,
  buttonWidth,
  buttonHeight,
  buttonText,
  color,
  borderColor,
  bgColor,
  buttonMl,
  buttonMr,
  fontFamily,
  fontSize,
  fontWeight,
  onClickIcon,
  menuItem,
  FilterView,
  columnId,
  requestSearch,
  logout,
  profile,
  onClickLogout,
  setButtonText,
  menuWidth,
  options,
}) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    handleClose();
  }, [disabled]);

  return (
    <Fragment>
      {button ? (
        <Button
          disabled={disabled}
          onClick={handleClick}
          Icon={Icon}
          iconMb={iconMb || 0}
          iconMl={iconMl || 0}
          iconMr={iconMr || 0}
          iconMt={iconMt || 0}
          width={buttonWidth}
          height={buttonHeight}
          iconSize={iconSize || 24}
          iconColor={iconColor || theme.colors.primary}
          fontFamily={fontFamily || "InterMedium"}
          fontSize={fontSize || 14}
          fontWeight={fontWeight || "500"}
          color={color || theme.colors.primary}
          border
          borderColor={borderColor || theme.colors.primary}
          bgColor={bgColor || theme.colors.white}
          marginLeft={buttonMl}
          marginRight={buttonMr}
        >
          {buttonText}
        </Button>
      ) : (
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          {Icon || UserIcon}
        </IconButton>
      )}
      <Menu
        keepMounted={FilterView && true}
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: menuWidth || "auto",
            // width: menuWidth || "auto",
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              // transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {button &&
          menuItems &&
          menuItems.map(
            (item, index) =>
              item.icon && (
                <MenuItem
                  disabled={filteringColumns.includes(item)}
                  key={index}
                  onClick={() => {
                    handleClose();
                    onClickItem(item);
                  }}
                  sx={{ fontFamily: "InterRegular", fontSize: 14 }}
                >
                  <ListItemIcon>
                    <item.icon size={18} />
                  </ListItemIcon>
                  {item.label}
                </MenuItem>
              )
          )}

        {menuItem && (
          <MenuItem onClick={onClickIcon}>
            <ListItemIcon>
              <MdAccountCircle fontSize="large" />
            </ListItemIcon>
            {menuItem}
          </MenuItem>
        )}

        {FilterView && (
          <FilterView
            setFilter={setFilter}
            columnId={columnId}
            setButtonText={setButtonText}
            requestSearch={requestSearch}
            langOptions={options}
          />
        )}

        {profile && (
          <MenuItem>
            <ListItemIcon>
              <MdAccountCircle fontSize="large" />
            </ListItemIcon>
            Perfil
          </MenuItem>
        )}

        {logout && (
          <MenuItem onClick={onClickLogout}>
            <ListItemIcon>
              <MdOutlineLogout fontSize="large" />
            </ListItemIcon>
            Sair
          </MenuItem>
        )}
      </Menu>
    </Fragment>
  );
}
