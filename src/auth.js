const CLIENT_ID = '6e3aa9b4f44d4831bb14bf89730dd5fb'
const REDIRECT_URI = window.location.origin + '/callback'

const scope = ['user-read-playback-state', 'user-modify-playback-state', 'user-top-read']

const LOGIN_URL = `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scope.join(' ')}`

export const login = () => {
    return new Promise((resolve, reject) => {
        const popup = window.open(
            LOGIN_URL,
            '_blank',
            "popup=1,width=600,height=600,left=0,top=0"
            // ""
        )
        const listener = setInterval(() => {
            popup.postMessage('login', window.location)
            // window.onmessage = null   
        }, 1000);
    
        window.onmessage = event => {
            const {access_token, token_type, expires_in} = JSON.parse(event.data)
            clearInterval(listener)
            // console.log(access_token)
            resolve({
                'access_token': access_token,
                'token_type': token_type,
                'expires_in': expires_in,
            })
            window.onmessage = null   
        }
    })
}
