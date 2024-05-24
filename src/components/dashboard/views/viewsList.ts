import React, { useMemo } from "react";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SettingsIcon from "@mui/icons-material/Settings";
import { SvgIconComponent } from "@mui/icons-material";

import PreferencesView from "./PreferencesView";
import { User } from "firebase/auth";
import { ADMIN_USERS } from "utils/constants";

export interface DashbardViewSpec {
  key: string;
  label: string;
  icon: SvgIconComponent;
  component: React.ComponentType;
  adminOnly?: boolean;
}

const viewsList: DashbardViewSpec[] = [
  {
    key: "preferences",
    label: "Preferences",
    icon: SettingsIcon,
    component: PreferencesView,
    adminOnly: false,
  },
];

export const useViewsList = (user: User | null | undefined) => {
  return useMemo(() => {
    if (user && ADMIN_USERS.includes(user.email ?? "")) {
      return viewsList;
    }
    return viewsList.filter((view) => !view.adminOnly);
  }, [user]);
};
