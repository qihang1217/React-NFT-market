import store from 'store'

const USER_KEY = 'user_key'
const TOKEN_KEY = 'token_key'
const PRODUCT_KEY = 'product_key'
const FINISH_KEY = 'finish_key'

export default {
	/*
	保存user
	*/
	saveUser(user) {
		// localStorage.setItem(USER_KEY, JSON.stringify(User))
		store.set(USER_KEY, user)
	},
	
	/*
	返回一个user对象, 如果没有返回一个{}
	*/
	getUser() {
		// return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
		return store.get(USER_KEY) || {}
	},
	
	/*
	删除保存的user
	*/
	removeUser() {
		// localStorage.removeItem(USER_KEY)
		store.remove(USER_KEY)
	},
	
	/*
	保存token
	*/
	saveToken(token) {
		store.set(TOKEN_KEY, token)
	},
	
	/*
	返回一个token对象, 如果没有返回一个{}
	*/
	getToken() {
		return store.get(TOKEN_KEY) || ''
	},
	
	/*
	删除保存的token
	*/
	removeToken() {
		store.remove(TOKEN_KEY)
	},
	/*
	保存Products
	*/
	saveProducts(token) {
		store.set(PRODUCT_KEY, token)
	},
	
	/*
	返回一个Products对象
	*/
	getProducts() {
		return store.get(PRODUCT_KEY) || null
	},
	
	/*
	删除保存的Products
	*/
	removeProducts() {
		store.remove(PRODUCT_KEY)
	},
	
	/*
	保存Finish
	*/
	saveFinish(finish) {
		store.set(FINISH_KEY, finish)
	},
	
	/*
	返回一个Finish对象
	*/
	getFinish() {
		return store.get(FINISH_KEY) || false
	},
	
	/*
	删除保存的Finish
	*/
	removeFinish() {
		store.remove(FINISH_KEY)
	},
}