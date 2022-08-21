import { defineStore } from 'pinia'
import {useTokenStore} from './token'

export const usePlayerStore = defineStore('player', {
    state: () => ({
        songName: '',
        artists: [],
        coverImage: '',
        isPlaying: false,
        totalDuration: 0,
        currentProgress: 0,
        isOffline: false
    }),
    getters: {
        progressPercent: (state) => {
            return (state.currentProgress / state.totalDuration) * 100
        }
    },
    actions: {
        storePlayerState(songName, artists, coverImage, isPlaying, totalDuration, currentProgress){
            this.songName = songName
            this.artists = artists
            this.coverImage = coverImage
            this.isPlaying = isPlaying
            this.totalDuration = totalDuration
            this.currentProgress = currentProgress
        },
        updatePlayerState(){
            const tokenStore = useTokenStore()
            fetch('https://api.spotify.com/v1/me/player', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${tokenStore.token_type} ${tokenStore.access_token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                this.isOffline = false

                var songName = data.item.name
                var artists = []
                data.item.artists.forEach(item => {
                    artists.push(item.name)
                })
                var coverImage = data.item.album.images[1].url
                var isPlaying = data.is_playing
                var totalDuration = data.item.duration_ms
                var currentProgress = data.progress_ms
                
                this.storePlayerState(songName, artists, coverImage, isPlaying, totalDuration, currentProgress)
            })
            .catch(err => {
                this.isOffline = true
            })
        },
        playPause(){
            const tokenStore = useTokenStore()
            if(this.isPlaying){
                // pause
                fetch('https://api.spotify.com/v1/me/player/pause', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${tokenStore.token_type} ${tokenStore.access_token}`
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.error.reason === 'PREMIUM_REQUIRED'){
                        alert(data.error.message)
                    }
                })
            }else{
                // play
                fetch('https://api.spotify.com/v1/me/player/play', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${tokenStore.token_type} ${tokenStore.access_token}`
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.error.reason === 'PREMIUM_REQUIRED'){
                        alert(data.error.message)
                    }
                })
            }
        },
        previous(){
            const tokenStore = useTokenStore()
            fetch('https://api.spotify.com/v1/me/player/previous', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${tokenStore.token_type} ${tokenStore.access_token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.error.reason === 'PREMIUM_REQUIRED'){
                    alert(data.error.message)
                }
            })
        },
        next(){
            const tokenStore = useTokenStore()
            fetch('https://api.spotify.com/v1/me/player/next', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${tokenStore.token_type} ${tokenStore.access_token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.error.reason === 'PREMIUM_REQUIRED'){
                    alert(data.error.message)
                }
            })
        }
    }
})