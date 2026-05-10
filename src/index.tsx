import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";

import "index.css";
import App from "components/App";
import { LinkBehavior } from "components/utils/links";

const mdTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0d9488",
      light: "#5eead4",
      dark: "#0f766e",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#475569",
      light: "#64748b",
      dark: "#334155",
      contrastText: "#f8fafc",
    },
    background: {
      default: "#ecfdf5",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
    },
    divider: alpha("#0f172a", 0.08),
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", sans-serif',
    h4: { fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.2 },
    h5: { fontWeight: 700, letterSpacing: "-0.02em" },
    h6: { fontWeight: 600, letterSpacing: "-0.01em" },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none" },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior as React.ElementType,
      },
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiListItemButton: {
      defaultProps: {
        component: LinkBehavior as React.ElementType,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          margin: theme.spacing(0.5, 1),
          paddingLeft: theme.spacing(1.5),
          "&.Mui-selected": {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.18),
            },
          },
        }),
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
          color: "inherit",
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        color: "transparent",
        elevation: 0,
      },
      styleOverrides: {
        root: {
          color: "#f8fafc",
          backgroundImage:
            "linear-gradient(125deg, #0f766e 0%, #0d9488 42%, #115e59 100%)",
          boxShadow: "0 4px 24px rgba(15, 118, 110, 0.35)",
          backdropFilter: "blur(12px)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#f8fafc",
          borderRight: `1px solid ${alpha("#0f172a", 0.06)}`,
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
        containedPrimary: ({ theme }) => ({
          boxShadow: `0 2px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
          "&:hover": {
            boxShadow: `0 6px 22px ${alpha(theme.palette.primary.main, 0.45)}`,
          },
        }),
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        outlined: {
          borderColor: alpha("#0f172a", 0.08),
          boxShadow: `0 1px 3px ${alpha("#0f172a", 0.06)}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: `0 24px 64px ${alpha("#0f172a", 0.16)}`,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          letterSpacing: "-0.02em",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
        notchedOutline: ({ theme }) => ({
          borderColor: alpha(theme.palette.text.primary, 0.12),
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          minHeight: 48,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 3,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: ({ theme }) => ({
          boxShadow: `0 10px 28px ${alpha(theme.palette.primary.main, 0.42)}`,
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={mdTheme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
