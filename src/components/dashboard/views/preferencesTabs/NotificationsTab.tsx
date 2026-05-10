import { FC } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import {
  Typography,
  FormGroup,
  FormControlLabel,
  Paper,
  alpha,
} from "@mui/material";

import { ClientConfig } from "types/user";
import { EmailInput, FirestoreBackedTextField } from "components/utils/forms";
import { isValidEmail } from "utils/validators";
const NotificationsTab: FC<{
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
        Email
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Address used for booking-related notifications.
      </Typography>
      <FormGroup>
        <FirestoreBackedTextField
          label="Email address"
          disabled={updatingAnything}
          docSnap={userConfigSnapshot!}
          fieldPath="preferences.notifications.email.email"
          variant="outlined"
          isValid={(email) => !email || isValidEmail(email)}
          helperText={(_, validEmail) =>
            validEmail ? "" : "Invalid email address"
          }
          sx={{ maxWidth: 400 }}
          InputProps={{ inputComponent: EmailInput as any }}
        />
      </FormGroup>
    </Paper>
  );
};

export default NotificationsTab;
