
importScripts('guesslang.js')

const guessLang = new GuessLang()

onmessage = (event) => {
    guessLang.runModel(event.data).then((result) => {
        if (result.length > 0) {
            if (result[0].confidence > 0.3) {
                postMessage(result[0].languageId)
            } else {
                postMessage('')
            }
        } else {
            postMessage('')
        }
    })
}

