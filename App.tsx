import { PaperProvider } from "react-native-paper";
import { AuthenticatedUserProvider } from "./context/AuthenticatedUserProvider";
import RootNavigation from "./navigation/root";
import { darkTheme } from "./theme";

export default function App() {
  return (
    <PaperProvider theme={darkTheme}>
      <AuthenticatedUserProvider>
        <RootNavigation />
      </AuthenticatedUserProvider>
    </PaperProvider>
  );
}
