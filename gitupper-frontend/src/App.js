import { ThemeProvider } from "styled-components";
import { AuthProvider } from "./contexts/auth";
import AppRoutes from "./routes/index";
import { theme } from "./styles/theme";
import { NotificationsProvider } from "./contexts/notifications";

function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <ThemeProvider theme={theme}>
          <AppRoutes />
        </ThemeProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}

export default App;
