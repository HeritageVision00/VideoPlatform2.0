exports.genName = function (time, id) {
  let d = time
  let se = d.getSeconds()
  let mi = d.getMinutes()
  let ho = d.getHours()
  if (se < 10) {
    se = '0' + se
  }
  if (mi < 10) {
    mi = '0' + mi
  }
  if (ho < 10) {
    ho = '0' + ho
  }
  d =
    d.getFullYear() +
    '-' +
    (d.getMonth() + 1) +
    '-' +
    d.getDate() +
    '_' +
    ho +
    ':' +
    mi +
    ':' +
    se
  if (id !== undefined) {
    d = `${d}_${id}`
  }
  return d
}
