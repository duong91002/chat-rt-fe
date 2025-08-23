import { useEffect, useState } from "react";
import AppRoutes from "./routes";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import DynamicModal from "./components/modals/DynamicModal";
import DynamicToast from "./components/toasts/DynamicToast";

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DynamicModal />
      <DynamicToast />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
