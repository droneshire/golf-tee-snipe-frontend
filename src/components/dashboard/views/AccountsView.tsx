import React, { FC } from "react";
import { useOutletContext } from "react-router-dom";
import { CircularProgress, Box, Paper, Tab, Tabs } from "@mui/material";

import { TabPanel } from "components/utils/tabs";
import { DashboardViewContext } from "components/dashboard/DashboardPage";
import accountsTabsList from "./accountsTabs/accountsTabsList";

const AccountsView: FC = () => {
  const { userConfigSnapshot } = useOutletContext<DashboardViewContext>();

  const accounts = userConfigSnapshot?.get("accounts");
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(
    accountsTabsList[0].key
  );

  const selectTab = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTabIndex(newValue);
  };

  if (!accounts) {
    return <CircularProgress />;
  }
  return (
    <Box sx={{ width: "100%" }}>
      <>
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            mb: 0,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 2px 12px rgba(15, 23, 42, 0.05)",
          }}
        >
          <Tabs
            value={selectedTabIndex}
            onChange={selectTab}
            centered
            sx={{ px: 1, pt: 0.5 }}
          >
            {accountsTabsList.map(({ key, label }) => {
              return <Tab label={label} value={key} key={key} />;
            })}
          </Tabs>
        </Paper>
        {accountsTabsList.map(({ key, component: C }) => {
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

export default AccountsView;
