import React, { FC, useState } from "react";

import { getAuth, User } from "firebase/auth";
import { styled } from "@mui/material/styles";
import {
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { GolfCourse } from "@mui/icons-material";

interface StyledAppBarProps extends MuiAppBarProps {
  drawerWidth: number;
  drawerIsOpen?: boolean;
}

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) =>
    prop !== "drawerIsOpen" && prop !== "drawerWidth",
})<StyledAppBarProps>(({ theme, drawerIsOpen, drawerWidth }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(drawerIsOpen && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export interface AppBarProps extends StyledAppBarProps {
  openDrawer: (drawerIsOpen: boolean) => void;
  user: User;
}

const AppBar: FC<AppBarProps> = ({
  openDrawer,
  drawerIsOpen,
  user,
  ...props
}) => {
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const userMenuIsOpen = Boolean(userMenuAnchorEl);
  const toggleUserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserMenuAnchorEl(userMenuIsOpen ? null : event.currentTarget);
  };
  const closeUserMenu = () => {
    setUserMenuAnchorEl(null);
  };
  const logout = () => {
    getAuth().signOut();
    closeUserMenu();
  };
  return (
    <StyledAppBar position="absolute" drawerIsOpen={drawerIsOpen} {...props}>
      <Toolbar
        sx={{
          pr: "24px", // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={() => openDrawer(true)}
          sx={{
            marginRight: "36px",
            ...(drawerIsOpen && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <GolfCourse sx={{ mr: 1.25, opacity: 0.95, fontSize: 28 }} />
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textShadow: "0 1px 2px rgba(0,0,0,0.12)",
          }}
        >
          Golf Tee Time Sniper
        </Typography>
        <IconButton
          onClick={toggleUserMenu}
          sx={{
            p: 0.5,
            border: "2px solid rgba(255,255,255,0.35)",
            "&:hover": { borderColor: "rgba(255,255,255,0.6)" },
          }}
        >
          <Avatar
            alt="User Account"
            src={user.photoURL || ""}
            sx={{ width: 36, height: 36, fontSize: "0.9rem" }}
          >
            {
              // Show initials if we can't load the photo
              user.displayName?.split(" ").map((name) => name[0])
            }
          </Avatar>
          <Menu
            id="basic-menu"
            anchorEl={userMenuAnchorEl}
            open={userMenuIsOpen}
            onClose={closeUserMenu}
            PaperProps={{
              elevation: 8,
              sx: {
                mt: 1.5,
                minWidth: 220,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              },
            }}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem disabled={true}>{user.email}</MenuItem>
            <MenuItem onClick={logout}>
              <LogoutIcon sx={{ marginRight: "12px" }} />
              Logout
            </MenuItem>
          </Menu>
        </IconButton>
      </Toolbar>
    </StyledAppBar>
  );
};

export default AppBar;
