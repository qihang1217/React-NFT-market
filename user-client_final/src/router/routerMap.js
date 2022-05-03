import loadable from "../utils/Loadable";

const App = loadable(() => import('../components/App'));
const register = loadable(() => import('../pages/Register'));
const Login = loadable(() => import('../pages/Login'));

export const routerMap = [
	{
		path: "/",
		component: App,
		exact: 'exact'
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
        path: "/queries",
        component: App,
    },
    {
        path: "/museum",
        component: App,
    },
	{
		path: "/space/:id",
		component: App,
		requiresAuth: true,
		children: [
			{
				path: '/space/:id/mintedTokens',
				component: App,
				requiresAuth: true,
			},
			{
				path: '/space/:id/allTokens',
				component: App,
				requiresAuth: true,
			},
			{
				path: '/space/:id/accountInfo',
				component: App,
				requiresAuth: true,
			},
			{
				path: '/space/:id/walletDetails',
				component: App,
				requiresAuth: true,
			},
		]
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
		path: "/ownedEverything/detail/:id",
		component: App,
	},
]

export default routerMap;