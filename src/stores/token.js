import { defineStore } from 'pinia'

export const useTokenStore = defineStore('token', {
    state: () => ({
        access_token: '',
        token_type: '',
        expires_in: ''
    }),
    getters: {
        isAuthorised: (state) => {return state.access_token === '' ? false : true}
    },
    actions: {
        storeToken(access_token, token_type, expires_in){
            this.access_token = access_token
            this.token_type = token_type
            this.expires_in = expires_in
        },
        getToken(){
            return{
                'access_token': this.access_token,
                'token_type': this.token_type,
                'expires_in': this.expires_in,
            }
        },
        removeToken(){
            this.access_token = ''
            this.token_type = ''
            this.expires_in = ''
        }
    }
})