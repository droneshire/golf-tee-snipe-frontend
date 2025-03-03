import React, { FC } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import {
  Typography,
  FormGroup,
  FormControlLabel,
  Divider,
} from "@mui/material";

import { ClientConfig } from "types/user";
import {
  FirestoreBackedSwitch,
  FirestoreBackedTextField,
  FirestoreBackedTimeZoneSelect,
} from "components/utils/forms";
const NotificationsTab: FC<{
  userConfigSnapshot: DocumentSnapshot<ClientConfig>;
}> = ({ userConfigSnapshot }) => {
  const updatingAnything = !!userConfigSnapshot?.metadata.fromCache;
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Preferences
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
        <Typography variant="button" gutterBottom sx={{ marginTop: 2 }}>
          TextBelt
        </Typography>
        <Typography variant="body1">
          Click{" "}
          <a href="https://textbelt.com/purchase/" target="_blank">
            here
          </a>{" "}
          to reload TextBelt.
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          API Key:
        </Typography>
        <FirestoreBackedTextField
          sx={{ marginTop: 2, marginRight: 2, width: "300px" }}
          disabled={true}
          docSnap={userConfigSnapshot!}
          InputProps={{
            readOnly: true,
            title: userConfigSnapshot?.get("preferences.notifications.sms.textbeltApiKey") || ""
          }}
          fieldPath="preferences.notifications.sms.textbeltApiKey"
        />
      </FormGroup>
      <Divider sx={{ marginTop: 2, marginBottom: 4 }} />
    </>
  );
};

export default NotificationsTab;
