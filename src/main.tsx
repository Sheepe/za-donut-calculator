import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createTheme, MantineProvider } from "@mantine/core"
import App from "./components/app/App.tsx"
import "./main.css"
import { Notifications } from "@mantine/notifications"

const theme = createTheme({
    fontFamily:
        "Noto Sans, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    colors: {
        app: [
            "#e6f8ff",
            "#dbebf2",
            "#bcd2dd",
            "#9bb9c8",
            "#789fb3",
            "#6b96ac",
            "#608fa8",
            "#4e7c93",
            "#406f85",
            "#2d6077",
        ],
        donut: [
            "#f092ca",
            "#f0686c",
            "#e8ad44",
            "#738cf8",
            "#56c076",
            "#571D40",
            "#5D0A0C",
            "#5F3B00",
            "#0E1D5F",
            "#094A1D",
        ],
    },
})

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <MantineProvider theme={theme} defaultColorScheme="dark">
            <Notifications position="bottom-center" />
            <App />
        </MantineProvider>
    </StrictMode>
)
