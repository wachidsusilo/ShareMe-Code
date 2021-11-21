
export const Log = (msg: any) => {
    if(process.env.NODE_ENV === 'development') {
        console.log(msg)
    }
}