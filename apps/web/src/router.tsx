import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { AuthGuard } from "./components/AuthGuard";
import { OnboardingGuard } from "./components/OnboardingGuard";
import { OnboardingPage } from "./pages/onboarding/OnboardingPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { CheckinPage } from "./pages/checkin/CheckinPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <AuthGuard /> },
      { path: "onboarding", element: <OnboardingPage /> },
      {
        element: <OnboardingGuard />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "checkin", element: <CheckinPage /> },
        ],
      },
    ],
  },
]);
