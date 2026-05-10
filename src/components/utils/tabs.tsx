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
            p: { xs: 2, sm: 3 },
            m: 2,
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            border: "1px solid",
            borderColor: (theme) => theme.palette.divider,
            boxShadow: (theme) =>
              `0 4px 24px ${theme.palette.mode === "light" ? "rgba(15, 23, 42, 0.06)" : "rgba(0,0,0,0.2)"}`,
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
