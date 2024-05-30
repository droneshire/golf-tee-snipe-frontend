import React, { FC } from "react";
import { useOutletContext } from "react-router-dom";
import { CircularProgress, Box, Tab, Tabs } from "@mui/material";

import { TabPanel } from "components/utils/tabs";
import { DashboardViewContext } from "components/dashboard/DashboardPage";
import accountsTabsList from "./accountsTabs/accountsTabsList";

const AccountsView: FC = () => {
  const {
    user,
    userConfigSnapshot,
    userConfigRef,
    clientsSnapshot,
    clientsConfigRef,
  } = useOutletContext<DashboardViewContext>();

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
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={selectedTabIndex} onChange={selectTab} centered>
            {accountsTabsList.map(({ key, label }) => {
              return <Tab label={label} value={key} key={key} />;
            })}
          </Tabs>
        </Box>
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
