import { useState, useContext } from "react";

import { useTheme } from "styled-components";
import { styled } from "@mui/material/styles";

import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";

import {
  MdOutlineCollectionsBookmark,
  MdChevronLeft,
  MdChevronRight,
  MdDashboard,
  MdSettings,
  MdOutlineLogout,
  MdOutlineIntegrationInstructions,
} from "react-icons/md";

import {
  SidebarContainer,
  StyledDivider,
  SidebarUserContainer,
  SidebarUserText,
} from "./styles";

import { Topbar } from "../topbar/Topbar";
import AuthContext from "../../contexts/auth";
import DropdownMenu from "./../dropdownMenu/DropdownMenu";
import { UserIcon } from "../topbar/styles";

import { paths } from "./../../services/utils/paths";
import SideBarLists from "./sidebarLists/sidebarLists";
import JobsDrawer from "../jobsDrawer/JobsDrawer";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(8)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(84px + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  width: `calc(100% - calc(84px + 1px))`,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Sidebar(props) {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  const theme = useTheme();
  const { state, Logout } = useContext(AuthContext);
  const user = state.user;

  const RenderPage = props.RenderPage;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function handleOnLogout() {
    Logout();
  }

  const primaryItemsList = [
    {
      name: "Homepage",
      path: paths.homepage,
      icon: MdDashboard,
    },
    {
      name: "Repositórios",
      path: paths.repositories,
      icon: MdOutlineCollectionsBookmark,
    },
    {
      name: "Bind",
      path: paths.bind,
      icon: MdOutlineIntegrationInstructions,
    },
  ];

  const secondaryItemsList = [
    {
      name: "Configurações",
      path: paths.settings,
      icon: MdSettings,
    },
    {
      name: "Sair",
      path: "/login",
      icon: MdOutlineLogout,
      onClick: handleOnLogout,
    },
  ];

  return (
    <SidebarContainer
      className="sidebar-container"
      hidden={props.hidden}
      open={open}
    >
      <CssBaseline />

      <AppBar
        position="fixed"
        open={open}
        style={{
          backgroundColor: theme.colors.white,

          boxShadow: "none",
          height: 52,
        }}
      >
        <Topbar
          clean
          disableElevation
          bgColor={theme.colors.white}
          iconMarginLeft={24}
          IconElement={
            open ? (
              <>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerClose}
                  edge="start"
                >
                  <MdChevronLeft size={30} color={theme.colors.black} />
                </IconButton>
                <span style={{ color: "black" }}>{selectedItem?.name}</span>
              </>
            ) : (
              <>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                >
                  <MdChevronRight size={30} color={theme.colors.black} />
                </IconButton>
                <span style={{ color: "black" }}>{selectedItem?.name}</span>
              </>
            )
          }
        />
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          "& .MuiDrawer-paper": { backgroundColor: theme.colors.black },
        }}
      >
        <DrawerHeader>
          <SidebarUserContainer>
            <DropdownMenu
              logout
              UserIcon={<UserIcon src={`${user.profile_image}`} />}
            />
            {open && <SidebarUserText>Olá, {user.first_name}</SidebarUserText>}
          </SidebarUserContainer>
        </DrawerHeader>
        <StyledDivider marginTop={10} marginLeft={10} marginRight={10} />

        <SideBarLists
          primaryItemsList={primaryItemsList}
          secondaryItemsList={secondaryItemsList}
          openDrawer={open}
          setSelectedItem={setSelectedItem}
          theme={theme}
        />
      </Drawer>

      <Box
        component="main"
        sx={{ height: "100%", flexGrow: 1, overflow: "hidden" }}
      >
        <DrawerHeader />
        {<RenderPage platform />}

        <JobsDrawer />
      </Box>
    </SidebarContainer>
  );
}
