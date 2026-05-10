import { FC } from "react";
import { Typography } from "@mui/material";

const Copyright: FC<any> = (props: any) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ opacity: 0.85, letterSpacing: "0.01em" }}
      {...props}
    >
      {"Copyright © Engineered Cash Flow LLC "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default Copyright;
