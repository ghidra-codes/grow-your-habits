import { BrowserRouter } from "react-router";
import Routes from "./routes";
import "../scss/main.scss";

function App() {
	return (
		<BrowserRouter>
			<Routes />
		</BrowserRouter>
	);
}

export default App;
