import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";

const Unauthorized: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background: "transparent",
      }}
    >
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: 4,
          maxWidth: 420,
          textAlign: "center",
          borderRadius: 3,
          boxShadow: "0 12px 40px rgba(15, 23, 42, 0.08)",
        }}
      >
        <LockIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Access restricted
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Your account is not authorized for this application. Contact an
          administrator if you believe this is a mistake.
        </Typography>
        <Button
          component={RouterLink}
          to="/login"
          variant="contained"
          color="primary"
          fullWidth
        >
          Back to sign in
        </Button>
      </Paper>
    </Box>
  );
};

export default Unauthorized;
