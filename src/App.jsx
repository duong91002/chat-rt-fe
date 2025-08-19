import { useEffect, useState } from "react";
import AppRoutes from "./routes";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import CommonModal from "./components/modals/CommonModal";
import CommonToast from "./components/toasts/CommonToast";

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CommonModal />
      <CommonToast />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
