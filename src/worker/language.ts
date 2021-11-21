
const languageWorker = new Worker('language/worker.js')

export const detectLanguage = (doc: string) => new Promise<string>((resolve) => {
    languageWorker.onmessage = (event: MessageEvent<string>) => {
        resolve(event.data)
    }
    languageWorker.postMessage(doc)
})

const prettierWorker = new Worker('prettier/worker.js')

const formatCallback: {
    formatting: (() => boolean) | null,
    before: (() => void) | null,
    after: ((doc: string | null) => void) | null
} = { formatting: null, before: null, after: null }


export const setFormatState = (callback: (() => boolean) | null) => {
    formatCallback.formatting = callback
}


export const setPreFormatCallback = (callback: (() => void) | null) => {
    formatCallback.before = callback
}

export const setPostFormatCallback = (callback: ((doc: string | null) => void) | null) => {
    formatCallback.after = callback
}

export const formatScript = (languageId: string, doc: string) => {
    if (formatCallback.formatting && !formatCallback.formatting()) {
        if (formatCallback.before) formatCallback.before()
        prettierWorker.onmessage = (event: MessageEvent<string | null>) => {
            if (formatCallback.after) formatCallback.after(event.data)
        }
        prettierWorker.postMessage({ language: languageId, doc: doc })
    }
}