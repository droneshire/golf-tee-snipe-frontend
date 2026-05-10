import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string) => void;
}

const EmailLoginModal: React.FC<LoginModalProps> = ({
  open,
  onClose,
  onLogin,
  onRegister,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    onLogin(email, password);
    onClose();
  };

  const handleRegister = () => {
    onRegister(email, password);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { overflow: "hidden" } }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          background: (theme) =>
            `linear-gradient(125deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: "primary.contrastText",
        }}
      >
        Email sign in
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <DialogContentText sx={{ mb: 2 }}>
          Sign in with an existing account or register a new one.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={handleEmailChange}
          sx={{ mb: 1.5 }}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={handlePasswordChange}
          sx={{ mb: 1 }}
        />
        <Link to="/forgot-password">Forgot password?</Link>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 0, gap: 1 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleLogin} variant="contained" color="primary">
          Login
        </Button>
        <Button onClick={handleRegister} variant="outlined" color="primary">
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailLoginModal;
