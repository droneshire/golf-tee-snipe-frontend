import { FC, useEffect, useMemo, useState } from "react";

import {
  Tooltip,
  CircularProgress,
  Typography,
  Fab,
  Paper,
  alpha,
} from "@mui/material";
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
      <Box alignItems="center" sx={{ width: "100%", minWidth: 0 }}>
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            mt: 1,
            mb: 3,
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            background: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(
                theme.palette.background.paper,
                0.95
              )} 55%, ${theme.palette.background.paper} 100%)`,
            boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <SportsGolfIcon
              sx={{
                fontSize: 36,
                color: "primary.main",
                filter: "drop-shadow(0 2px 4px rgba(13,148,136,0.35))",
              }}
            />
            <Box>
              <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
                Accounts
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                You can add{" "}
                <Typography component="span" color="primary.main" fontWeight={700}>
                  {MAX_ACCOUNTS - existingAccountIds.length}
                </Typography>{" "}
                more accounts.
              </Typography>
            </Box>
          </Box>
        </Paper>
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
