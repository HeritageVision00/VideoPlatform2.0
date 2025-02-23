require('dotenv').config({
  path: '../../../config.env'
})
const db1 = require('../models')
var jwt = require('jsonwebtoken')
var db = require('../models/dbmysql')
const Relation = db1.relation
const genName = require('../helpers/name')
const graph = require('../helpers/graphRess')

exports.climbingBarricade = async (req, res) => {
    let token = req.headers['x-access-token']
    const data = req.body
    jwt.verify(token, process.env.secret, async (err, decoded) => {
      let wh
      if (decoded.id_branch != 0000) {
        wh = {
          id_branch: decoded.id_branch,
          algo_id: 1
        }
      } else {
        wh = {
          id_account: decoded.id_account,
          algo_id: 1
        }
      }
      Relation.findOne({
        where: wh
      })
        .then(async rel => {
          await db
            .con()
            .query(
              `SELECT * from climbingbarricade WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
              function (err, result) {
                if (err)
                  return res.status(500).json({
                    success: false,
                    message: err
                  })
                let days = Math.round(
                  (new Date(data.end) - new Date(data.start)) / (1000 * 60 * 60 * 24)
                )
                let avg = 0
                let min = 0
                let max = 0
                var ress = {}
                var dwell = []
                var labelsD = []
                result.forEach(function (v) {
                  ress[v.time.getHours()] = (ress[v.time.getHours()] || 0) + 1
                  dwell.push(v.dwell)
                  labelsD.push(v.time)
                  avg = avg + v.dwell
                  if (min == 0) {
                    min = v.dwell
                  } else if (v.dwell < min) {
                    min = v.dwell
                  }
                  if (max == 0) {
                    max = v.dwell
                  } else if (v.dwell > max) {
                    max = v.dwell
                  }
                  let d = v.time
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
                  v.picture = `${d}_${v.track_id}.jpg`
                  v.movie = `${d}_${v.track_id}_video.mp4`
                  //v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/climbingbarricade/${req.params.id}/${v.movie}`
                  v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/climbingbarricade/${req.params.id}/${v.picture}`
                  let l = v.dwell / rel.atributes[1].time - 1
                  if (l >= 2) {
                    l = 2
                  }
                  let r
                  switch (l) {
                    case 0: {
                      r = 'Low'
                      break
                    }
                    case 1: {
                      r = 'Med'
                      break
                    }
                    case 2: {
                      r = 'High'
                      break
                    }
                  }
                  v['severity'] = l
                  v['alert'] = r
                })
                avg = Math.round((avg / result.length) * 100) / 100
                let av = result.length / (24 * days)
                let a = {
                  total: result.length,
                  avgH: Math.round(av * 100) / 100,
                  avgS: Math.round((av / (60 * 60)) * 100) / 100,
                  raw: result,
                  dwell: dwell,
                  labelsD: labelsD,
                  histogram: ress,
                  min: min,
                  max: max,
                  avg: avg
                }
                res.status(200).json({
                  success: true,
                  data: a
                })
              }
            )
        })
        .catch(err => {
          return res.status(500).send({
            success: false,
            message: err
          })
        })
    })
  }

exports.loitering = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    let wh
    if (decoded.id_branch != 0000) {
      wh = {
        id_branch: decoded.id_branch,
        algo_id: 2
      }
    } else {
      wh = {
        id_account: decoded.id_account,
        algo_id: 2
      }
    }
    Relation.findOne({
      where: wh
    })
      .then(async rel => {
        await db
          .con()
          .query(
            `SELECT * from loitering WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
            function (err, result) {
              if (err)
                return res.status(500).json({
                  success: false,
                  message: err
                })
              let days = Math.round(
                (new Date(data.end) - new Date(data.start)) / (1000 * 60 * 60 * 24)
              )
              let avg = 0
              let min = 0
              let max = 0
              var ress = {}
              var dwell = []
              var labelsD = []
              result.forEach(function (v) {
                ress[v.time.getHours()] = (ress[v.time.getHours()] || 0) + 1
                dwell.push(v.dwell)
                labelsD.push(v.time)
                avg = avg + v.dwell
                if (min == 0) {
                  min = v.dwell
                } else if (v.dwell < min) {
                  min = v.dwell
                }
                if (max == 0) {
                  max = v.dwell
                } else if (v.dwell > max) {
                  max = v.dwell
                }
                let d = v.time
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
                v.picture = `${d}_${v.track_id}.jpg`
                v.movie = `${d}_${v.track_id}_video.mp4`
                //v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/loitering/${req.params.id}/${v.movie}`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/loitering/${req.params.id}/${v.picture}`
                let l = v.dwell / rel.atributes[1].time - 1
                if (l >= 2) {
                  l = 2
                }
                let r
                switch (l) {
                  case 0: {
                    r = 'Low'
                    break
                  }
                  case 1: {
                    r = 'Med'
                    break
                  }
                  case 2: {
                    r = 'High'
                    break
                  }
                }
                v['severity'] = l
                v['alert'] = r
              })
              avg = Math.round((avg / result.length) * 100) / 100
              let av = result.length / (24 * days)
              let a = {
                total: result.length,
                avgH: Math.round(av * 100) / 100,
                avgS: Math.round((av / (60 * 60)) * 100) / 100,
                raw: result,
                dwell: dwell,
                labelsD: labelsD,
                histogram: ress,
                min: min,
                max: max,
                avg: avg
              }
              res.status(200).json({
                success: true,
                data: a
              })
            }
          )
      })
      .catch(err => {
        return res.status(500).send({
          success: false,
          message: err
        })
      })
  })
}

exports.loiteringAlerts = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.query
  let id = Array.isArray(data.id) ? data.id[data.id.length - 1] : data.id
  let type = Array.isArray(data.type) ? data.type[data.type.length - 1] : data.type
  let start = Array.isArray(data.start) ? data.start[data.start.length - 1] : data.start
  let end = Array.isArray(data.end) ? data.end[data.end.length - 1] : data.end
  let page = parseInt(data._page)
  let limit = parseInt(data._limit)
  let offset = row_count === page * limit ? (page - 1) * limit : (page - 1) * limit
  let _sort = Array.isArray(data._sort) ? data._sort[data._sort.length - 1] : data._sort
  let _order = Array.isArray(data._order) ? data._order[data._order.length - 1] : data._order
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    let wh
    if (decoded.id_branch != 0000) {
      wh = {
        id_branch: decoded.id_branch,
        algo_id: 2
      }
    } else {
      wh = {
        id_account: decoded.id_account,
        algo_id: 2
      }
    }
    Relation.findOne({
      where: wh
    })
      .then(async rel => {
        await db
          .con()
          .query(
            `SELECT * from loitering WHERE ${type} = '${id}' and time >= '${start}' and  time <= '${end}' order by ${_sort} ${_order} LIMIT ${limit} OFFSET ${offset};`,
            function (err, result) {
              if (err)
                return res.status(500).json({
                  success: false,
                  message: err
                })
              let days = Math.round(
                (new Date(data.end) - new Date(data.start)) / (1000 * 60 * 60 * 24)
              )
              let avg = 0
              let min = 0
              let max = 0
              var ress = {}
              var dwell = []
              var labelsD = []
              result.forEach(function (v) {
                ress[v.time.getHours()] = (ress[v.time.getHours()] || 0) + 1
                dwell.push(v.dwell)
                labelsD.push(v.time)
                avg = avg + v.dwell
                if (min == 0) {
                  min = v.dwell
                } else if (v.dwell < min) {
                  min = v.dwell
                }
                if (max == 0) {
                  max = v.dwell
                } else if (v.dwell > max) {
                  max = v.dwell
                }
                let d = v.time
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
                v['picture'] = `${d}_${v.track_id}.jpg`
                let l = v.dwell / rel.atributes[1].time - 1
                if (l >= 2) {
                  l = 2
                }
                let r
                switch (l) {
                  case 0: {
                    r = 'Low'
                    break
                  }
                  case 1: {
                    r = 'Med'
                    break
                  }
                  case 2: {
                    r = 'High'
                    break
                  }
                }
                v['severity'] = l
                v['alert'] = r
                v['clip_path'] = `${d}_${v.track_id}.mp4`
              })
              avg = Math.round((avg / result.length) * 100) / 100
              let av = result.length / (24 * days)
              let a = {
                total: result.length,
                avgH: Math.round(av * 100) / 100,
                avgS: Math.round((av / (60 * 60)) * 100) / 100,
                raw: result,
                dwell: dwell,
                labelsD: labelsD,
                histogram: ress,
                min: min,
                max: max,
                avg: avg
              }
              res.status(200).json({
                success: true,
                data: a
              })
            }
          )
      })
      .catch(err => {
        return res.status(500).send({
          success: false,
          message: err
        })
      })
  })
}

exports.intrude = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    let wh
    if (decoded.id_branch != 0000) {
      wh = {
        id_branch: decoded.id_branch,
        algo_id: 17
      }
    } else {
      wh = {
        id_account: decoded.id_account,
        algo_id: 17
      }
    }
    Relation.findOne({
      where: wh
    })
      .then(async rel => {
        await db
          .con()
          .query(
            `SELECT * from intrude WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
            function (err, result) {
              if (err)
                return res.status(500).json({
                  success: false,
                  message: err
                })
              let days = Math.round(
                (new Date(data.end) - new Date(data.start)) / (1000 * 60 * 60 * 24)
              )
              let ress = {}
              let avg = 0
              let cache = ''
              let ressover = {}
              result.forEach(function (v) {
                if (cache == '') {
                  cache =
                    v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                }

                if (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  while (
                    cache !=
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ) {
                    let t = new Date(cache + ':00:00').getTime()
                    t += 60 * 60 * 1000
                    cache = new Date(t)
                    ressover[
                      cache.getFullYear() +
                        '-' +
                        (cache.getMonth() + 1) +
                        '-' +
                        cache.getDate() +
                        ' ' +
                        cache.getHours()
                    ] = 0
                    cache =
                      cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  }
                }
                if (
                  cache ==
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  ressover[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] =
                    (ressover[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] || 0) + 1
                }
                ress[v.zone] = (ress[v.zone] || 0) + 1
                avg = avg + v.dwell
                let d = v.time
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
                v['picture'] = `${d}_${v.track_id}_zone${v.zone}.jpg`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/intrude/${req.params.id}/${v.picture}`
                v.movie = `${d}_${v.track_id}_video.mp4`
                v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/intrude/${req.params.id}/${v.movie}`
              })
              let lo = []
              for (var l of Object.keys(ress)) {
                lo.push({
                  name: l,
                  value: ress[l],
                  perc: JSON.stringify(Math.round((ress[l] / result.length) * 100)) + '%'
                })
              }
              let av = result.length / (24 * days)
              let a = {
                total: result.length,
                avgH: Math.round(av * 100) / 100,
                raw: result,
                donut: lo,
                over: ressover
              }
              res.status(200).json({
                success: true,
                data: a
              })
            }
          )
      })
      .catch(err => {
        return res.status(500).send({
          success: false,
          message: err
        })
      })
    /* jwt.verify(token, process.env.secret, async (err, decoded) => {
    await db
      .con()
      .query(
        `SELECT * from intrude WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err)
            return res.status(500).json({
              success: false,
              message: err
            })
          let days = Math.round((new Date(data.end) - new Date(data.start)) / (1000 * 60 * 60 * 24))
          let ress = {}
          let avg = 0
          let cache = ''
          let ressover = {}
          result.forEach(function (v) {
            if (cache == '') {
              cache =
                v.time.getFullYear() +
                '-' +
                (v.time.getMonth() + 1) +
                '-' +
                v.time.getDate() +
                ' ' +
                v.time.getHours()
            }

            if (
              cache !=
              v.time.getFullYear() +
                '-' +
                (v.time.getMonth() + 1) +
                '-' +
                v.time.getDate() +
                ' ' +
                v.time.getHours()
            ) {
              while (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                let t = new Date(cache + ':00:00').getTime()
                t += 60 * 60 * 1000
                cache = new Date(t)
                ressover[
                  cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                ] = 0
                cache =
                  cache.getFullYear() +
                  '-' +
                  (cache.getMonth() + 1) +
                  '-' +
                  cache.getDate() +
                  ' ' +
                  cache.getHours()
              }
            }
            if (
              cache ==
              v.time.getFullYear() +
                '-' +
                (v.time.getMonth() + 1) +
                '-' +
                v.time.getDate() +
                ' ' +
                v.time.getHours()
            ) {
              ressover[
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ] =
                (ressover[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] || 0) + 1
            }
            ress[v.zone] = (ress[v.zone] || 0) + 1
            avg = avg + v.dwell
            let d = v.time
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
            v['picture'] = `${d}_${v.track_id}_zone${v.zone}.jpg`
            v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/intrude/${req.params.id}/${v.picture}`
            if (rel.atributes[0].time > 0) {
              v.clip_path = `${d}_${v.track_id}_zone${v.zone}.mp4`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/intrude/${req.params.id}/${v.clip_path}`
            }
          })
          let lo = []
          for (var l of Object.keys(ress)) {
            lo.push({
              name: l,
              value: ress[l],
              perc: JSON.stringify(Math.round((ress[l] / result.length) * 100)) + '%'
            })
          }
          let av = result.length / (24 * days)
          let a = {
            total: result.length,
            avgH: Math.round(av * 100) / 100,
            raw: result,
            donut: lo,
            over: ressover
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  }) */
  })
}

exports.violence = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    await db
      .con()
      .query(
        `SELECT * from violence WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err)
            return res.status(500).json({
              success: false,
              message: err
            })
          let ress = {}
          let cache = ''
          for (var v of result) {
            if (cache == '') {
              cache =
                v.time.getFullYear() +
                '-' +
                (v.time.getMonth() + 1) +
                '-' +
                v.time.getDate() +
                ' ' +
                v.time.getHours()
            }

            if (
              cache !=
              v.time.getFullYear() +
                '-' +
                (v.time.getMonth() + 1) +
                '-' +
                v.time.getDate() +
                ' ' +
                v.time.getHours()
            ) {
              while (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                let t = new Date(cache + ':00:00').getTime()
                //Add one hours to date
                t += 60 * 60 * 1000
                cache = new Date(t)
                ress[
                  cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                ] = 0
                cache =
                  cache.getFullYear() +
                  '-' +
                  (cache.getMonth() + 1) +
                  '-' +
                  cache.getDate() +
                  ' ' +
                  cache.getHours()
              }
            }
            if (
              cache ==
              v.time.getFullYear() +
                '-' +
                (v.time.getMonth() + 1) +
                '-' +
                v.time.getDate() +
                ' ' +
                v.time.getHours()
            ) {
              ress[
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ] =
                (ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] || 0) + 1
            }
            let d = v.time
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
            v['picture'] = `${d}_${v.id}.jpg`
            v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/violence/${req.params.id}/${v.picture}`
            // if (rel.atributes[0].time > 0) {
            v.movie = `${d}_${v.id}_movie.mp4`
            v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/violence/${req.params.id}/${v.movie}`
            // }
          }
          let a = {
            total: result.length,
            raw: result,
            over: ress
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.aod = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 16,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from aod WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            console.log(result)
            console.log( `SELECT * from aod WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`)
            if (err)
              return res.status(500).json({
                success: false,
                message: err
              })
            let ress = {}
            let cache = ''
            for (var v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  //Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] = 0
                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  (ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] || 0) + 1
              }
              let d = v.time
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
              v['picture'] = `${d}_${v.id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/aod/${req.params.id}/${v.picture}`
              v.movie = `${d}_${v.id}_video.mp4`
              v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/aod/${req.params.id}/${v.movie}`
            }
            const a = {
              total: result.length,
              raw: result,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.covered = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 20,
        camera_id: req.params.id
      }
    })
      .then(async rel => {
        await db
          .con()
          .query(
            `SELECT * from mask WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
            function (err, result) {
              if (err)
                return res.status(500).json({
                  success: false,
                  message: err
                })
              let ress = {}
              let cache = ''
              for (var v of result) {
                if (cache == '') {
                  cache =
                    v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                }

                if (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  while (
                    cache !=
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ) {
                    let t = new Date(cache + ':00:00').getTime()
                    //Add one hours to date
                    t += 60 * 60 * 1000
                    cache = new Date(t)
                    ress[
                      cache.getFullYear() +
                        '-' +
                        (cache.getMonth() + 1) +
                        '-' +
                        cache.getDate() +
                        ' ' +
                        cache.getHours()
                    ] = 0
                    cache =
                      cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  }
                }
                if (
                  cache ==
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] =
                    (ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] || 0) + 1
                }
                let d = v.time
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
                v.picture = `${d}_${v.id}.jpg`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/mask/${req.params.id}/${v.picture}`
                // console.log(rel)
                // if (rel.atributes[0].time > 0) {
                v.movie = `${d}_${v.id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/mask/${req.params.id}/${v.movie}`
                // }
              }
              let a = {
                total: result.length,
                raw: result,
                over: ress
              }
              res.status(200).json({
                success: true,
                data: a,
                rel: rel
              })
            }
          )
      })
      .catch(err => {
        return res.status(500).json({success: false, mess: err})
      })
  })
}

exports.social = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    await db
      .con()
      .query(
        `SELECT * from sociald where ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err)
            return res.status(500).json({
              success: false,
              message: err
            })
          let ress = {
            0: 0,
            1: 0,
            2: 0
          }
          let ressover = {}
          let cache = ''
          result.forEach(function (v) {
            if (cache == '') {
              cache =
                v.time.getFullYear() +
                '-' +
                (v.time.getMonth() + 1) +
                '-' +
                v.time.getDate() +
                ' ' +
                v.time.getHours()
            }

            if (
              cache !=
              v.time.getFullYear() +
                '-' +
                (v.time.getMonth() + 1) +
                '-' +
                v.time.getDate() +
                ' ' +
                v.time.getHours()
            ) {
              while (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                let t = new Date(cache + ':00:00').getTime()
                //Add one hours to date
                t += 60 * 60 * 1000
                cache = new Date(t)
                ressover[
                  cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                ] = 0
                cache =
                  cache.getFullYear() +
                  '-' +
                  (cache.getMonth() + 1) +
                  '-' +
                  cache.getDate() +
                  ' ' +
                  cache.getHours()
              }
            }
            if (
              cache ==
              v.time.getFullYear() +
                '-' +
                (v.time.getMonth() + 1) +
                '-' +
                v.time.getDate() +
                ' ' +
                v.time.getHours()
            ) {
              ressover[
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ] =
                (ressover[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] || 0) + 1
            }
            ress[v.alert_type] = (ress[v.alert_type] || 0) + 1
            let d = v.time
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
            v.picture = `${d}_${v.trackid}.jpg`
            v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/social/${req.params.id}/${v.picture}`
            if (rel.atributes[0].time > 0) {
              v.clip_path = `${d}_${v.trackid}.mp4`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/social/${req.params.id}/${v.clip_path}`
            }
          })
          let a = {
            total: result.length,
            raw: result,
            types: ress,
            over: ressover
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.pc = async (req, res) => {
  const data = req.body
  const ressEn = {}
  const ressEx = {}
  var avgi = 0
  var mini = 0
  var maxi = 0
  var avgen = 0
  var minen = 0
  var maxen = 0
  var avgex = 0
  var minex = 0
  var maxex = 0
  var ins = 0
  var totalEn = 0
  var totalEx = 0
  const label = []
  const dain = []
  const daen = []
  const daex = []
  Relation.findOne({
    where: {
      algo_id: 12,
      camera_id: req.params.id
    }
  })
    .then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from crowd_count WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err)
              return res.status(500).json({
                success: false,
                message: err
              })
            result.forEach(function (v) {
              ressEn[
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ] = v.people_count
              ressEx[
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ] = v.people_count
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.movie = `${d}_${v.track_id}_video.mp4`
              label.push(v.time)
              dain.push(v['people_count'])
              daen.push(v['people_count'])
              daex.push(v['people_count'])
              // v['picture'] = 'name.jpg'
              v['inside'] = v['people_count']
              avgi = avgi + v['inside']
              if (mini == 0) {
                mini = v['inside']
              } else if (v['inside'] < mini) {
                mini = v['inside']
              }
              if (maxi == 0) {
                maxi = v['inside']
              } else if (v['inside'] > maxi) {
                maxi = v['inside']
              }
              avgen = avgen + v.count2
              if (minen == 0) {
                minen = v.count2
              } else if (v.count2 < minen) {
                minen = v.count2
              }
              if (maxen == 0) {
                maxen = v.count2
              } else if (v.count2 > maxen) {
                maxen = v.count2
              }
              avgex = avgex + v.count1
              if (minex == 0) {
                minex = v.count1
              } else if (v.count1 < minex) {
                minex = v.count1
              }
              if (maxex == 0) {
                maxex = v.count1
              } else if (v.count1 > maxex) {
                maxex = v.count1
              }
            })
            avgi = Math.round((avgi / result.length) * 100) / 100
            avgen = Math.round((avgen / result.length) * 100) / 100
            avgex = Math.round((avgex / result.length) * 100) / 100
            if (result.length != 0) {
              ins = result[result.length - 1]['people_count']
              totalEn = result[result.length - 1]['people_count']
              totalEx = result[result.length - 1]['people_count']
            }
            if (ins < 0) {
              ins = JSON.stringify(ins * -1) + ' exiting'
            }
            let a = {
              totalEn: totalEn,
              totalEx: totalEx,
              in: ins,
              avg: {
                in: avgi,
                en: avgen,
                ex: avgex
              },
              min: {
                in: mini,
                en: minen,
                ex: minex
              },
              max: {
                in: maxi,
                en: maxen,
                ex: maxex
              },
              raw: result,
              histogramEn: ressEn,
              histogramEx: ressEx,
              label: label,
              dataIn: dain,
              dataEn: daen,
              dataEx: daex
            }
            if (result.length == 0) {
              return res.status(200).json({
                success: true,
                data: a
              })
            }
            res.status(200).json({
              success: true,
              data: a,
              rel: rel
            })
          }
        )
    })
    .catch(err => {
      res.status(500).json({success: false, mess: err})
    })
}

exports.tamper = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 27,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from alerts WHERE alert= 'tamper' and ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err)
              return res.status(500).json({
                success: false,
                message: err
              })
            let ress = {}
            let cache = ''
            for (var v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  //Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] = 0
                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  (ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] || 0) + 1
              }
              let d = v.time
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
              v.picture = `${d}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/alerts/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/alerts/${req.params.id}/${v.clip_path}`
              }
            }
            let a = {
              total: result.length,
              raw: result,
              over: ress,
              rel: rel
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.helm = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 23,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from helmet where ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err)
              return res.status(500).json({
                success: false,
                message: err
              })
            let ress = {}
            let cache = ''
            for (var v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  //Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] = 0
                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  (ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] || 0) + 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.trackid}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/helm/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.trackid}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/helm/${req.params.id}/${v.clip_path}`
              }
            }
            let a = {
              total: result.length,
              raw: result,
              over: ress,
              rel: rel
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

function display(seconds) {
  const format = val => `0${Math.floor(val)}`.slice(-2)
  const hours = seconds / 3600
  const minutes = (seconds % 3600) / 60

  return [hours, minutes, seconds % 60].map(format).join(':')
}

exports.queue = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    let id = 22
    if(data.ham === true){
      id = 68
    }
    Relation.findOne({
      where: {
        algo_id: id,
        camera_id: req.params.id
      }
    }).then(async rel => {
      const count = await Relation.count({
        where: {
          algo_id: id,
          camera_id: req.params.id
        }
      });
      await db
        .con()
        .query(
          `SELECT * from queue_mgt WHERE ${data.type} = '${req.params.id}' and start_time >= '${data.start}' and  start_time <= '${data.end}' order by start_time asc;`,
          async function (err, result) {
            if (err || result.length === 0)
              return res.status(500).json({
                success: false,
                message: err
              })
            const diff = Math.ceil((new Date(data.end) - new Date(data.start)) / (1000 * 3600 * 24));
            let cache = '', range, cou = 0
            if(diff === 1){
              range = 30 * 60 * 1000
            }else if(diff >= 1 && diff <= 3){
              range = 2 * 60 * 60 * 1000
            }else if(diff >= 3 && diff <= 7){
              range = 4 * 60 * 60 * 1000
            }else if(diff >= 7 && diff <= 14){
              range = 8 * 60 * 60 * 1000
            }else if(diff >= 14 && diff <= 32){
              range = 24 * 60 * 60 * 1000
            }
            cache = new Date(data.start).getTime()
            let countIn = 0
            let countAll = {}, timesAv = {}, avgs = []
            let dataAlertsMed = [], dataAlertsHigh = [], dataAlertsLow = [], dataPeople = {}
            for(let i = 1; i <= count; i++){
              avgs[i - 1] = 0
              timesAv[i] = 0
              countAll[i] = 0
              dataAlertsMed.push({})
              dataAlertsHigh.push({})
              dataAlertsLow.push({})
            }
            const label = []
            const labelPeople = []
            let avg = 0
            let min = 0
            let max = 0
            let minQ, maxQ
            let times = []
            for (var v of result) {
              if (v.queuing == 1) {
                countAll[v.qid] = (countAll[v.qid] || 0) + 1
                countIn++
              } else {
                v['wait'] = (v.end_time - v.start_time) / 1000
                v['wait'] = display(v['wait'])
                times.push({
                  time: (v.end_time - v.start_time) / 60000,
                  queue: v.qid
                })
              }
              let d = v.start_time
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
              v['picture'] = `${d}_${v.id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/queue/${req.params.id}/${v.picture}`
              v.movie = `${d}_${v.id}_video.mp4`
              v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/queue/${req.params.id}/${v.movie}`
              if(v.queuing == 1){
                if (
                  cache < v.start_time.getTime()
                ) {
                  while (
                    cache < v.start_time.getTime()
                  ) {
                    cache = new Date(cache)
                    dataPeople[cache.getFullYear() + '-' + (cache.getMonth() + 1) +  '-' + cache.getDate() + ' ' + cache.getHours() + ':' + cache.getMinutes()] = 0
                    cache = cache.getTime()
                    cache += range
                  }
                }
                if (
                  cache >= v.start_time.getTime()
                ) {
                  let t = cache
                  t -= range
                  t = new Date(t)
                  dataPeople[t.getFullYear() + '-' + (t.getMonth() + 1) + '-' +  t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes()] = (dataPeople[ t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes() ] || 0) + 1    
                }
                labelPeople.push(v.start_time)
                cou++
              }
            }
            if(cou === countIn){
              while (
                cache <= new Date(data.end)
              ) {
                cache = new Date(cache)
                dataPeople[cache.getFullYear() + '-' + (cache.getMonth() + 1) +  '-' + cache.getDate() + ' ' + cache.getHours() + ':' + cache.getMinutes()] = 0
                cache = cache.getTime()
                cache += range
              }
            }
            for (var e of times) {
              avgs[e.queue - 1] = avgs[e.queue - 1] + e.time
              avg = avg + e.time
              timesAv[e.queue] = (timesAv[e.queue] || 0 ) + 1
              if (min == 0) {
                min = e.time
                minQ = e.queue
              } else if (e.time < min) {
                min = e.time
                minQ = e.queue
              }
              if (max == 0) {
                max = e.time
                maxQ = e.queue
              } else if (e.time > max) {
                max = e.time
                maxQ = e.queue
              }
            }
            for(let t = 0; t < avgs.length; t++){
              avgs[t] = Math.round((avgs[t] / timesAv[t + 1]) * 100) / 100
              if(isNaN(avgs[t])){
                avgs[t] = 0
              }
            }
            await db
            .con()
            .query(
              `SELECT * from queue_alerts WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
              function (err, result2) {
                const diff = Math.ceil((new Date(data.end) - new Date(data.start)) / (1000 * 3600 * 24));
                let cache = '', range, cou = 0
                if(diff === 1){
                  range = 30 * 60 * 1000
                }else if(diff >= 1 && diff <= 3){
                  range = 2 * 60 * 60 * 1000
                }else if(diff >= 3 && diff <= 7){
                  range = 4 * 60 * 60 * 1000
                }else if(diff >= 7 && diff <= 14){
                  range = 8 * 60 * 60 * 1000
                }else if(diff >= 14 && diff <= 32){
                  range = 24 * 60 * 60 * 1000
                }
                cache = new Date(data.start).getTime()
                if(result2.length != 0){
                  result2.forEach(function (v) {
                    let d = v.time
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
                    v['picture'] = `${d}_${v.id}.jpg`
                    v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/queue/${req.params.id}/${v.picture}`
                    v.movie = `${d}_${v.id}_video.mp4`
                    v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/queue/${req.params.id}/${v.movie}`
                    cou++
                    if (
                      cache < v.time.getTime()
                    ) {
                      while (
                        cache < v.time.getTime()
                      ) {
                        cache = new Date(cache)
                        for(let e = 0; e < count; e++){
                        dataAlertsLow[e][cache.getFullYear() + '-' + (cache.getMonth() + 1) +  '-' + cache.getDate() + ' ' + cache.getHours() + ':' + cache.getMinutes()] = 0
                        dataAlertsMed[e][cache.getFullYear() + '-' + (cache.getMonth() + 1) +  '-' + cache.getDate() + ' ' + cache.getHours() + ':' + cache.getMinutes()] = 0
                        dataAlertsHigh[e][cache.getFullYear() + '-' + (cache.getMonth() + 1) +  '-' + cache.getDate() + ' ' + cache.getHours() + ':' + cache.getMinutes()] = 0
                      }
                        cache = cache.getTime()
                        cache += range
                      }
                    }
                    if (
                      cache >= v.time.getTime()
                    ) {
                      let t = cache
                      t -= range
                      t = new Date(t)
                      if(v.zone > count){
                        return
                      }
                      // switch (v.severity) {
                      //   case 0: {
                      //     dataAlertsLow[v.zone - 1][t.getFullYear() + '-' + (t.getMonth() + 1) + '-' +  t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes()
                      //     ] = (dataAlertsLow[v.zone - 1][ t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes() ] || 0) + 1
                      //     break
                      //   }
                      //   case 1: {
                      //     dataAlertsMed[v.zone - 1][t.getFullYear() + '-' + (t.getMonth() + 1) + '-' +  t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes()
                      //   ] = (dataAlertsMed[v.zone - 1][ t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes() ] || 0) + 1
                      //     break
                      //   }
                      //   case 2: {
                      //     dataAlertsHigh[v.zone - 1][t.getFullYear() + '-' + (t.getMonth() + 1) + '-' +  t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes()
                      //   ] = (dataAlertsHigh[v.zone - 1][ t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes() ] || 0) + 1
                      //     break
                      //   }
                      // }
                    }
                    label.push(v.time)
                    if(cou === result2.length){
                      while (
                        cache <= new Date(data.end)
                      ) {
                        cache = new Date(cache)
                        for(let e = 0; e < count; e++){
                        dataAlertsLow[e][cache.getFullYear() + '-' + (cache.getMonth() + 1) +  '-' + cache.getDate() + ' ' + cache.getHours() + ':' + cache.getMinutes()] = 0
                        dataAlertsMed[e][cache.getFullYear() + '-' + (cache.getMonth() + 1) +  '-' + cache.getDate() + ' ' + cache.getHours() + ':' + cache.getMinutes()] = 0
                        dataAlertsHigh[e][cache.getFullYear() + '-' + (cache.getMonth() + 1) +  '-' + cache.getDate() + ' ' + cache.getHours() + ':' + cache.getMinutes()] = 0
                      }
                        cache = cache.getTime()
                        cache += range
                      }
                    }
                  })
                }
                let a = {
                  label: label,
                  labelPeople: labelPeople,
                  dataPeople: dataPeople,
                  dataAlertsLow: dataAlertsLow,
                  dataAlertsMed: dataAlertsMed,
                  dataAlertsHigh: dataAlertsHigh,
                  raw: result,
                  rawAlerts: result2,
                  count: countIn,
                  countAll : countAll,
                  avg: Math.round((avg / times.length) * 100) / 100,
                  avgs: avgs,
                  min: minQ,
                  max: maxQ,
                  rel: rel,
                  queues: count
                }
                res.status(200).json({
                  success: true,
                  data: a
                })
              }
            )
          }
        )
    })
  })
}

exports.queueLite = async (req, res) => {
  const data = req.body
  await db
    .con()
    .query(
      `SELECT date_format(SEC_TO_TIME(AVG(TIME_TO_SEC(difference))), '%H:%i:%S') as avarage from (SELECT timediff(end_time, start_time) as difference FROM multi_tenant.queue_mgt where ${data.type} = '${req.params.id}' and queuing = 0 and start_time >= '${data.start}' and  start_time <= '${data.end}') t;`,
      async function (err, result) {
        if (err)
          return res.status(500).json({
            success: false,
            message: err
          })
        await db
          .con()
          .query(
            `SELECT count(queuing) as count FROM multi_tenant.queue_mgt where ${data.type} = '${req.params.id}' and queuing = 1 and start_time >= '${data.start}' and  start_time <= '${data.end}';`,
            function (err2, result2) {
              if (err2)
                return res.status(500).json({
                  success: false,
                  message: err2
                })
              const a = {
                avg: result[0].avarage,
                count: result2[0].count
              }
              res.status(200).json({
                success: true,
                data: a
              })
            }
          )
      }
    )
}

exports.pcLite = async (req, res) => {
  const data = req.body
  await db
    .con()
    .query(
      `SELECT (count2 - count1) as count FROM pcount where ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time desc limit 1;`,
      async function (err, result) {
        if (err)
          return res.status(500).json({
            success: false,
            message: err
          })
        var cou = 0
        if (result.length != 0) {
          cou = result[0].count
          if (cou < 0) {
            cou = JSON.stringify(cou * -1) + ' exiting'
          }
        }
        const a = {
          currentCount: cou
        }
        res.status(200).json({
          success: true,
          data: a
        })
      }
    )
}

exports.premises = async (req, res) => {
  const data = req.body
  await db
    .con()
    .query(
      `SELECT HOUR(start_time) as hour, COUNT(*) as count FROM queue_mgt where ${data.type} = '${req.params.id}' and start_time >= '${data.start}' and  start_time <= '${data.end}' GROUP BY HOUR(start_time);`,
      async function (err, result0) {
        if (err)
          return res.status(500).json({
            success: false,
            message: err
          })
        await db
          .con()
          .query(
            `SELECT HOUR(time) as hour, COUNT(*) as count FROM pcount where ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' GROUP BY HOUR(time);`,
            async function (err, result1) {
              if (err)
                return res.status(500).json({
                  success: false,
                  message: err
                })
              await db
                .con()
                .query(
                  `SELECT HOUR(time) as hour, COUNT(*) as count FROM loitering where ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' GROUP BY HOUR(time);`,
                  async function (err, result2) {
                    if (err)
                      return res.status(500).json({
                        success: false,
                        message: err
                      })
                    await db
                      .con()
                      .query(
                        `SELECT HOUR(time) as hour, COUNT(*) as count FROM vault where ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' GROUP BY HOUR(time);`,
                        async function (err, result3) {
                          if (err)
                            return res.status(500).json({
                              success: false,
                              message: err
                            })
                          let arr = [
                            {
                              hour: 0,
                              count: 0
                            },
                            {
                              hour: 1,
                              count: 0
                            },
                            {
                              hour: 2,
                              count: 0
                            },
                            {
                              hour: 3,
                              count: 0
                            },
                            {
                              hour: 4,
                              count: 0
                            },
                            {
                              hour: 5,
                              count: 0
                            },
                            {
                              hour: 6,
                              count: 0
                            },
                            {
                              hour: 7,
                              count: 0
                            },
                            {
                              hour: 8,
                              count: 0
                            },
                            {
                              hour: 9,
                              count: 0
                            },
                            {
                              hour: 10,
                              count: 0
                            },
                            {
                              hour: 11,
                              count: 0
                            },
                            {
                              hour: 12,
                              count: 0
                            },
                            {
                              hour: 13,
                              count: 0
                            },
                            {
                              hour: 14,
                              count: 0
                            },
                            {
                              hour: 15,
                              count: 0
                            },
                            {
                              hour: 16,
                              count: 0
                            },
                            {
                              hour: 17,
                              count: 0
                            },
                            {
                              hour: 18,
                              count: 0
                            },
                            {
                              hour: 19,
                              count: 0
                            },
                            {
                              hour: 20,
                              count: 0
                            },
                            {
                              hour: 21,
                              count: 0
                            },
                            {
                              hour: 22,
                              count: 0
                            },
                            {
                              hour: 23,
                              count: 0
                            }
                          ]
                          let res0 = {}
                          let res1 = {}
                          let res2 = {}
                          let res3 = {}
                          let a = 0
                          let b = 0
                          let c = 0
                          let d = 0
                          for (let i = 0; i < arr.length; i++) {
                            if (result0[a].hour != arr[i].hour) {
                              res0[arr[i].hour] = arr[i].count
                            } else {
                              res0[arr[i].hour] = result0[a].count
                              if (a < result0.length - 1) a++
                            }

                            if (result1[b].hour != arr[i].hour) {
                              res1[arr[i].hour] = arr[i].count
                            } else {
                              res1[arr[i].hour] = result1[b].count
                              if (b < result1.length - 1) b++
                            }

                            if (result2[c].hour != arr[i].hour) {
                              res2[arr[i].hour] = arr[i].count
                            } else {
                              res2[arr[i].hour] = result2[c].count
                              if (c < result2.length - 1) c++
                            }
                            if (result3[d].hour != arr[i].hour) {
                              res3[arr[i].hour] = arr[i].count
                            } else {
                              res3[arr[i].hour] = result3[d].count
                              if (d < result3.length - 1) d++
                            }
                          }

                          const send = {
                            queue: res0,
                            pcount: res1,
                            loit: res2,
                            vault: res3
                          }
                          res.status(200).json({
                            success: true,
                            data: send
                          })
                        }
                      )
                  }
                )
            }
          )
      }
    )
}

exports.threats = async (req, res) => {
  const data = req.body
  await db
    .con()
    .query(
      `SELECT HOUR(time) as hour, COUNT(*) as count FROM violence where ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' GROUP BY HOUR(time);`,
      async function (err, result0) {
        if (err)
          return res.status(500).json({
            success: false,
            message: err
          })
        await db
          .con()
          .query(
            `SELECT HOUR(time) as hour, COUNT(*) as count FROM helmet where ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' GROUP BY HOUR(time);`,
            async function (err, result1) {
              if (err)
                return res.status(500).json({
                  success: false,
                  message: err
                })
              await db
                .con()
                .query(
                  `SELECT HOUR(time) as hour, COUNT(*) as count FROM mask where ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' GROUP BY HOUR(time);`,
                  async function (err, result2) {
                    if (err)
                      return res.status(500).json({
                        success: false,
                        message: err
                      })
                    await db
                      .con()
                      .query(
                        `SELECT HOUR(time) as hour, COUNT(*) as count FROM aod where ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' GROUP BY HOUR(time);`,
                        async function (err, result3) {
                          if (err)
                            return res.status(500).json({
                              success: false,
                              message: err
                            })
                          await db
                            .con()
                            .query(
                              `SELECT HOUR(time) as hour, COUNT(*) as count FROM sociald where ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' GROUP BY HOUR(time);`,
                              async function (err, result4) {
                                if (err)
                                  return res.status(500).json({
                                    success: false,
                                    message: err
                                  })
                                await db
                                  .con()
                                  .query(
                                    `SELECT HOUR(time) as hour, COUNT(*) as count FROM intrude where ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' GROUP BY HOUR(time);`,
                                    async function (err, result5) {
                                      if (err)
                                        return res.status(500).json({
                                          success: false,
                                          message: err
                                        })
                                      let arr = [
                                        {
                                          hour: 0,
                                          count: 0
                                        },
                                        {
                                          hour: 1,
                                          count: 0
                                        },
                                        {
                                          hour: 2,
                                          count: 0
                                        },
                                        {
                                          hour: 3,
                                          count: 0
                                        },
                                        {
                                          hour: 4,
                                          count: 0
                                        },
                                        {
                                          hour: 5,
                                          count: 0
                                        },
                                        {
                                          hour: 6,
                                          count: 0
                                        },
                                        {
                                          hour: 7,
                                          count: 0
                                        },
                                        {
                                          hour: 8,
                                          count: 0
                                        },
                                        {
                                          hour: 9,
                                          count: 0
                                        },
                                        {
                                          hour: 10,
                                          count: 0
                                        },
                                        {
                                          hour: 11,
                                          count: 0
                                        },
                                        {
                                          hour: 12,
                                          count: 0
                                        },
                                        {
                                          hour: 13,
                                          count: 0
                                        },
                                        {
                                          hour: 14,
                                          count: 0
                                        },
                                        {
                                          hour: 15,
                                          count: 0
                                        },
                                        {
                                          hour: 16,
                                          count: 0
                                        },
                                        {
                                          hour: 17,
                                          count: 0
                                        },
                                        {
                                          hour: 18,
                                          count: 0
                                        },
                                        {
                                          hour: 19,
                                          count: 0
                                        },
                                        {
                                          hour: 20,
                                          count: 0
                                        },
                                        {
                                          hour: 21,
                                          count: 0
                                        },
                                        {
                                          hour: 22,
                                          count: 0
                                        },
                                        {
                                          hour: 23,
                                          count: 0
                                        }
                                      ]
                                      let res0 = {}
                                      let res1 = {}
                                      let res2 = {}
                                      let res3 = {}
                                      let res4 = {}
                                      let res5 = {}
                                      let a = 0
                                      let b = 0
                                      let c = 0
                                      let d = 0
                                      let e = 0
                                      let f = 0
                                      for (let i = 0; i < arr.length; i++) {
                                        if (result0[a].hour != arr[i].hour) {
                                          res0[arr[i].hour] = arr[i].count
                                        } else {
                                          res0[arr[i].hour] = result0[a].count
                                          if (a < result0.length - 1) a++
                                        }

                                        if (result1[b].hour != arr[i].hour) {
                                          res1[arr[i].hour] = arr[i].count
                                        } else {
                                          res1[arr[i].hour] = result1[b].count
                                          if (b < result1.length - 1) b++
                                        }

                                        if (result2[c].hour != arr[i].hour) {
                                          res2[arr[i].hour] = arr[i].count
                                        } else {
                                          res2[arr[i].hour] = result2[c].count
                                          if (c < result2.length - 1) c++
                                        }

                                        if (result3[d].hour != arr[i].hour) {
                                          res3[arr[i].hour] = arr[i].count
                                        } else {
                                          res3[arr[i].hour] = result3[d].count
                                          if (d < result3.length - 1) d++
                                        }

                                        if (result4[e].hour != arr[i].hour) {
                                          res4[arr[i].hour] = arr[i].count
                                        } else {
                                          res4[arr[i].hour] = result4[e].count
                                          if (e < result4.length - 1) e++
                                        }

                                        if (result5[f].hour != arr[i].hour) {
                                          res5[arr[i].hour] = arr[i].count
                                        } else {
                                          res5[arr[i].hour] = result5[f].count
                                          if (f < result5.length - 1) f++
                                        }
                                      }

                                      const send = {
                                        violence: res0,
                                        helmet: res1,
                                        covered: res2,
                                        aod: res3,
                                        social: res4,
                                        intr: res5
                                      }
                                      res.status(200).json({
                                        success: true,
                                        data: send
                                      })
                                    }
                                  )
                              }
                            )
                        }
                      )
                  }
                )
            }
          )
      }
    )
}

exports.vault = async (req, res) => {
  const data = req.body

  await db
    .con()
    .query(
      `SELECT * from vault WHERE  ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
      function (err, result) {
        if (err)
          return res.status(500).json({
            success: false,
            message: err
          })
        let days = Math.round((new Date(data.end) - new Date(data.start)) / (1000 * 60 * 60 * 24))
        let ress = {}
        let cache = ''
        let organized = []
        for (var v of result) {
          if (cache == '') {
            cache =
              v.time.getFullYear() +
              '-' +
              (v.time.getMonth() + 1) +
              '-' +
              v.time.getDate() +
              ' ' +
              v.time.getHours()
          }

          if (
            cache !=
            v.time.getFullYear() +
              '-' +
              (v.time.getMonth() + 1) +
              '-' +
              v.time.getDate() +
              ' ' +
              v.time.getHours()
          ) {
            while (
              cache !=
              v.time.getFullYear() +
                '-' +
                (v.time.getMonth() + 1) +
                '-' +
                v.time.getDate() +
                ' ' +
                v.time.getHours()
            ) {
              let t = new Date(cache + ':00:00').getTime()
              //Add one hours to date
              t += 60 * 60 * 1000
              cache = new Date(t)
              ress[
                cache.getFullYear() +
                  '-' +
                  (cache.getMonth() + 1) +
                  '-' +
                  cache.getDate() +
                  ' ' +
                  cache.getHours()
              ] = 0
              cache =
                cache.getFullYear() +
                '-' +
                (cache.getMonth() + 1) +
                '-' +
                cache.getDate() +
                ' ' +
                cache.getHours()
            }
          }
          if (
            cache ==
            v.time.getFullYear() +
              '-' +
              (v.time.getMonth() + 1) +
              '-' +
              v.time.getDate() +
              ' ' +
              v.time.getHours()
          ) {
            ress[
              v.time.getFullYear() +
                '-' +
                (v.time.getMonth() + 1) +
                '-' +
                v.time.getDate() +
                ' ' +
                v.time.getHours()
            ] =
              (ress[
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ] || 0) + 1
          }
          let d = v.time
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
          v['picture'] = `${d}_${v.trackid}.jpg`
          if (v.open == 1) {
            v['time_in'] = v['time']
            organized.push(v)
          } else {
            organized[organized.length - 1]['time_out'] = v['time']
          }
        }
        if (organized[organized.length - 1]['time_out'] == undefined) {
          organized[organized.length - 1]['time_out'] = new Date()
        }
        for (var t of organized) {
          t['duration'] = (t.time_out - t.time_in) / 1000
          t['duration'] = display(t['duration'])
        }
        let av = result.length / (24 * days)
        let a = {
          total: result.length,
          avg: Math.round(av * 100) / 100,
          raw: result,
          org: organized,
          over: ress
        }
        res.status(200).json({
          success: true,
          data: a
        })
      }
    )
}

exports.parking = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 4,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from parking WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc`,
          function (err, result) {
            if (err)
              return res.status(500).json({
                success: false,
                message: err
              })
            for (var v of result) {
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/parking/${req.params.id}/${v.picture}`
              v.movie = `${d}_${v.track_id}_video.mp4`
              v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/parking/${req.params.id}/${v.movie}`
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.anpr = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 13,
        camera_id: req.params.id
      }
    }).then(async rel => {
      let query = `SELECT * from plate WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`
      if(req.params.id === 'abc'){
        query = `SELECT * from plate WHERE time >= '${data.start}' and  time <= '${data.end}' order by time asc;`
      }
      await db
        .con()
        .query(
          query,
          function (err, result) {
            if (err)
              return res.status(500).json({
                success: false,
                message: err
              })
            for (var v of result) {
              let d = v.time
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
              let path
              if(req.params.id === 'abc'){
                path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/anpr/${v.cam_id}/`
              }else{
                path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/anpr/${req.params.id}/`
              }
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${path}${v.picture}`
              v.movie = `${d}_${v.track_id}_video.mp4`
              v.pic_path = `${path}${v.movie}`
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.barrier = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 25,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from barrier WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err)
              return res.status(500).json({
                success: false,
                message: err
              })
            for (var v of result) {
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/anpr/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/anpr/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.vc = async (req, res) => {
  const data = req.body
  const ressEn = {}
  const ressEx = {}
  var avgi = 0
  var mini = 0
  var maxi = 0
  var avgen = 0
  var minen = 0
  var maxen = 0
  var avgex = 0
  var minex = 0
  var maxex = 0
  var ins = 0
  var totalEn = 0
  var totalEx = 0
  const label = []
  const dain = []
  const daen = []
  const daex = []
  await db
    .con()
    .query(
      `SELECT * from vcount WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
      function (err, result) {
        if (err)
          return res.status(500).json({
            success: false,
            message: err
          })
        result.forEach(function (v) {
          let d = v.time
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

          v.picture = `${d}_${v.id}.jpg`
          v.movie = `${d}_${v.id}_video.mp4`
          console.log(v.picture, v.movie)
          ressEn[
            v.time.getFullYear() +
              '-' +
              (v.time.getMonth() + 1) +
              '-' +
              v.time.getDate() +
              ' ' +
              v.time.getHours()
          ] = v.count2
          ressEx[
            v.time.getFullYear() +
              '-' +
              (v.time.getMonth() + 1) +
              '-' +
              v.time.getDate() +
              ' ' +
              v.time.getHours()
          ] = v.count1
          label.push(v.time)
          dain.push(v['count2'] - v['count1'])
          daen.push(v['count2'])
          daex.push(v['count1'])
          v['picture'] = 'name.jpg'
          v['inside'] = v['count2'] - v['count1']
          avgi = avgi + v['inside']
          if (mini == 0) {
            mini = v['inside']
          } else if (v['inside'] < mini) {
            mini = v['inside']
          }
          if (maxi == 0) {
            maxi = v['inside']
          } else if (v['inside'] > maxi) {
            maxi = v['inside']
          }
          avgen = avgen + v.count2
          if (minen == 0) {
            minen = v.count2
          } else if (v.count2 < minen) {
            minen = v.count2
          }
          if (maxen == 0) {
            maxen = v.count2
          } else if (v.count2 > maxen) {
            maxen = v.count2
          }
          avgex = avgex + v.count1
          if (minex == 0) {
            minex = v.count1
          } else if (v.count1 < minex) {
            minex = v.count1
          }
          if (maxex == 0) {
            maxex = v.count1
          } else if (v.count1 > maxex) {
            maxex = v.count1
          }
        })
        avgi = Math.round((avgi / result.length) * 100) / 100
        avgen = Math.round((avgen / result.length) * 100) / 100
        avgex = Math.round((avgex / result.length) * 100) / 100
        if (result.length != 0) {
          ins = result[result.length - 1]['count2'] - result[result.length - 1]['count1']
          totalEn = result[result.length - 1]['count2']
          totalEx = result[result.length - 1]['count1']
        }
        if (ins < 0) {
          ins = 0
        }
        let a = {
          totalEn: totalEn,
          totalEx: totalEx,
          in: ins,
          avg: {
            in: avgi,
            en: avgen,
            ex: avgex
          },
          min: {
            in: mini,
            en: minen,
            ex: minex
          },
          max: {
            in: maxi,
            en: maxen,
            ex: maxex
          },
          raw: result,
          histogramEn: ressEn,
          histogramEx: ressEx,
          label: label,
          dataIn: dain,
          dataEn: daen,
          dataEx: daex
        }
        if (result.length == 0) {
          return res.status(200).json({
            success: true,
            data: a
          })
        }
        res.status(200).json({
          success: true,
          data: a
        })
      }
    )
}

exports.accident = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 29,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from accident WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err)
              return res.status(500).json({
                success: false,
                message: err
              })
            for (var v of result) {
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/accident/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/accident/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.animal = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 28,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from animal WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err)
              return res.status(500).json({
                success: false,
                message: err
              })
            for (var v of result) {
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/animal/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/animal/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.axle = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 30,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from axle WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err)
              return res.status(500).json({
                success: false,
                message: err
              })
            for (var v of result) {
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/axle/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/axle/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.carmake = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 31,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from carmake WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err)
              return res.status(500).json({
                success: false,
                message: err
              })
            for (var v of result) {
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/carmake/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/carmake/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.vcount = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  let totalCarsEn = 0
  let totalCarsEx = 0
  let totalBusesEn = 0
  let totalBusesEx = 0
  let totalTrucksEn = 0
  let totalTrucksEx = 0
  let totalRickshawsEn = 0
  let totalRickshawsEx = 0
  let totalMotorbikesEn = 0
  let totalMotorbikesEx = 0
  let carsEn = []
  let carsEx = []
  let busesEn = []
  let busesEx = []
  let trucksEn = []
  let trucksEx = []
  let rickshawsEn = []
  let rickshawsEx = []
  let motorbikesEn = []
  let motorbikesEx = []
  let carsLabel = []
  let busesLabel = []
  let trucksLabel = []
  let rickshawsLabel = []
  let motorbikesLabel = []

  let labels = []

  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 26,
        camera_id: req.params.id
      }
    })
      .then(async rel => {
        await db
          .con()
          .query(
            `SELECT * from vcount WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
            function (err, result) {
              if (err)
                return res.status(500).json({
                  success: false,
                  message: err
                })
              for (const val of result) {
                let d = val.time
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
      
                val.picture = `${d}_${val.id}.jpg`
                val.movie = `${d}_${val.id}_video.mp4`
                labels.push(val.time)
                carsLabel.push(val.car_numbers)
                busesLabel.push(val.bus_numbers)
                trucksLabel.push(val.truck_numbers)
                motorbikesLabel.push(val.motorbike_numbers)
                totalBusesEn = val.bus_numbers
                totalCarsEn = val.car_numbers
                totalMotorbikesEn = val.motorbike_numbers
                totalTrucksEn = val.truck_numbers
              }
              // let carsData = result.filter(itm => itm.type === 'car')
              // carsData.forEach(c => {
              //   carsEn.push(c.count1)
              //   carsEx.push(c.count2)
              //   carsLabel.push(c.time)
              //   totalCarsEn = totalCarsEn + c.count1
              //   totalCarsEx = totalCarsEx + c.count2
              // })

              // let busesData = result.filter(itm => itm.type === 'bus')
              // busesData.forEach(b => {
              //   busesEn.push(b.count1)
              //   busesEx.push(b.count2)
              //   busesLabel.push(b.time)
              //   totalBusesEn = totalBusesEn + b.count1
              //   totalBusesEx = totalBusesEx + b.count2
              // })

              // let trucksData = result.filter(itm => itm.type === 'truck')
              // trucksData.forEach(t => {
              //   trucksEn.push(t.count1)
              //   trucksEx.push(t.count2)
              //   trucksLabel.push(t.time)
              //   totalTrucksEn = totalTrucksEn + t.count1
              //   totalTrucksEx = totalTrucksEx + t.count2
              // })

              // let rickshawsData = result.filter(itm => itm.type === 'rickshaw')
              // rickshawsData.forEach(r => {
              //   rickshawsEn.push(r.count1)
              //   rickshawsEx.push(r.count2)
              //   rickshawsLabel.push(r.time)
              //   totalRickshawsEn = totalRickshawsEn + r.count1
              //   totalRickshawsEx = totalRickshawsEx + r.count2
              // })

              // let motorbikesData = result.filter(itm => itm.type === 'motorbike')
              // motorbikesData.forEach(m => {
              //   motorbikesEn.push(m.count1)
              //   motorbikesEx.push(m.count2)
              //   motorbikesLabel.push(m.time)
              //   totalMotorbikesEn = totalMotorbikesEn + m.count1
              //   totalMotorbikesEx = totalMotorbikesEx + m.count2
              // })
              /* for (var v of result) {
                let d = v.time
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
                v.picture = `${d}_${v.track_id}.jpg`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/vcount/${req.params.id}/${v.picture}`
                if (rel.atributes[0].time > 0) {
                  v.clip_path = `${d}_${v.track_id}.mp4`
                  v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/vcount/${req.params.id}/${v.clip_path}`
                }
              } */
              const a = {
                total: result.length,
                raw: result,
                labels,
                carsEn,
                carsEx,
                totalCarsEn,
                totalCarsEx,
                carsLabel,
                busesEn,
                busesEx,
                totalBusesEn,
                totalBusesEx,
                busesLabel,
                motorbikesEn,
                motorbikesEx,
                totalMotorbikesEn,
                totalMotorbikesEx,
                motorbikesLabel,
                trucksEn,
                trucksEx,
                totalTrucksEn,
                totalTrucksEx,
                trucksLabel,
                rickshawsEn,
                rickshawsEx,
                totalRickshawsEn,
                totalRickshawsEx,
                rickshawsLabel
              }
              res.status(200).json({
                success: true,
                data: a,
                rel: rel
              })
            }
          )
      })
      .catch(err => {
        res.status(500).json({success: false, mess: err})
      })
  })
}

exports.fr = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 0,
        camera_id: req.params.id
      }
    })
      .then(async rel => {
        await db
          .con()
          .query(
            `SELECT * from black_white_fr WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
            function (err, result) {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: err
                })
              }
              for (const v of result) {
                let d = v.time
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
                v.picture = `${d}_${v.id}.jpg`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/black_white_fr/${req.params.id}/${v.picture}`
                v.movie = `${d}_${v._id}_video.mp4`
                v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/black_white_fr/${req.params.id}/${v.movie}`
              }
              const a = {
                total: result.length,
                raw: result
              }
              res.status(200).json({
                success: true,
                data: a,
                rel: rel
              })
            }
          )
      })
      .catch(err => {
        res.status(500).json({success: false, mess: err})
      })
  })
}

exports.cloth = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 32,
        camera_id: req.params.id
      }
    })
      .then(async rel => {
        await db
          .con()
          .query(
            `SELECT * from clothing WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
            function (err, result) {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: err
                })
              }
              for (const v of result) {
                let d = v.time
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
                v.picture = `${d}_${v.track_id}.jpg`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/cloth/${req.params.id}/${v.picture}`
                if (rel.atributes[0].time > 0) {
                  v.clip_path = `${d}_${v.track_id}.mp4`
                  v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/cloth/${req.params.id}/${v.clip_path}`
                }
              }
              const a = {
                total: result.length,
                raw: result
              }
              res.status(200).json({
                success: true,
                data: a,
                rel: rel
              })
            }
          )
      })
      .catch(err => {
        res.status(500).json({success: false, mess: err})
      })
  })
}

exports.direction = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 8,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from wrongway WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err)
              return res.status(500).json({
                success: false,
                message: err
              })
            for (var v of result) {
              let d = v.time
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
              v['picture'] = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/direction/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/direction/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.speeding = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 5,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from speed WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err)
              return res.status(500).json({
                success: false,
                message: err
              })
            for (var v of result) {
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/speed/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/speed/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.pcOnView = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 33,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from pcount_screen WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] = v.count
                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] = v.count
                /* (ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] || 0) + 1 */
              }
              let d = v.time
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
              v.picture = `${d}_${v.trackid}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/pcount_screen/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.trackid}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/pcount_screen/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              over: ress,
              rel: rel
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.brand = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 31,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from carbrand WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            for (const v of result) {
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/brand/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/brand/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.faceData = async (req, res) => {
  const data = req.body
  try {
    const resp = await db
      .con()
      .query(
        `INSERT INTO faces VALUES ('${data[0]}','${data[1]}','${data[2]}','${data[3]}','${data[4]}','${data[5]}','${data[6]}','${data[7]}','${data[8]}');`
      )
    console.log(resp)
    res.status(200).json({success: true})
  } catch (err) {
    console.error(err)
  }
}

exports.collapse = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 38,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from collapse WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/collapse/${req.params.id}/${v.picture}`
              // if (rel.atributes[0].time > 0) {
                v.movie = `${d}_${v.id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/collapse/${req.params.id}/${v.movie}`
              // }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.fire = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 39,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from fire WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/fire/${req.params.id}/${v.picture}`
              v.movie = `${d}_${v.id}_video.mp4`
              v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/fire/${req.params.id}/${v.movie}`
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.weapon = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 35,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from weapon WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              v['picture'] = `${genName.genName(v.time)}.jpg`
              v['movie'] = `${genName.genName(v.time)}_video.mp4`
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.bottle = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 36,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from bottle WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/bottle/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/bottle/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.waving = async (req, res) => {
  const data = req.body
  const name = 'WavingHand'
  Relation.findOne({
    where: {
      algo_id: 41,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.smoking = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 42,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from smoking WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/smoking
/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/smoking
/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.slapping = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 44,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from slapping WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/slapping/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/slapping/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.running = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 46,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from running WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/running/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/running/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.pushing = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 50,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from pushing WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/pushing/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/pushing/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.hair = async (req, res) => {
  const data = req.body
  const name = 'pullingHair'
  Relation.findOne({
    where: {
      algo_id: 40,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.following = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 49,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from following WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/following/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/following/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

// exports.disrobing = async (req, res) => {
//   const token = req.headers['x-access-token']
//   const data = req.body
//   jwt.verify(token, process.env.secret, async (err, decoded) => {
//     Relation.findOne({
//       where: {
//         algo_id: 47,
//         camera_id: req.params.id
//       }
//     }).then(async rel => {
//       await db
//         .con()
//         .query(
//           `SELECT * from disrobing WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
//           function (err, result) {
//             if (err) {
//               return res.status(500).json({
//                 success: false,
//                 message: err
//               })
//             }
//             const ress = {}
//             let cache = ''
//             for (const v of result) {
//               if (cache == '') {
//                 cache =
//                   v.time.getFullYear() +
//                   '-' +
//                   (v.time.getMonth() + 1) +
//                   '-' +
//                   v.time.getDate() +
//                   ' ' +
//                   v.time.getHours()
//               }

//               if (
//                 cache !=
//                 v.time.getFullYear() +
//                   '-' +
//                   (v.time.getMonth() + 1) +
//                   '-' +
//                   v.time.getDate() +
//                   ' ' +
//                   v.time.getHours()
//               ) {
//                 while (
//                   cache !=
//                   v.time.getFullYear() +
//                     '-' +
//                     (v.time.getMonth() + 1) +
//                     '-' +
//                     v.time.getDate() +
//                     ' ' +
//                     v.time.getHours()
//                 ) {
//                   let t = new Date(cache + ':00:00').getTime()
//                   // Add one hours to date
//                   t += 60 * 60 * 1000
//                   cache = new Date(t)
//                   ress[
//                     cache.getFullYear() +
//                       '-' +
//                       (cache.getMonth() + 1) +
//                       '-' +
//                       cache.getDate() +
//                       ' ' +
//                       cache.getHours()
//                   ] =
//                     ress[
//                       v.time.getFullYear() +
//                         '-' +
//                         (v.time.getMonth() + 1) +
//                         '-' +
//                         v.time.getDate() +
//                         ' ' +
//                         v.time.getHours()
//                     ] + 1 || 1

//                   cache =
//                     cache.getFullYear() +
//                     '-' +
//                     (cache.getMonth() + 1) +
//                     '-' +
//                     cache.getDate() +
//                     ' ' +
//                     cache.getHours()
//                 }
//               }
//               if (
//                 cache ==
//                 v.time.getFullYear() +
//                   '-' +
//                   (v.time.getMonth() + 1) +
//                   '-' +
//                   v.time.getDate() +
//                   ' ' +
//                   v.time.getHours()
//               ) {
//                 ress[
//                   v.time.getFullYear() +
//                     '-' +
//                     (v.time.getMonth() + 1) +
//                     '-' +
//                     v.time.getDate() +
//                     ' ' +
//                     v.time.getHours()
//                 ] =
//                   ress[
//                     v.time.getFullYear() +
//                       '-' +
//                       (v.time.getMonth() + 1) +
//                       '-' +
//                       v.time.getDate() +
//                       ' ' +
//                       v.time.getHours()
//                   ] + 1 || 1
//               }
//               let d = v.time
//               let se = d.getSeconds()
//               let mi = d.getMinutes()
//               let ho = d.getHours()
//               if (se < 10) {
//                 se = '0' + se
//               }
//               if (mi < 10) {
//                 mi = '0' + mi
//               }
//               if (ho < 10) {
//                 ho = '0' + ho
//               }
//               d =
//                 d.getFullYear() +
//                 '-' +
//                 (d.getMonth() + 1) +
//                 '-' +
//                 d.getDate() +
//                 '_' +
//                 ho +
//                 ':' +
//                 mi +
//                 ':' +
//                 se
//               v.picture = `${d}_${v.track_id}.jpg`
//               v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/disrobing/${req.params.id}/${v.picture}`
//               if (rel.atributes[0].time > 0) {
//                 v.clip_path = `${d}_${v.track_id}.mp4`
//                 v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/disrobing/${req.params.id}/${v.clip_path}`
//               }
//             }
//             const a = {
//               total: result.length,
//               raw: result,
//               rel: rel,
//               over: ress
//             }
//             res.status(200).json({
//               success: true,
//               data: a
//             })
//           }
//         )
//     })
//   })
// }

exports.crowd = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 43,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from crowd WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/crowd/${req.params.id}/${v.picture}`
              v.movie = `${d}_${v.track_id}_video.mp4`
              v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/crowd/${req.params.id}/${v.movie}`
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.blocking = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 45,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from blocking WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/blocking/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/blocking/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.transpassing = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 52,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from transpassing WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/transpassing/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/transpassing/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.cameraDefocused = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 53,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from cameraDefocused WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/cameraDefocused/${req.params.id}/${v.picture}`
              v.movie = `${d}_${v.track_id}_video.mp4`
              v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/cameraDefocused/${req.params.id}/${v.movie}`
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.cameraBlinded = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 54,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from cameraBlinded WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/cameraBlinded/${req.params.id}/${v.picture}`
              v.movie = `${d}_${v.track_id}_video.mp4`
              v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/cameraBlinded/${req.params.id}/${v.movie}`
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.sceneChange = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 55,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from sceneChange WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/sceneChange/${req.params.id}/${v.picture}`
              v.movie = `${d}_${v.track_id}_video.mp4`
              v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/sceneChange/${req.params.id}/${v.movie}`
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.objectRemoval = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 56,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from objectRemoval WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/objectRemoval/${req.params.id}/${v.picture}`
              v.movie = `${d}_${v.track_id}_video.mp4`
              v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/objectRemoval/${req.params.id}/${v.movie}`
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.smokeDetection = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 57,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from smokeDetection WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/smokeDetection/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/smokeDetection/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.velocity = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 58,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from velocity WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/velocity/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/velocity/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.enterExit = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 59,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from enterExit WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/enterExit/${req.params.id}/${v.picture}`
              v.movie = `${d}_${v.track_id}_video.mp4`
              v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/enterExit/${req.params.id}/${v.movie}`
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.exit = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 60,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from exit WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/exit/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/exit/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.harrasment = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 61,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from harrasment WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/harrasment/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/harrasment/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.abduction = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 62,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from abduction WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/abduction/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/abduction/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.dir = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 63,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from dir WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/dir/${req.params.id}/${v.picture}`
              if (rel.atributes[0].time > 0) {
                v.clip_path = `${d}_${v.track_id}.mp4`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/dir/${req.params.id}/${v.clip_path}`
              }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.signalLost = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 64,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from signalLost WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/signalLost/${req.params.id}/${v.picture}`
              v.movie = `${d}_${v.track_id}_video.mp4`
              v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/signalLost/${req.params.id}/${v.movie}`
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.enterExitV = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 65,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from enterExitV WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/enterExitV/${req.params.id}/${v.picture}`
              v.movie = `${d}_${v.track_id}_video.mp4`
              v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/enterExitV/${req.params.id}/${v.movie}`
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.congestion = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 70,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from congestion WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/congestion/${req.params.id}/${v.picture}`
              v.movie = `${d}_${v.track_id}_video.mp4`
              v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/congestion/${req.params.id}/${v.movie}`
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.vehloitering = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    let wh
    if (decoded.id_branch != 0000) {
      wh = {
        id_branch: decoded.id_branch,
        algo_id: 72
      }
    } else {
      wh = {
        id_account: decoded.id_account,
        algo_id: 72
      }
    }
    Relation.findOne({
      where: wh
    })
      .then(async rel => {
        await db
          .con()
          .query(
            `SELECT * from vehicle_loitering WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
            function (err, result) {
              if (err)
                return res.status(500).json({
                  success: false,
                  message: err
                })
              let days = Math.round(
                (new Date(data.end) - new Date(data.start)) / (1000 * 60 * 60 * 24)
              )
              let avg = 0
              let min = 0
              let max = 0
              var ress = {}
              var dwell = []
              var labelsD = []
              result.forEach(function (v) {
                ress[v.time.getHours()] = (ress[v.time.getHours()] || 0) + 1
                dwell.push(v.dwell)
                labelsD.push(v.time)
                avg = avg + v.dwell
                if (min == 0) {
                  min = v.dwell
                } else if (v.dwell < min) {
                  min = v.dwell
                }
                if (max == 0) {
                  max = v.dwell
                } else if (v.dwell > max) {
                  max = v.dwell
                }
                let d = v.time
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
                v.picture = `${d}_${v.track_id}.jpg`
                v.movie = `${d}_${v.track_id}_video.mp4`
                v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/vehicle_loitering/${req.params.id}/${v.movie}`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/vehicle_loitering/${req.params.id}/${v.picture}`
                let l = v.dwell / rel.atributes[1].time - 1
                if (l >= 2) {
                  l = 2
                }
                let r
                switch (l) {
                  case 0: {
                    r = 'Low'
                    break
                  }
                  case 1: {
                    r = 'Med'
                    break
                  }
                  case 2: {
                    r = 'High'
                    break
                  }
                }
                v['severity'] = l
                v['alert'] = r
              })
              avg = Math.round((avg / result.length) * 100) / 100
              let av = result.length / (24 * days)
              let a = {
                total: result.length,
                avgH: Math.round(av * 100) / 100,
                avgS: Math.round((av / (60 * 60)) * 100) / 100,
                raw: result,
                dwell: dwell,
                labelsD: labelsD,
                histogram: ress,
                min: min,
                max: max,
                avg: avg
              }
              res.status(200).json({
                success: true,
                data: a
              })
            }
          )
      })
      .catch(err => {
        return res.status(500).send({
          success: false,
          message: err
        })
      })
  })
}

exports.ppe = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 71,
        camera_id: req.params.id
      }
    }).then(async rel => {
      const diff = Math.ceil((new Date(data.end) - new Date(data.start)) / (1000 * 3600 * 24));
      let cache = ['','',''], range, start, end
      if(diff === 1){
        range = 30 * 60 * 1000
        // start = new Date(data.start).getTime() + 7 * 60 * 60 * 1000
        // start = JSON.stringify(new Date(start))
        // start = start.substring(1, start.length - 1);
        // end =  new Date(data.end).getTime() - 1.5 * 60 * 60 * 1000
        // end = JSON.stringify(new Date(end))
        // end = end.substring(1, end.length - 1);
      }else if(diff >= 1 && diff <= 3){
        range = 2 * 60 * 60 * 1000
      }else if(diff >= 3 && diff <= 7){
        range = 4 * 60 * 60 * 1000
      }else if(diff >= 7 && diff <= 14){
        range = 8 * 60 * 60 * 1000
      }else if(diff >= 14 && diff <= 32){
        range = 24 * 60 * 60 * 1000
      }
      if(start === undefined){
        start = data.start
        end = data.end
      }
      cache = [new Date(start).getTime(),new Date(start).getTime(),new Date(start).getTime()]
      await db
        .con()
        .query(
          `SELECT * from clark_uniform WHERE ${data.type} = '${req.params.id}' and time >= '${start}' and  time <= '${end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}, label = []
            let dataAlerts = [{},{},{}]
            for (const v of result) {
              if (
                cache[v.alert_type - 1] < v.time.getTime()
              ) {
                while (
                  cache[v.alert_type - 1] < v.time.getTime()
                ) {
                  cache[v.alert_type - 1] = new Date(cache[v.alert_type - 1])
                  dataAlerts[v.alert_type - 1][cache[v.alert_type - 1].getFullYear() + '-' + (cache[v.alert_type - 1].getMonth() + 1) +  '-' + cache[v.alert_type - 1].getDate() + ' ' + cache[v.alert_type - 1].getHours() + ':' + cache[v.alert_type - 1].getMinutes()] = 0
                  cache[v.alert_type - 1] = cache[v.alert_type - 1].getTime()
                  cache[v.alert_type - 1] += range
                }
              }
              if (
                cache[v.alert_type - 1] >= v.time.getTime()
              ) {
                let t = cache[v.alert_type - 1]
                t -= range
                t = new Date(t)
                dataAlerts[v.alert_type - 1][t.getFullYear() + '-' + (t.getMonth() + 1) + '-' +  t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes()] = (dataAlerts[v.alert_type - 1][ t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes() ] || 0) + 1
              }
              label.push(v.time)

              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/ppe/${req.params.id}/${v.picture}`
              v.movie = `${d}_${v.track_id}_video.mp4`
              v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/ppe/${req.params.id}/${v.movie}`
            }
            for(let i = 0; i < dataAlerts.length; i ++){
              while (
                  cache[i] <= new Date(end)
                ) {
                  cache[i] = new Date(cache[i])
                  dataAlerts[i][cache[i].getFullYear() + '-' + (cache[i].getMonth() + 1) +  '-' + cache[i].getDate() + ' ' + cache[i].getHours() + ':' + cache[i].getMinutes()] = 0
                  cache[i] = cache[i].getTime()
                  cache[i] += range
                }
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress,
              label: label,
              alerts: dataAlerts
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.defect = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 73,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from batterydefect WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/defect/${req.params.id}/${v.picture}`
              v.movie = `${d}_${v.track_id}_video.mp4`
              v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/defect/${req.params.id}/${v.movie}`
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.module = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 74,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from battery_module_defect WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.track_id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/module/${req.params.id}/${v.picture}`
              v.movie = `${d}_${v.track_id}_video.mp4`
              v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/module/${req.params.id}/${v.movie}`
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

// exports.peopleTracking = async (req, res) => {
//   const data = req.body
//   const name = 'persontracking'
//   Relation.findOne({
//     where: {
//       algo_id: 51,
//       camera_id: req.params.id
//     }
//   }).then(async rel => {
//     await db
//       .con()
//       .query(
//         `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
//         function (err, result) {
//           if (err) {
//             return res.status(500).json({
//               success: false,
//               message: err
//             })
//           }
//           const resu = graph.generateWithName(result)
//           const a = {
//             total: result.length,
//             raw: resu.array,
//             rel: rel,
//             over: resu.ress,
//             folder: name
//           }
//           res.status(200).json({
//             success: true,
//             data: a
//           })
//         }
//       )
//   })
// }
exports.peopleTracking = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 51,
        camera_id: req.params.id
      }
    })
      .then(async rel => {
        await db
          .con()
          .query(
            `SELECT * from persontracking WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
            function (err, result) {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: err
                })
              }
              for (const v of result) {
                let d = v.time
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
                v.picture = `${d}_${v.id}.jpg`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/persontracking/${req.params.id}/${v.picture}`
                v.movie = `${d}_${v._id}_video.mp4`
                v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/persontracking/${req.params.id}/${v.movie}`
              }
              const a = {
                total: result.length,
                raw: result
              }
              res.status(200).json({
                success: true,
                data: a,
                rel: rel
              })
            }
          )
      })
      .catch(err => {
        res.status(500).json({success: false, mess: err})
      })
  })
}

exports.graffiti = async (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Relation.findOne({
      where: {
        algo_id: 9,
        camera_id: req.params.id
      }
    }).then(async rel => {
      await db
        .con()
        .query(
          `SELECT * from graffiti WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
          function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              })
            }
            const ress = {}
            let cache = ''
            for (const v of result) {
              if (cache == '') {
                cache =
                  v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              }

              if (
                cache !=
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                while (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  let t = new Date(cache + ':00:00').getTime()
                  // Add one hours to date
                  t += 60 * 60 * 1000
                  cache = new Date(t)
                  ress[
                    cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  ] =
                    ress[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] + 1 || 1

                  cache =
                    cache.getFullYear() +
                    '-' +
                    (cache.getMonth() + 1) +
                    '-' +
                    cache.getDate() +
                    ' ' +
                    cache.getHours()
                }
              }
              if (
                cache ==
                v.time.getFullYear() +
                  '-' +
                  (v.time.getMonth() + 1) +
                  '-' +
                  v.time.getDate() +
                  ' ' +
                  v.time.getHours()
              ) {
                ress[
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] =
                  ress[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] + 1 || 1
              }
              let d = v.time
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
              v.picture = `${d}_${v.id}.jpg`
              v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/graffiti/${req.params.id}/${v.picture}`
              v.movie = `${d}_${v.id}_video.mp4`
              v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/graffiti/${req.params.id}/${v.movie}`
            }
            const a = {
              total: result.length,
              raw: result,
              rel: rel,
              over: ress
            }
            res.status(200).json({
              success: true,
              data: a
            })
          }
        )
    })
  })
}

exports.am = async (req, res) => {
  const data = req.body
  const name = 'attendances'
  Relation.findOne({
    where: {
      algo_id: 18,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const a = {
            total: result.length,
            raw: result,
            rel: rel,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.trafficSignal = async (req, res) => {
  const data = req.body
  const name = 'trafficsignal'
  Relation.findOne({
    where: {
      algo_id: 75,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          for(const n of result){
            n['picture'] = `${genName.genName(n.time,n.id)}.jpg`
            n['movie'] = `${genName.genName(n.time,n.id)}_video.mp4`
          }
          const a = {
            total: result.length,
            raw: result,
            rel: rel,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.flashingNudity = async (req, res) => {
  const data = req.body
  const name = 'FlashingNudity'
  Relation.findOne({
    where: {
      algo_id: 76,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          for(const n of result){
            n['picture'] = `${genName.genName(n.time,n.track_id)}.jpg`
            n['movie'] = `${genName.genName(n.time,n.id)}_video.mp4`
          }
          const a = {
            total: result.length,
            raw: result,
            rel: rel,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.stalkingWomanArea = async (req, res) => {
  const data = req.body
  const name = 'stalkingWomanArea'
  Relation.findOne({
    where: {
      algo_id: 77,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          for(const n of result){
            n['picture'] = `${genName.genName(n.time,n.id)}.jpg`
            n['movie'] = `${genName.genName(n.time,n.id)}_video.mp4`
          }
          const a = {
            total: result.length,
            raw: result,
            rel: rel,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.stalkingWomanNight = async (req, res) => {
  const data = req.body
  const name = 'stalkingWomanNight'
  Relation.findOne({
    where: {
      algo_id: 78,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          for(const n of result){
            n['picture'] = `${genName.genName(n.time,n.id)}.jpg`
            n['movie'] = `${genName.genName(n.time,n.id)}_video.mp4`
          }
          const a = {
            total: result.length,
            raw: result,
            rel: rel,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.stalkingWomanScooty = async (req, res) => {
  const data = req.body
  const name = 'stalkingWomanScooty'
  Relation.findOne({
    where: {
      algo_id: 79,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          for(const n of result){
            n['picture'] = `${genName.genName(n.time,n.id)}.jpg`
            n['movie'] = `${genName.genName(n.time,n.id)}_video.mp4`
          }
          const a = {
            total: result.length,
            raw: result,
            rel: rel,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.InjuryAndBlood = async (req, res) => {
  const data = req.body
  const name = 'InjuryAndBlood'
  Relation.findOne({
    where: {
      algo_id: 81,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          for(const n of result){
            n['picture'] = `${genName.genName(n.time,n.track_id)}.jpg`
            n['movie'] = `${genName.genName(n.time,n.track_id)}_video.mp4`
          }
          const a = {
            total: result.length,
            raw: result,
            rel: rel,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.SuicideTendency = async (req, res) => {
  const data = req.body
  const name = 'SuicideTendency'
  Relation.findOne({
    where: {
      algo_id: 82,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          for(const n of result){
            n['picture'] = `${genName.genName(n.time,n.track_id)}.jpg`
            n['movie'] = `${genName.genName(n.time,n.track_id)}_video.mp4`
          }
          const a = {
            total: result.length,
            raw: result,
            rel: rel,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.SmokersGroup = async (req, res) => {
  const data = req.body
  const name = 'SmokersGroup'
  Relation.findOne({
    where: {
      algo_id: 83,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          for(const n of result){
            n['picture'] = `${genName.genName(n.time,n.track_id)}.jpg`
            n['movie'] = `${genName.genName(n.time,n.track_id)}_video.mp4`
          }
          const a = {
            total: result.length,
            raw: result,
            rel: rel,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.DrinkersGroup = async (req, res) => {
  const data = req.body
  const name = 'DrinkersGroup'
  Relation.findOne({
    where: {
      algo_id: 84,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          for(const n of result){
            n['picture'] = `${genName.genName(n.time,n.track_id)}.jpg`
            n['movie'] = `${genName.genName(n.time,n.track_id)}_video.mp4`
          }
          const a = {
            total: result.length,
            raw: result,
            rel: rel,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.TeasingWoman = async (req, res) => {
  const data = req.body
  const name = 'TeasingWoman'
  Relation.findOne({
    where: {
      algo_id: 85,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          for(const n of result){
            n['picture'] = `${genName.genName(n.time,n.track_id)}.jpg`
            n['movie'] = `${genName.genName(n.time,n.track_id)}_video.mp4`
          }
          const a = {
            total: result.length,
            raw: result,
            rel: rel,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.OpenDefecation = async (req, res) => {
  const data = req.body
  const name = 'OpenDefecation'
  Relation.findOne({
    where: {
      algo_id: 86,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          for(const n of result){
            n['picture'] = `${genName.genName(n.time,n.track_id)}.jpg`
            n['movie'] = `${genName.genName(n.time,n.track_id)}_video.mp4`
          }
          const a = {
            total: result.length,
            raw: result,
            rel: rel,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.acidAttack = async (req, res) => {
  const data = req.body
  const name = 'AcidAttack'
  Relation.findOne({
    where: {
      algo_id: 87,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          for(const n of result){
            n['picture'] = `${genName.genName(n.time,n.track_id)}.jpg`
            n['movie'] = `${genName.genName(n.time,n.track_id)}_video.mp4`
          }
          const a = {
            total: result.length,
            raw: result,
            rel: rel,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.audioGunshot = async (req, res) => {
  const data = req.body
  const name = 'gunshotAudio'
  Relation.findOne({
    where: {
      algo_id: 80,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          for(const n of result){
            n['picture'] = `${genName.genName(n.time,n.track_id)}.jpg`
            n['movie'] = `${genName.genName(n.time,n.track_id)}_video.mp4`
          }
          const a = {
            total: result.length,
            raw: result,
            rel: rel,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.disrobing = async (req, res) => {
  const data = req.body
  const name = 'disrobing'
  Relation.findOne({
    where: {
      algo_id: 47,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            ress: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.zigzag = async (req, res) => {
  const data = req.body
  const name = 'ZigzagDriving'
  Relation.findOne({
    where: {
      algo_id: 88,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            ress: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.malebehaviour = async (req, res) => {
  const data = req.body
  const name = 'malebehaviour'
  Relation.findOne({
    where: {
      algo_id: 90,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            ress: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.malemovement = async (req, res) => {
  const data = req.body
  const name = 'malemovement'
  Relation.findOne({
    where: {
      algo_id: 89,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            ress: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.purse = async (req, res) => {
  const data = req.body
  const name = 'PurseSnatching'
  Relation.findOne({
    where: {
      algo_id: 48,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.AbnormalBehavior = async (req, res) => {
  const data = req.body
  const name = 'AbnormalBehavior'
  Relation.findOne({
    where: {
      algo_id: 91,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.jaywalking = async (req, res) => {
  const data = req.body
  const name = 'jaywalking'
  Relation.findOne({
    where: {
      algo_id: 91,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.AbnormalRunning = async (req, res) => {
  const data = req.body
  const name = 'AbnormalRunning'
  Relation.findOne({
    where: {
      algo_id: 93,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.GamblingSpot = async (req, res) => {
  const data = req.body
  const name = 'GamblingSpot'
  Relation.findOne({
    where: {
      algo_id: 94,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.FrequentVisiting = async (req, res) => {
  const data = req.body
  const name = 'FrequentVisiting'
  Relation.findOne({
    where: {
      algo_id: 95,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.StrandedGirl = async (req, res) => {
  const data = req.body
  const name = 'StrandedGirl'
  Relation.findOne({
    where: {
      algo_id: 96,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.UnconsciousWoman = async (req, res) => {
  const data = req.body
  const name = 'UnconsciousWoman'
  Relation.findOne({
    where: {
      algo_id: 97,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.StuntBikers = async (req, res) => {
  const data = req.body
  const name = 'StuntBikers'
  Relation.findOne({
    where: {
      algo_id: 98,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.InkThrowing = async (req, res) => {
  const data = req.body
  const name = 'InkThrowing'
  Relation.findOne({
    where: {
      algo_id: 99,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.DrugsDistribution = async (req, res) => {
  const data = req.body
  const name = 'DrugsDistribution'
  Relation.findOne({
    where: {
      algo_id: 100,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.PornographicMaterial = async (req, res) => {
  const data = req.body
  const name = 'PornographicMaterial'
  Relation.findOne({
    where: {
      algo_id: 101,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.Kidnapping = async (req, res) => {
  const data = req.body
  const name = 'Kidnapping'
  Relation.findOne({
    where: {
      algo_id: 102,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.WomenSafety = async (req, res) => {
  const data = req.body
  const name = 'WomenSafety'
  Relation.findOne({
    where: {
      algo_id: 103,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.WomenCollapse = async (req, res) => {
  const data = req.body
  const name = 'WomenCollapse'
  Relation.findOne({
    where: {
      algo_id: 104,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.WomenViolence = async (req, res) => {
  const data = req.body
  const name = 'WomenViolence'
  Relation.findOne({
    where: {
      algo_id: 105,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.SlappingWomen = async (req, res) => {
  const data = req.body
  const name = 'SlappingWomen'
  Relation.findOne({
    where: {
      algo_id: 106,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.AnprSnatching = async (req, res) => {
  const data = req.body
  const name = 'AnprSnatching'
  Relation.findOne({
    where: {
      algo_id: 107,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.MenAtShadowArea = async (req, res) => {
  const data = req.body
  const name = 'MenAtShadowArea'
  Relation.findOne({
    where: {
      algo_id: 108,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.FreqVisiting = async (req, res) => {
  const data = req.body
  const name = 'FreqVisiting'
  Relation.findOne({
    where: {
      algo_id: 109,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.jumpTrack = async (req, res) => {
  const data = req.body
  const name = 'JumpOnTrack'
  Relation.findOne({
    where: {
      algo_id: 112,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.edgeCross = async (req, res) => {
  const data = req.body
  const name = 'PFEdgeCrossing'
  Relation.findOne({
    where: {
      algo_id: 111,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.uniformtracking = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    let wh
    if (decoded.id_branch != 0000) {
      wh = {
        id_branch: decoded.id_branch,
        algo_id: 110
      }
    } else {
      wh = {
        id_account: decoded.id_account,
        algo_id: 110
      }
    }
    Relation.findOne({
      where: wh
    })
      .then(async rel => {
        await db
          .con()
          .query(
            `SELECT * from uniformtracking WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
            function (err, result) {
              if (err)
                return res.status(500).json({
                  success: false,
                  message: err
                })
              let days = Math.round(
                (new Date(data.end) - new Date(data.start)) / (1000 * 60 * 60 * 24)
              )
              let avg = 0
              let min = 0
              let max = 0
              var ress = {}
              var dwell = []
              var labelsD = []
              result.forEach(function (v) {
                ress[v.time.getHours()] = (ress[v.time.getHours()] || 0) + 1
                dwell.push(v.dwell)
                labelsD.push(v.time)
                avg = avg + v.dwell
                if (min == 0) {
                  min = v.dwell
                } else if (v.dwell < min) {
                  min = v.dwell
                }
                if (max == 0) {
                  max = v.dwell
                } else if (v.dwell > max) {
                  max = v.dwell
                }
                let d = v.time
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
                v.picture = `${d}_${v.track_id}.jpg`
                v.movie = `${d}_${v.track_id}_video.mp4`
                //v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/loitering/${req.params.id}/${v.movie}`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/uniformtracking/${req.params.id}/${v.picture}`
                // let l = v.dwell / rel.atributes[1].time - 1
                // if (l >= 2) {
                //   l = 2
                // }
                // let r
                // switch (l) {
                //   case 0: {
                //     r = 'Low'
                //     break
                //   }
                //   case 1: {
                //     r = 'Med'
                //     break
                //   }
                //   case 2: {
                //     r = 'High'
                //     break
                //   }
                // }
                // v['severity'] = l
                // v['alert'] = r
              })
              avg = Math.round((avg / result.length) * 100) / 100
              let av = result.length / (24 * days)
              let a = {
                total: result.length,
                avgH: Math.round(av * 100) / 100,
                avgS: Math.round((av / (60 * 60)) * 100) / 100,
                raw: result,
                dwell: dwell,
                labelsD: labelsD,
                histogram: ress,
                min: min,
                max: max,
                avg: avg
              }
              res.status(200).json({
                success: true,
                data: a
              })
            }
          )
      })
      .catch(err => {
        return res.status(500).send({
          success: false,
          message: err
        })
      })
  })
}

exports.streetVendor = async (req, res) => {
  const data = req.body
  const name = 'street_vendor'
  Relation.findOne({
    where: {
      algo_id: 115,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.nurseDwell = async (req, res) => {
  const data = req.body
  const name = 'nurse_dwelling'
  Relation.findOne({
    where: {
      algo_id: 116,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}

exports.bagdetected = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    let wh
    if (decoded.id_branch != 0000) {
      wh = {
        id_branch: decoded.id_branch,
        algo_id: 117
      }
    } else {
      wh = {
        id_account: decoded.id_account,
        algo_id: 117
      }
    }
    Relation.findOne({
      where: wh
    })
      .then(async rel => {
        await db
          .con()
          .query(
            `SELECT * from bagdetected WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
            function (err, result) {
              if (err)
                return res.status(500).json({
                  success: false,
                  message: err
                })
              let days = Math.round(
                (new Date(data.end) - new Date(data.start)) / (1000 * 60 * 60 * 24)
              )
              let ress = {}
              let avg = 0
              let cache = ''
              let ressover = {}
              result.forEach(function (v) {
                if (cache == '') {
                  cache =
                    v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                }

                if (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  while (
                    cache !=
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ) {
                    let t = new Date(cache + ':00:00').getTime()
                    t += 60 * 60 * 1000
                    cache = new Date(t)
                    ressover[
                      cache.getFullYear() +
                        '-' +
                        (cache.getMonth() + 1) +
                        '-' +
                        cache.getDate() +
                        ' ' +
                        cache.getHours()
                    ] = 0
                    cache =
                      cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  }
                }
                if (
                  cache ==
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  ressover[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] =
                    (ressover[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] || 0) + 1
                }
                ress[v.zone] = (ress[v.zone] || 0) + 1
                avg = avg + v.dwell
                let d = v.time
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
                v['picture'] = `${d}_${v.track_id}_zone${v.zone}.jpg`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/bagdetected/${req.params.id}/${v.picture}`
                v.movie = `${d}_${v.track_id}_video.mp4`
                v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/bagdetected/${req.params.id}/${v.movie}`
              })
              let lo = []
              for (var l of Object.keys(ress)) {
                lo.push({
                  name: l,
                  value: ress[l],
                  perc: JSON.stringify(Math.round((ress[l] / result.length) * 100)) + '%'
                })
              }
              let av = result.length / (24 * days)
              let a = {
                total: result.length,
                avgH: Math.round(av * 100) / 100,
                raw: result,
                donut: lo,
                over: ressover
              }
              res.status(200).json({
                success: true,
                data: a
              })
            }
          )
      })
      .catch(err => {
        return res.status(500).send({
          success: false,
          message: err
        })
      })
  })
}

 
exports.absences = async (req, res) => {
  let token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    let wh
    if (decoded.id_branch != 0000) {
      wh = {
        id_branch: decoded.id_branch,
        algo_id: 118
      }
    } else {
      wh = {
        id_account: decoded.id_account,
        algo_id: 118
      }
    }
    Relation.findOne({
      where: wh
    })
      .then(async rel => {
        await db
          .con()
          .query(
            `SELECT * from absences WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
            function (err, result) {
              if (err)
                return res.status(500).json({
                  success: false,
                  message: err
                })
              let days = Math.round(
                (new Date(data.end) - new Date(data.start)) / (1000 * 60 * 60 * 24)
              )
              let ress = {}
              let avg = 0
              let cache = ''
              let ressover = {}
              result.forEach(function (v) {
                if (cache == '') {
                  cache =
                    v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                }

                if (
                  cache !=
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  while (
                    cache !=
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ) {
                    let t = new Date(cache + ':00:00').getTime()
                    t += 60 * 60 * 1000
                    cache = new Date(t)
                    ressover[
                      cache.getFullYear() +
                        '-' +
                        (cache.getMonth() + 1) +
                        '-' +
                        cache.getDate() +
                        ' ' +
                        cache.getHours()
                    ] = 0
                    cache =
                      cache.getFullYear() +
                      '-' +
                      (cache.getMonth() + 1) +
                      '-' +
                      cache.getDate() +
                      ' ' +
                      cache.getHours()
                  }
                }
                if (
                  cache ==
                  v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ) {
                  ressover[
                    v.time.getFullYear() +
                      '-' +
                      (v.time.getMonth() + 1) +
                      '-' +
                      v.time.getDate() +
                      ' ' +
                      v.time.getHours()
                  ] =
                    (ressover[
                      v.time.getFullYear() +
                        '-' +
                        (v.time.getMonth() + 1) +
                        '-' +
                        v.time.getDate() +
                        ' ' +
                        v.time.getHours()
                    ] || 0) + 1
                }
                ress[v.zone] = (ress[v.zone] || 0) + 1
                avg = avg + v.dwell
                let d = v.time
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
                v['picture'] = `${d}_${v.track_id}_zone${v.zone}.jpg`
                v.pic_path = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/absences/${req.params.id}/${v.picture}`
                v.movie = `${d}_${v.track_id}_video.mp4`
                v.vid = `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/absences/${req.params.id}/${v.movie}`
              })
              let lo = []
              for (var l of Object.keys(ress)) {
                lo.push({
                  name: l,
                  value: ress[l],
                  perc: JSON.stringify(Math.round((ress[l] / result.length) * 100)) + '%'
                })
              }
              let av = result.length / (24 * days)
              let a = {
                total: result.length,
                avgH: Math.round(av * 100) / 100,
                raw: result,
                donut: lo,
                over: ressover
              }
              res.status(200).json({
                success: true,
                data: a
              })
            }
          )
      })
      .catch(err => {
        return res.status(500).send({
          success: false,
          message: err
        })
      })

    })
  }

exports.bycicleMotor = async (req, res) => {
  const data = req.body
  const name = 'bycicleMotor'
  Relation.findOne({
    where: {
      algo_id: 119,
      camera_id: req.params.id
    }
  }).then(async rel => {
    await db
      .con()
      .query(
        `SELECT * from ${name} WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            })
          }
          const resu = graph.generateWithName(result)
          const a = {
            total: result.length,
            raw: resu.array,
            rel: rel,
            over: resu.ress,
            folder: name
          }
          res.status(200).json({
            success: true,
            data: a
          })
        }
      )
  })
}