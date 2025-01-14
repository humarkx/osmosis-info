import "./wdyr"

import React from "react"
import ReactDOM from "react-dom"
import * as serviceWorker from "./serviceWorker"
import "./styles/index.css"
import "./styles/loader.css"
import "./styles/transitions.css"
import App from "./features/app/app"
import { ThemeCustomProvider } from "./contexts/ThemeProvider"
import { SettingsProviders } from "./contexts/SettingsProvider"
import { QueryClient, QueryClientProvider } from "react-query"

const queryClient = new QueryClient({
	defaultOptions: {
		queries: { refetchOnWindowFocus: false, staleTime: 5 * 60 * 1_000 },
	},
})

ReactDOM.render(
	<QueryClientProvider client={queryClient}>
		<SettingsProviders>
			<ThemeCustomProvider>
				<App />
			</ThemeCustomProvider>
		</SettingsProviders>
	</QueryClientProvider>,
	document.getElementById("root")
)

serviceWorker.unregister()
