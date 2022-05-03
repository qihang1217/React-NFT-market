import loadable from "../utils/Loadable";

const App = loadable(() => import('../components/App'));
const register = loadable(() => import('../pages/Register'));
const Login = loadable(() => import('../pages/Login'));
const ErrorPage = loadable(() => import('../components/ErrorPage/ErrorPage'));
const ProductDetail = loadable(() => import('../components/ProductDetail/ProductDetail'));

export const routerMap = [
	{
		path: "/",
		component: App,
    },
	{
		path: "/mint",
		component: App,
		requiresAuth: true,
	},
	{
		path: "/upload_mint",
		component: App,
		requiresAuth: true,
	},
	{
		path: "/color_mint",
		component: App,
		requiresAuth: true,
	},
    {
        path: "/marketplace",
        component: App,
    },
	{
		path: "/my-tokens",
		component: App,
		requiresAuth: true,
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
		path: "/space",
		component: App,
		requiresAuth: true,
		children: [
			{
				path: '/space/mintedTokens',
				component: App,
				requiresAuth: true,
			},
			{
				path: '/space/allTokens',
				component: App,
				requiresAuth: true,
			},
			{
				path: '/space/accountInfo',
				component: App,
				requiresAuth: true,
			},
			{
				path: '/space/walletDetails',
				component: App,
				requiresAuth: true,
			},
		]
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