export function log(title, data = null){
    const today = new Date();
    const hours = ("00" + today.getHours()).slice(-2);
    const minutes = ("00" + today.getMinutes()).slice(-2);
    const seconds = ("00" + today.getSeconds()).slice(-2);
    const time = `${hours}:${minutes}:${seconds}`;
    const timestamp = `[${time}] ${title}`
    console.log('\x1b[32m%s\x1b[0m', timestamp);
    data? console.log(data) : {};
}