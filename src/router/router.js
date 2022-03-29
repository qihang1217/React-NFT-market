import App from "../components/App";

export const mainRouters = [
    {
        path: "/",
        component: App,
        exact: true,
    },
    {
        path: "/mint",
        component: App,
    },
    {
        path: "/upload_mint",
        component: App,
    },
    {
        path: "/color_mint",
        component: App,
    },
    {
        path: "/upload",
        component: App,
    },
    {
        path: "/marketplace",
        component: App,
    },
    {
        path: "/my-tokens",
        component: App,
    },
    {
        path: "/queries",
        component: App,
    },
    {
        path: "/museum",
        component: App,
    },
    {
        path: "/my",
        component: App,
    },
]