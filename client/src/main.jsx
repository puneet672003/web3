import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { TransactoinProvider } from "./context/TrasactionContext";

ReactDOM.createRoot(document.getElementById("root")).render(
	<TransactoinProvider>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</TransactoinProvider>
);
