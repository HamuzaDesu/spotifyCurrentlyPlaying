<script setup>
    var hash = window.location.hash.substring(1, window.location.hash.length)

    var splitHash = hash.split('&')

    splitHash.forEach((item, index) => {
        splitHash[index] = item.split('=')[1]
    })

    console.log(splitHash)
    // tokenStore.access_token = splitHash[0]
    // tokenStore.token_type = splitHash[1]
    // tokenStore.expires_in = splitHash[2]

    var token = {
        access_token: splitHash[0],
        token_type: splitHash[1],
        expires_in: splitHash[2]
    }
    // console.log(token)
    // tokenStore.storeToken(splitHash[0], splitHash[1], splitHash[2])
    // tokenStore.access_token = splitHash[0]
    // console.log(tokenStore.getToken())
    // window.close()

    window.addEventListener('message', event => {
        var message = event.data
        if(message === 'login'){
            event.source.postMessage(JSON.stringify(token), event.origin)
            window.close()
        }
    })
</script>

<template>
  <h1>Logging in...</h1>
</template>
