import NotificationProvider from "@/ui/notifications/NotificationProvider";
import * as Tooltip from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "../scss/main.scss";
import AppRoutes from "./AppRoutes";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Tooltip.Provider>
				<NotificationProvider />
				<AppRoutes />
			</Tooltip.Provider>
		</QueryClientProvider>
	);
}

export default App;
