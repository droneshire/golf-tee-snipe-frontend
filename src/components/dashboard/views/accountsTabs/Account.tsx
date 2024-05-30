import React, { FC } from "react";

import {
  Tooltip,
  TableRow,
  TableCell,
  Chip,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Button,
} from "@mui/material";
import GolfCourseIcon from "@mui/icons-material/GolfCourse";
import { ClientConfig } from "types/user";

export type AccountSpec = ClientConfig["accounts"][string] & {
  accountId: string;
};

export const DEFAULT_ACCOUNT_SPEC: AccountSpec = {
  accountId: "",
  email: "",
  password: "",
  scheduleIds: [],
  numPlayers: [],
  timeOfDay: "",
  numHoles: 0,
  desiredTime: "",
  earliestTime: "",
  latestTime: "",
  targetDays: [],
  allowMultipleReservations: false,
  allowNextDayBooking: false,
};

export interface AccountActionOption {
  doAction: () => void;
  ActionIcon: React.ElementType;
  title: string;
  bulkOperation: boolean;
}

export type AccountProps = AccountSpec & {
  actionButtons: AccountActionOption[];
  selectedAccounts: string[];
  toggleAccountselection: (accountId: string) => void;
};
export const Account: FC<AccountProps> = ({
  accountId,
  email,
  password,
  scheduleIds,
  numPlayers,
  timeOfDay,
  numHoles,
  desiredTime,
  earliestTime,
  latestTime,
  targetDays,
  allowMultipleReservations,
  allowNextDayBooking,
  actionButtons,
  selectedAccounts,
  toggleAccountselection,
}) => {
  const [actionMenuAnchorEl, setActionMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const actionMenuOpen = Boolean(actionMenuAnchorEl);
  const handleActionMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setActionMenuAnchorEl(event.currentTarget);
  };
  const handleActionMenuClose = () => {
    setActionMenuAnchorEl(null);
  };
  return (
    <TableRow hover>
      <TableCell>
        <Tooltip title={`Account ${accountId}`}>
          {(selectedAccounts.includes(accountId) && (
            <Chip
              icon={<GolfCourseIcon />}
              label={accountId}
              onClick={() => toggleAccountselection(accountId)}
            />
          )) || (
            <Chip
              icon={<GolfCourseIcon />}
              label={accountId}
              variant="outlined"
              onClick={() => toggleAccountselection(accountId)}
            />
          )}
        </Tooltip>
      </TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{password}</TableCell>
      <TableCell>{scheduleIds.join(", ")}</TableCell>
      <TableCell>{numPlayers.join(", ")}</TableCell>
      <TableCell>{timeOfDay}</TableCell>
      <TableCell>{numHoles}</TableCell>
      <TableCell>{desiredTime}</TableCell>
      <TableCell>{earliestTime}</TableCell>
      <TableCell>{latestTime}</TableCell>
      <TableCell>{targetDays.join(", ")}</TableCell>
      <TableCell>{allowMultipleReservations ? "Yes" : "No"}</TableCell>
      <TableCell>{allowNextDayBooking ? "Yes" : "No"}</TableCell>
      <TableCell sx={{ textAlign: "right" }}>
        <Button onClick={handleActionMenuClick}>Actions</Button>
        <Menu
          anchorEl={actionMenuAnchorEl}
          open={actionMenuOpen}
          onClose={handleActionMenuClose}
        >
          {actionButtons.map(({ doAction, ActionIcon, title }, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                doAction();
                handleActionMenuClose();
              }}
            >
              {ActionIcon && (
                <ListItemIcon>
                  <ActionIcon fontSize="small" />
                </ListItemIcon>
              )}
              <ListItemText>{title}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </TableCell>
    </TableRow>
  );
};
