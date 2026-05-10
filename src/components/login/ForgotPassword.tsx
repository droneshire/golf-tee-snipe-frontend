import React from "react";
import { useLocation, Navigate, Link as RouterLink } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Link,
  Paper,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import Copyright from "components/Copyright";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { sendPasswordReset } from "hooks/firebase/auth";

const ForgotPassword: React.FC = () => {
  const [resetEmail, setResetEmail] = React.useState("");
  const [didResetPassword, setDidResetPassword] = React.useState(false);
  const location = useLocation();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResetEmail(event.target.value);
  };

  const handleResetPassword = () => {
    sendPasswordReset(resetEmail);
    setTimeout(() => {
      setDidResetPassword(true);
    }, 2000);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        background: "transparent",
      }}
    >
      <CssBaseline />
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: (theme) => alpha(theme.palette.common.black, 0.06),
            boxShadow: (theme) =>
              `0 20px 48px ${alpha(theme.palette.primary.dark, 0.1)}`,
          }}
        >
          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              mb: 2,
              fontSize: "0.875rem",
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            Back to sign in
          </Link>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Avatar
              sx={{
                m: "0 auto",
                mb: 2,
                width: 56,
                height: 56,
                bgcolor: "secondary.main",
              }}
            >
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 700 }}>
              Reset password
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Enter your email and we will send reset instructions.
            </Typography>
          </Box>
          <TextField
            sx={{ mb: 2 }}
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={resetEmail}
            onChange={handleEmailChange}
          />
          <Button
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            startIcon={<LockOpenIcon />}
            onClick={handleResetPassword}
            sx={{ py: 1.25 }}
          >
            Send reset link
          </Button>
        </Paper>
      </Container>
      <Copyright sx={{ mt: 4 }} />
      {didResetPassword && (
        <Navigate
          to={(location.state as { from?: { pathname?: string } })?.from
            ?.pathname || "/"}
          replace
        />
      )}
    </Box>
  );
};

export default ForgotPassword;
