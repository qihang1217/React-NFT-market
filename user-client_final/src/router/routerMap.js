import loadable from "../utils/Loadable";
import ProductDetail from "../components/ProductDetail/ProductDetail";

const App = loadable(() => import('../components/App'));
const register = loadable(() => import('../pages/Register'));
const Login = loadable(() => import('../pages/Login'));
const ErrorPage = loadable(() => import('../components/ErrorPage/ErrorPage'));

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
	},
	{
		path: "/ownedEverything/detail/",
		component: ProductDetail,
	},
]

export default routerMap;