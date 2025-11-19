import { BrowserRouter } from "react-router";
import "../scss/main.scss";

import Routes from "./Routes";

function App() {
	return (
		<BrowserRouter>
			<Routes />
		</BrowserRouter>
	);
}

export default App;
