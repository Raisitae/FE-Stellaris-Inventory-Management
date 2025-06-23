import { TanstackQueryProvider } from "./query/QueryClientProvider";
import { TanstackRouterProvider } from "./router/RouterProvider";

export const AppProviders = () => {
  return (
    <TanstackQueryProvider>
      <TanstackRouterProvider />
    </TanstackQueryProvider>
  );
};
