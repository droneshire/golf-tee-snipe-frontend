import { FC, useEffect, useMemo, useState } from "react";

import { Tooltip, CircularProgress, Typography, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SportsGolfIcon from "@mui/icons-material/SportsGolf";
import { ClientConfig } from "types/user";
import { Box } from "@mui/system";
import {
  DocumentSnapshot,
  FieldPath,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { DEFAULT_ACCOUNT_SPEC, AccountSpec } from "./Account";
import { AccountListGroup } from "./AccountListGroup";
import NewAccountDialog from "./NewAccountsDialog";

const MAX_ACCOUNTS = 3;

const AccountsTab: FC<{
  userConfigSnapshot: DocumentSnapshot<ClientConfig>;
}> = ({ userConfigSnapshot }) => {
  const accounts = userConfigSnapshot?.data()?.accounts;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [initialAccountspec, setInitialAccountspec] =
    useState<AccountSpec>(DEFAULT_ACCOUNT_SPEC);

  if (!accounts) {
    return <CircularProgress />;
  }

  const existingAccountIds = useMemo(
    () => Object.keys(accounts || {}),
    [accounts]
  );
  const accountItems: AccountSpec[] = useMemo(() => {
    const items: AccountSpec[] = [];
    Object.entries(accounts || {}).forEach((t) => {
      const [accountId, item] = t;
      items.push({ accountId, ...item });
    });
    return items;
  }, [accounts]);

  const deleteAccount = (accountId: string) => {
    updateDoc(
      userConfigSnapshot.ref,
      new FieldPath("accounts", accountId),
      deleteField()
    );
  };

  const editAccount = (accountId: string) => {
    const accountspec = accountItems.find(
      (item) => item.accountId === accountId
    );
    if (!accountspec) {
      return;
    }
    setInitialAccountspec(accountspec);
  };

  useEffect(() => {
    if (initialAccountspec.accountId !== "") {
      setDialogOpen(true);
    }
  }, [initialAccountspec]);

  const actionButtons = [
    {
      doAction: deleteAccount,
      title: (accountId: string) => `Delete account for ${accountId}`,
      ActionIcon: DeleteIcon,
      bulkOperation: true,
    },
    {
      doAction: editAccount,
      title: (accountId: string) => `Edit account ${accountId}`,
      ActionIcon: EditIcon,
      bulkOperation: false,
    },
  ];

  return (
    <>
      <Box alignItems="center">
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            gap: 2,
          }}
        >
          <SportsGolfIcon />
          <Typography sx={{ mt: 4 }} variant="h6" component="div">
            Accounts
          </Typography>
        </Box>
        <Typography sx={{ mt: 4, mb: 2 }} variant="body1" component="div">
          You can add <b>{MAX_ACCOUNTS - existingAccountIds.length}</b> more
          accounts.
        </Typography>
        <AccountListGroup items={accountItems} actionButtons={actionButtons} />
      </Box>
      <NewAccountDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        createAccount={(accountSpec) => {
          const { accountId, ...item } = accountSpec;
          updateDoc(
            userConfigSnapshot.ref,
            new FieldPath("accounts", accountId),
            item
          );
        }}
        existingAccountIds={existingAccountIds}
        inputAccount={initialAccountspec}
      />
      <Box textAlign="right" sx={{ marginTop: 2 }}>
        <Tooltip title="Add Account">
          <span>
            <Fab
              color="primary"
              onClick={() => setDialogOpen(true)}
              disabled={existingAccountIds.length >= MAX_ACCOUNTS}
            >
              <AddIcon />
            </Fab>
          </span>
        </Tooltip>
      </Box>
    </>
  );
};

export default AccountsTab;
