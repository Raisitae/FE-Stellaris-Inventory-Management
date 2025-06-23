// lib/RouterProvider.tsx
import { RouterProvider } from "@tanstack/react-router";
import { router } from "../../router";

export const TanstackRouterProvider = () => {
  return <RouterProvider router={router} />;
};
