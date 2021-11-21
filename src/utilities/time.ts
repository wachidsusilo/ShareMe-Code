
export const getCurrentTime = () => {
    return new Date().getTime()
}

const padStart = (value: number) => {
    return value.toString().padStart(2, '0')
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']
const fullMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

export const parseDate = (millis: number) => {
    const date = new Date()
    date.setTime(millis)
    return `${padStart(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()}, ${padStart(date.getHours())}:${padStart(date.getMinutes())}`
}

export const parseFullDate = (millis: number) => {
    const date = new Date()
    date.setTime(millis)
    return `${padStart(date.getDate())} ${fullMonths[date.getMonth()]} ${date.getFullYear()}, ${padStart(date.getHours())}:${padStart(date.getMinutes())}`
}