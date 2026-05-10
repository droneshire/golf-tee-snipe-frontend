import React from "react";
import { Paper } from "@mui/material";
import { withErrorBoundary } from "react-error-boundary";

import { ErrorFallback } from "components/utils/errors";

export interface TabPanelProps {
  children?: React.ReactNode;
  selectedTabIndex: string;
  index: string;
}

export const TabPanel = withErrorBoundary<TabPanelProps>(
  ({ children, selectedTabIndex, index, ...other }) => {
    return (
      <div role="tabpanel" hidden={selectedTabIndex !== index} {...other}>
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 1.5, sm: 3 },
            m: { xs: 0.5, sm: 2 },
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            border: "1px solid",
            borderColor: (theme) => theme.palette.divider,
            boxShadow: (theme) =>
              `0 4px 24px ${theme.palette.mode === "light" ? "rgba(15, 23, 42, 0.06)" : "rgba(0,0,0,0.2)"}`,
            minWidth: 0,
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          {children}
        </Paper>
      </div>
    );
  },
  {
    FallbackComponent: ErrorFallback,
  }
);
