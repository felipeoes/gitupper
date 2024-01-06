import { ThemeProvider } from "styled-components";
import {
  AuthProvider,
  NotificationsProvider,
  WorkersProvider,
} from "./contexts";
import AppRoutes from "./routes/index";
import { theme } from "./styles/theme";

function App() {
  // Taken from https://blog.guya.net/2015/06/12/sharing-sessionstorage-between-tabs-for-secure-multi-tab-authentication/
  // This is a secure way to share sessionStorage between tabs.
  if (typeof window !== "undefined") {
    if (!sessionStorage.length) {
      // Ask other tabs for session storage
      console.log("Calling getSessionStorage");
      localStorage.setItem("getSessionStorage", String(Date.now()));
    }

    window.addEventListener("storage", (event) => {
      console.log("storage event", event);
      if (event.key === "getSessionStorage") {
        // Some tab asked for the sessionStorage -> send it
        localStorage.setItem("sessionStorage", JSON.stringify(sessionStorage));
        localStorage.removeItem("sessionStorage");
      } else if (event.key === "sessionStorage" && !sessionStorage.length) {
        // sessionStorage is empty -> fill it
        const data = JSON.parse(event.newValue);
        for (let key in data) {
          sessionStorage.setItem(key, data[key]);
        }
      }

      localStorage.removeItem("getSessionStorage");
    });
  }

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <NotificationsProvider>
          <WorkersProvider>
            <AppRoutes />
          </WorkersProvider>
        </NotificationsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
