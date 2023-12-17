import React from "react";
import { StatusBar } from "expo-status-bar";
import * as Sentry from "sentry-expo";
import { AuthenticatedUserProvider } from "./context/AuthenticatedUserProvider";
import RootNavigation from "./navigation/root";
import { PaperProvider } from "react-native-paper";
import { darkTheme } from './theme';

Sentry.init({
  dsn: 'https://a2d97fb7a89d7738ac0f2425bf6aae4a@o4505711875588096.ingest.sentry.io/4505711934308352',
  enableInExpoDevelopment: true,
  enableTracing: true,
  enableAutoPerformanceTracing: true,
  enableCaptureFailedRequests: true,
  enableNativeCrashHandling: true,
  attachScreenshot: true,
  attachStacktrace: true,
  tracesSampleRate: 1.0,
  debug: true,
});

const App = () => {
  return (
    <PaperProvider theme={darkTheme}>
      <AuthenticatedUserProvider>
        <RootNavigation />
        <StatusBar style="inverted" />
      </AuthenticatedUserProvider>
    </PaperProvider>
  );
};

export default Sentry.Native.wrap(App);