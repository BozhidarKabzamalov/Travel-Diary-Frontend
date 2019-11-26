import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from './router'

//axios.defaults.baseURL = 'http://94.155.24.121/api';
axios.defaults.baseURL = process.env.VUE_APP_SERVER_API

Vue.use(Vuex)

const auth = {
    state: {
        token: null,
        username: null,
        userId: null
    },
    mutations: {
        authUser(state, userData){
            state.token = userData.token
            state.userId = userData.userId
            state.username = userData.username
        },
        clearAuthUser(state){
            state.token = null;
            state.userId = null;
            state.username = null;
        }
    },
    actions: {
        signup({commit}, data){
            axios.post('/signup', {
                username: data.username,
                password: data.password,
                email: data.email
            })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('username', response.data.username);
                commit('authUser', {
                    token: response.data.token,
                    userId: response.data.userId,
                    username: response.data.username
                })
                router.replace('/')
            });
        },
        signin({commit}, data){
            axios.post('/signin', {
                username: data.username,
                password: data.password
            })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('username', response.data.username);
                commit('authUser', {
                    token: response.data.token,
                    userId: response.data.userId,
                    username: response.data.username
                })
                router.replace('/' + response.data.username)
            }).catch((error) => console.log(error));
        },
        autoSignin({commit}, data){
            const token = localStorage.getItem('token')
            const userId = localStorage.getItem('userId')
            const username = localStorage.getItem('username')
            if (!token) {
                return
            }
            commit('authUser', {
                token: token,
                userId: userId,
                username: username
            })
        },
        logout({commit}){
            commit('clearAuthUser')
            localStorage.removeItem('token')
            localStorage.removeItem('userId')
            localStorage.removeItem('username')
            router.replace('/signin')
        }
    },
    getters: {
        isAuthenticated(state){
            return state.token !== null
        }
    }
}

export default new Vuex.Store({
    modules: {
        auth: auth
    }
})
