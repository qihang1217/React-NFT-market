import loadable from "../utils/Loadable";
import ProductDetail from "../components/ProductDetail/ProductDetail";
import MyAccountInformation from "../components/MyAccount/MyAccountInformation/MyAccountInformation";
import MyWalletDetails from "../components/MyAccount/MyWalletDetails/MyWalletDetails";

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
		path: "/my",
		component: App,
		requiresAuth: true,
		children: [
			{
				path: '/my/mintedTokens',
				component: App,
				requiresAuth: true,
			},
			{
				path: '/my/allTokens',
				component: App,
				requiresAuth: true,
			},
			{
				path: '/my/accountInfo',
				component: MyAccountInformation,
				requiresAuth: true,
			},
			{
				path: '/my/walletDetails',
				component: MyWalletDetails,
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