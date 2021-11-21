
export const urlToBase64 = (url: string) => new Promise<string>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        canvas.getContext('2d')?.drawImage(img, 0, 0)
        resolve(canvas.toDataURL())
    }
    img.onerror = (e) => {
        reject(e)
    }
    img.src = url
})