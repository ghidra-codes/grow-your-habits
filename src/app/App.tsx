import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import "../scss/main.scss";

import Routes from "./Routes";

const queryClient = new QueryClient();

function App() {
	return (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<Routes />
			</QueryClientProvider>
		</BrowserRouter>
	);
}

export default App;
