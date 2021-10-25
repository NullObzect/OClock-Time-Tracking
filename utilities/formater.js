const Formater = {
  timeToHour: (time) => {
    const s = time.split(':')
    const hour = `${s[0]}hr`
    const minutes = `${s[1]}m`
    const result = `${hour} ${minutes}`
    return result
  },
}
module.exports = Formater
