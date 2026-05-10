import React, { FC } from "react";
import { useOutletContext } from "react-router-dom";
import { Box, CircularProgress, Paper, Tab, Tabs } from "@mui/material";

import { DashboardViewContext } from "components/dashboard/DashboardPage";
import preferencesTabsList from "./preferencesTabs/preferencesTabsList";
import { TabPanel } from "components/utils/tabs";

const PreferencesView: FC = () => {
  const {
    userConfigSnapshot,
  } = useOutletContext<DashboardViewContext>();
  const preferences = userConfigSnapshot?.get("preferences");
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(
    preferencesTabsList[0].key
  );

  const selectTab = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTabIndex(newValue);
  };

  if (!preferences) {
    return <CircularProgress />;
  }
  return (
    <Box sx={{ width: "100%", minWidth: 0, maxWidth: "100%" }}>
      <>
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            mb: 0,
            minWidth: 0,
            maxWidth: "100%",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 2px 12px rgba(15, 23, 42, 0.05)",
          }}
        >
          <Tabs
            value={selectedTabIndex}
            onChange={selectTab}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ px: 1, pt: 0.5 }}
          >
            {preferencesTabsList.map(({ key, label }) => {
              return <Tab label={label} value={key} key={key} />;
            })}
          </Tabs>
        </Paper>
        {preferencesTabsList.map(({ key, component: C }) => {
          return (
            <TabPanel selectedTabIndex={selectedTabIndex} index={key} key={key}>
              <C userConfigSnapshot={userConfigSnapshot!} />
            </TabPanel>
          );
        })}
      </>
    </Box>
  );
};

export default PreferencesView;
