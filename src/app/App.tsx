import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Tooltip from "@radix-ui/react-tooltip";
import "../scss/main.scss";

import AppRoutes from "./AppRoutes";
import NotificationProvider from "@/ui/notifications/NotificationProvider";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Tooltip.Provider delayDuration={150}>
				<NotificationProvider />
				<AppRoutes />
			</Tooltip.Provider>
		</QueryClientProvider>
	);
}

export default App;
