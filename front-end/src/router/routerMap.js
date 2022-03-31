import App from "../components/App";
import ErrorPage from "../components/ErrorPage/ErrorPage";
import Login from "../pages/Login";
import register from "../pages/Register"

export const routerMap = [
    {
        path: "/",
        component: App,
    },
    {
        path: "/mint",
        component: App,
        auth: true,
    },
    {
        path: "/upload_mint",
        component: App,
        auth: true,
    },
    {
        path: "/color_mint",
        component: App,
        auth: true,
    },
    {
        path: "/marketplace",
        component: App,
    },
    {
        path: "/my-tokens",
        component: App,
        auth: true,
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
        auth: true,
    },
    {
        path: "/404",
        component: ErrorPage,
    },
    {
        path: "/login",
        component: Login,
    },
    {
        path: "/register",
        component: register,
    }
]

export default routerMap;