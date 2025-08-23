import { Alert, Snackbar } from "@mui/material";
import React from "react";
import useToastStore from "../../store/toastStore";

const DynamicToast = () => {
  const { open, message, severity, close } = useToastStore();
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={close}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={close} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default DynamicToast;
