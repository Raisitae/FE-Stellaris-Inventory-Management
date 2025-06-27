import { SelectedProductsProvider } from "@/context/SelectedProductsContext";
import { TanstackQueryProvider } from "./query/QueryClientProvider";
import { TanstackRouterProvider } from "./router/RouterProvider";
import { BrowserRouter } from "react-router-dom";

export const AppProviders = () => {
  return (
    <BrowserRouter>
      <SelectedProductsProvider>
        <TanstackQueryProvider>
          <TanstackRouterProvider />
        </TanstackQueryProvider>
      </SelectedProductsProvider>
    </BrowserRouter>
  );
};
