import React, { FC, useState, useCallback, useMemo } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  FormControlLabel,
  Checkbox,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { AccountSpec, Account } from "./Account";
import TableDisplayButtons from "./TableDisplayButtons";

export interface AccountGroupActionButton {
  doAction: (accountId: string) => void;
  ActionIcon: React.ElementType;
  title: (accountId: string) => string;
  bulkOperation: boolean;
}

export const AccountListGroup: FC<{
  items: AccountSpec[];
  actionButtons: AccountGroupActionButton[];
}> = ({ items, actionButtons }) => {
  const incrementalVisibleItems = 10;
  const [visibleItems, setVisibleItems] = useState(incrementalVisibleItems);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const displayedItems = items.slice(0, visibleItems);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const actionMenuOpen = Boolean(actionMenuAnchorEl);
  const handleActionMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setActionMenuAnchorEl(event.currentTarget);
  };
  const handleActionMenuClose = () => {
    setActionMenuAnchorEl(null);
  };
  const toggleAllItems = useCallback(() => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => item.accountId));
    }
  }, [items, selectedItems]);
  const toggleItemSelection = (accountId: string) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(accountId)) {
        return prevSelectedItems.filter((id) => id !== accountId);
      } else {
        return [...prevSelectedItems, accountId];
      }
    });
  };
  const selectedItemsString = useMemo(() => {
    return `${selectedItems.length} selected`;
  }, [selectedItems]);
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableBody>
          {items.length > 0 && (
            <TableRow sx={{ marginLeft: "1rem" }}>
              <TableCell>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        selectedItems.length === items.length &&
                        items.length > 0
                      }
                      indeterminate={
                        selectedItems.length > 0 &&
                        selectedItems.length < items.length
                      }
                      onChange={toggleAllItems}
                    />
                  }
                  label="Select All/None"
                />
              </TableCell>
              <TableCell>Courses </TableCell>
              <TableCell>Players </TableCell>
              <TableCell>Holes</TableCell>
              <TableCell>Desired Time</TableCell>
              <TableCell>Time Range</TableCell>
              <TableCell>Target Days </TableCell>
              <TableCell>Multiple Bookings?</TableCell>
              <TableCell>Next Day Booking?</TableCell>
              <TableCell sx={{ textAlign: "right" }}>
                <Button onClick={handleActionMenuClick}>Actions</Button>
                <Menu
                  anchorEl={actionMenuAnchorEl}
                  open={actionMenuOpen}
                  onClose={handleActionMenuClose}
                >
                  {actionButtons.map(
                    ({ doAction, ActionIcon, title, bulkOperation }, index) =>
                      bulkOperation && (
                        <MenuItem
                          key={index}
                          onClick={() => {
                            selectedItems.forEach((accountId) => {
                              doAction(accountId);
                            });
                            handleActionMenuClose();
                          }}
                        >
                          {ActionIcon && (
                            <ListItemIcon>
                              <ActionIcon fontSize="small" />
                            </ListItemIcon>
                          )}
                          <ListItemText>
                            {title(selectedItemsString)}
                          </ListItemText>
                        </MenuItem>
                      )
                  )}
                </Menu>
              </TableCell>
            </TableRow>
          )}
          {displayedItems.map((props) => (
            <Account
              key={props.accountId}
              {...props}
              actionButtons={actionButtons.map(
                ({ doAction, title, ActionIcon, bulkOperation }) => ({
                  doAction: () => doAction(props.accountId),
                  title: title(props.accountId),
                  ActionIcon: ActionIcon,
                  bulkOperation: bulkOperation,
                })
              )}
              toggleAccountselection={toggleItemSelection}
              selectedAccounts={selectedItems}
            />
          ))}
        </TableBody>
      </Table>
      <TableDisplayButtons
        {...{ items, visibleItems, setVisibleItems, incrementalVisibleItems }}
      />
    </TableContainer>
  );
};
