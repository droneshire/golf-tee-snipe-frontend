import React, { FC } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import {
  Typography,
  FormGroup,
  FormControlLabel,
  Divider,
  Paper,
  Link,
  alpha,
} from "@mui/material";

import { ClientConfig } from "types/user";
import {
  FirestoreBackedSwitch,
  FirestoreBackedTextField,
  FirestoreBackedTimeZoneSelect,
} from "components/utils/forms";
const PreferencesTab: FC<{
  userConfigSnapshot: DocumentSnapshot<ClientConfig>;
}> = ({ userConfigSnapshot }) => {
  const updatingAnything = !!userConfigSnapshot?.metadata.fromCache;
  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        borderColor: "divider",
        background: (theme) =>
          `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, ${theme.palette.background.paper} 100%)`,
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
        SMS & TextBelt
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Control SMS alerts and view your TextBelt API key (read-only).
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <FirestoreBackedSwitch
              disabled={updatingAnything}
              docSnap={userConfigSnapshot!}
              fieldPath="preferences.notifications.sms.updatesEnabled"
              checkBox={true}
            />
          }
          label="SMS updates enabled"
        />
        <Typography variant="subtitle2" sx={{ mt: 3, mb: 0.5 }}>
          TextBelt
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Reload credits on{" "}
          <Link
            href="https://textbelt.com/purchase/"
            target="_blank"
            rel="noopener noreferrer"
          >
            textbelt.com
          </Link>
          .
        </Typography>
        <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
          API key
        </Typography>
        <FirestoreBackedTextField
          sx={{ marginTop: 1, maxWidth: 400 }}
          disabled={true}
          docSnap={userConfigSnapshot!}
          variant="outlined"
          InputProps={{
            readOnly: true,
            title:
              userConfigSnapshot?.get(
                "preferences.notifications.sms.textbeltApiKey"
              ) || "",
          }}
          fieldPath="preferences.notifications.sms.textbeltApiKey"
        />
      </FormGroup>
      <Divider sx={{ marginTop: 3 }} />
    </Paper>
  );
};

export default PreferencesTab;
