import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import {
  AuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Paper,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import Copyright from "components/Copyright";
import EmailIcon from "@mui/icons-material/Email";
import GoogleIcon from "@mui/icons-material/Google";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SportsGolfIcon from "@mui/icons-material/SportsGolf";

import {
  useAuthStateWatcher,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
} from "hooks/firebase/auth";
import EmailLoginModal from "./login/EmailLogin";

const signIn = async (providerFactory: () => AuthProvider) => {
  await signInWithPopup(getAuth(), providerFactory());
};

const LoginPage: React.FC = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const location = useLocation();
  const user = useAuthStateWatcher();

  if (user) {
    const from = (location.state as { from?: { pathname?: string } })?.from
      ?.pathname || "/";
    return <Navigate to={from} replace />;
  }

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
        position: "relative",
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <CssBaseline />
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: (theme) => alpha(theme.palette.common.black, 0.06),
            background: (theme) =>
              `linear-gradient(145deg, ${alpha(
                theme.palette.background.paper,
                0.92
              )} 0%, ${theme.palette.background.paper} 100%)`,
            backdropFilter: "blur(20px)",
            boxShadow: (theme) =>
              `0 24px 64px ${alpha(theme.palette.primary.dark, 0.12)}, 0 0 0 1px ${alpha(
                theme.palette.common.white,
                0.6
              )} inset`,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <SportsGolfIcon
              sx={{
                fontSize: 40,
                color: "primary.main",
                mb: 1,
                filter: "drop-shadow(0 2px 6px rgba(13,148,136,0.35))",
              }}
            />
            <Avatar
              sx={{
                m: "0 auto",
                mb: 2,
                width: 56,
                height: 56,
                bgcolor: "primary.main",
                boxShadow: (theme) =>
                  `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Typography
              component="h1"
              variant="h4"
              sx={{ mb: 0.5, color: "text.primary" }}
            >
              Welcome back
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ px: 1 }}>
              Sign in to manage tee time snipes and course preferences.
            </Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              fullWidth
              size="large"
              variant="contained"
              color="primary"
              startIcon={<GoogleIcon />}
              onClick={() => signIn(() => new GoogleAuthProvider())}
              sx={{ py: 1.25 }}
            >
              Continue with Google
            </Button>
            <Button
              fullWidth
              size="large"
              variant="outlined"
              color="primary"
              startIcon={<EmailIcon />}
              onClick={() => setOpenModal(true)}
              sx={{
                py: 1.25,
                borderWidth: 2,
                "&:hover": { borderWidth: 2 },
              }}
            >
              Email sign in
            </Button>
          </Stack>
          <EmailLoginModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onLogin={(email, password) =>
              logInWithEmailAndPassword({ email: email, password: password })
            }
            onRegister={(email, password) =>
              registerWithEmailAndPassword({
                email: email,
                password: password,
              })
            }
          />
        </Paper>
      </Container>
      <Copyright sx={{ mt: 4 }} />
    </Box>
  );
};

export default LoginPage;
