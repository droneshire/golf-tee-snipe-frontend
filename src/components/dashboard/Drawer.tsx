import React, { FC } from "react";
import { useMatch, useResolvedPath } from "react-router-dom";

import { styled } from "@mui/material/styles";
import {
  Drawer as MuiDrawer,
  DrawerProps as MuiDrawerProps,
  Toolbar,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import { DashbardViewSpec } from "./views/viewsList";

interface StyledDrawerProps extends MuiDrawerProps {
  drawerWidth: number;
}

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "drawerWidth",
})<StyledDrawerProps>(({ theme, open, drawerWidth }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export interface DrawerProps extends StyledDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  viewsList: DashbardViewSpec[];
}

interface ViewButtonProps extends Pick<DashbardViewSpec, "label" | "icon"> {
  to: string;
  drawerOpen: boolean;
}
const ViewButton: FC<ViewButtonProps> = ({
  to,
  label,
  icon: Icon,
  drawerOpen,
}) => {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });
  const button = (
    <ListItemButton
      selected={!!match}
      href={to}
      sx={{
        justifyContent: drawerOpen ? "flex-start" : "center",
        px: drawerOpen ? undefined : 1,
        mx: drawerOpen ? undefined : 0.5,
        minHeight: 48,
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: drawerOpen ? undefined : 0,
          justifyContent: "center",
        }}
      >
        <Icon />
      </ListItemIcon>
      {drawerOpen ? <ListItemText primary={label} /> : null}
    </ListItemButton>
  );

  return drawerOpen ? (
    button
  ) : (
    <Tooltip title={label} placement="right" arrow enterDelay={400}>
      {button}
    </Tooltip>
  );
};

const Drawer: FC<DrawerProps> = ({ setOpen, viewsList, open, ...props }) => {
  return (
    <StyledDrawer variant="permanent" open={open} {...props}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "flex-end" : "center",
          px: open ? 1 : 0.5,
        }}
      >
        <IconButton
          onClick={() => setOpen(false)}
          size={open ? "medium" : "small"}
          sx={{
            color: "text.secondary",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav" sx={{ px: open ? 0.5 : 0, py: 1 }}>
        {viewsList.map(({ key, label, icon }) => (
          <ViewButton
            key={key}
            to={`/dashboard/${key}`}
            label={label}
            icon={icon}
            drawerOpen={open}
          />
        ))}
      </List>
    </StyledDrawer>
  );
};

export default Drawer;
