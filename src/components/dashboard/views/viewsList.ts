import React, { useMemo } from "react";

import GolfCourseIcon from "@mui/icons-material/GolfCourse";
import SettingsIcon from "@mui/icons-material/Settings";
import { SvgIconComponent } from "@mui/icons-material";

import PreferencesView from "./PreferencesView";
import { User } from "firebase/auth";
import { ADMIN_USERS } from "utils/constants";
import AccountsView from "./AccountsView";

export interface DashbardViewSpec {
  key: string;
  label: string;
  icon: SvgIconComponent;
  component: React.ComponentType;
  adminOnly?: boolean;
}

const viewsList: DashbardViewSpec[] = [
  {
    key: "accounts",
    label: "Accounts",
    icon: GolfCourseIcon,
    component: AccountsView,
    adminOnly: false,
  },
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
