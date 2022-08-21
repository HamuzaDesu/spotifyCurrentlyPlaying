<script setup>
    import {reactive, ref} from 'vue';
    import { login } from '../auth'
    import { useTokenStore } from '../stores/token';
    import {usePlayerStore} from '../stores/player'

    import SkipBack from '../components/icons/skip-back.vue'
    import Pause from '../components/icons/pause.vue'
    import Play from '../components/icons/play.vue'
    import SkipForward from '../components/icons/skip-forward.vue'  

    const tokenStore = useTokenStore()
    const playerStore = usePlayerStore()

    const websiteTitle = 'Spotify Currently Playing'

    const user = reactive({
        displayName: null,
        profilePicture: null
    })

    const authorise = () => {
        login()
        .then(data => {
            tokenStore.storeToken(data.access_token, data.token_type, data.expires_in)
            initialise()
        })
    }
    const logout = () => {
        tokenStore.removeToken()
    }
    const initialise = () => {

        fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${tokenStore.token_type} ${tokenStore.access_token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            user.displayName = data.display_name
            user.profilePicture = data.images[0].url
        })

        // player state
        setInterval(() => {
            playerStore.updatePlayerState()
        }, 1000);
    }

</script>

<template>
    <div class="login content" v-if="!tokenStore.isAuthorised">
        <h1 class="websiteTitle">{{websiteTitle}}</h1>
        <button @click="authorise">Login</button>
    </div>

    <div class="content" v-else>
        <div class="header">
            <h1 class="websiteTitle">{{websiteTitle}}</h1>

            <div class="profile">
                <img class="profilePicture" :src="user.profilePicture" alt="">
                <h1 class="userName">{{user.displayName}}</h1>
            </div>

            <small>Please note that you need Spotify Premium to be able to use the player controls</small>

            <button @click="logout">Logout</button>

            <!-- <button @click="nom">nom</button> -->
        </div>
    
        <div class="player" v-if="!playerStore.isOffline">
            <h1 class="songName">{{playerStore.songName}}</h1>
            <h3 class="artists">{{playerStore.artists.join(', ')}}</h3>
            <img class="coverImage" :src="playerStore.coverImage" alt="">
    
            <div class="playerControls">
                <div class="buttons">
                    <button @click="playerStore.previous"><SkipBack></SkipBack></button>
                    <button @click="playerStore.playPause" v-if="playerStore.isPlaying"><Pause></Pause></button>
                    <button @click="playerStore.playPause" v-if="!playerStore.isPlaying"><Play></Play></button>
                    <button @click="playerStore.next"><SkipForward></SkipForward></button>
                </div>

                <div class="progressBar">
                    <div class="progress" :style="`width: ${playerStore.progressPercent}%`"></div>
                </div>
            </div>
        </div>
        <div class="centreText" v-else>Nothing playing right now!</div>
    </div>

    <!-- <p>{{tokenStore.access_token}}</p> -->
</template>

<style scoped>
    .login{
        height: 100vh;
        width: 100vw;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .content{
        height: 100vh;
        width: 100vw;

        display: flex;
    }
    .header{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        width: 50vw;
        margin: 0%;
        border-right: 1px solid var(--color-text);
    }

    .profile{
        /* margin-left: auto; */
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top: 2rem;
        width: 50vw;
        margin-bottom: 1rem;
    }
    .profilePicture{
        object-fit: cover;
        height: 64px;
        width: 64px;
        border-radius: 50%;
    }
    .userName{
        padding-left: 1rem;
    }
    .player{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        width: 50vw;
    }
    .coverImage{
        height: 300px;
        width: 300px;
        border-radius: 10%;
    }
    .playerControls{
        /* margin-top: 1rem; */
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        
        justify-content: center;
    }
    .progressBar{
        height: 10px;
        width: 75%;
        background: var(--color-text);
        border-radius: 50px;
    }
    .progress{
        height: 10px;
        background: var(--color-heading);
        border-radius: 50px;
    }
    .artists{
        margin-bottom: 1rem;
    }
    .centreText{
        width: 100%;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    button{
        height: fit-content;
        background: none;
        color: inherit;
        border: none;
        font: inherit;
        cursor: pointer;
        outline: inherit;

        margin: 1rem;
        padding: 5px;
        /* margin-left: 1rem; */
        transition: all 500ms;
    }
    button:hover{
        background: black;
    }
    small{
        width: 25%;
        
    }
</style>
