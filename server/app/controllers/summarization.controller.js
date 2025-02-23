const db = require('../models')
require('dotenv').config({ path: '../../../config.env' })
const Camera = db.camera
const Relations = db.relation
const ffmpeg = require('fluent-ffmpeg')
const ffprobe = require('ffprobe-static')
const mapping = require('../helpers/mapping').map
const dbconn = require('../models/dbmysql')
const fs = require('fs').promises
const path = require('path')
const dir = process.env.resourcePath
const axios = require('axios')
const os = require('os')
const SumVid = db.sumVid
const SV = db.sv
const { v4: uuidv4 } = require('uuid')
const Op = db.Sequelize.Op

if (os.type().toLocaleLowerCase().includes('windows')) {
  ffmpeg.setFfprobePath(ffprobe.path)
}

function getVideoDuration (url) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(url, (err, metadata) => {
      if (err) {
        reject(err)
      } else {
        resolve(metadata.format.duration)
      }
    })
  })
}

function addSecondsToDate (dateString, secondsToAdd) {
  const date = new Date(dateString)
  date.setTime(date.getTime() + secondsToAdd * 1000)
  return date.toISOString()
}

function addHoursToDate (dateString, secondsToAdd) {
  const date = new Date(dateString)
  date.setTime(date.getTime() + secondsToAdd * 1000 * 60 * 60)
  return date.toISOString()
}

function structure (date) {
  let d = date
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
  return d
}

exports.analyticsData = async (req, res) => {
  const cameraId = req.params.id
  const data = req.body
  let algorithmIds = data.algorithmId
  let pageSize = Number(req.query.pageSize)
  const pageOffset = Number(req.query.pageOffset)

  if (!req.query.pageSize || req.query.pageSize === 0) {
    pageSize = 10
  }

  if (req.query.pageSize && (!Number.isInteger(pageSize) || Number.isInteger(pageSize) < 0)) {
    return res.status(401).send({
      message: 'Page size should be numeric'
    })
  }

  if (req.query.pageOffset && (!Number.isInteger(pageOffset) || Number.isInteger(pageOffset) < 0)) {
    return res.status(401).send({
      message: 'Page offset should be numeric'
    })
  }

  try {
    const camera = await Camera.findOne({
      where: { id: cameraId },
      attributes: ['id', 'name', 'rtsp_in', 'http_in', 'createdAt']
    })

    if (!camera) {
      return res.status(404).json({ success: false, message: 'Camera not found', data: null })
    }

    if (!algorithmIds && algorithmIds !== 0) {
      return res.status(401).json({ success: false, message: 'Algorithm id(s) not provided', data: null })
    }

    if (!Array.isArray(algorithmIds)) {
      const arr = []
      arr.push(algorithmIds)
      algorithmIds = arr
    } else {
      algorithmIds = [...new Set(algorithmIds)]
    }

    let resultData = []

    for (const algorithmId of algorithmIds) {
      if (!mapping[algorithmId]) {
        return res.status(401).json({ success: false, message: `Algorithm for algorithm id: ${algorithmId} not found`, data: null })
      }

      if ((algorithmId || algorithmId === 0) && camera) {
        // const rels = await Relations.findAll({
        //   where: { camera_id: cameraId, algo_id: algorithmId }
        // })

        // if (!rels || rels.length === 0) {
        //   return res.status(401).json({ success: false, message: `Algorithm with algorithm id: ${algorithmId} not associated with camera id: ${cameraId}`, data: null })
        // }

        const data = await getAlgorithmData(camera, algorithmId, pageOffset, pageSize, req.id_branch, req.id_account)
        resultData = resultData.concat(data)
      }
    }

    if (resultData && Object.keys(resultData).length > 0) {
      return res.status(200).json({ success: true, message: `Analytics Data found for algorithm id(s) ${algorithmIds}`, len: resultData.length, data: resultData })
    } else {
      return res.status(404).json({ success: false, message: `Analytics Data not found for algorithm id(s) ${algorithmIds}`, data: null })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: err })
  }
}

const getAlgorithmData = async (camera, algorithmId, pageOffset, pageSize, idBranch, idAccount) => {
  return new Promise((resolve, reject) => {
    const countQuery = `SELECT count(*) as count from ${mapping[algorithmId].algorithm} WHERE cam_id = '${camera.id}'`
    let dataQuery = `SELECT * from ${mapping[algorithmId].algorithm} WHERE cam_id = '${camera.id}' order by time desc limit ${pageOffset}, ${pageSize}`

    if ((pageOffset !== 0 && !pageOffset) || !pageSize) {
      dataQuery = `SELECT * from ${mapping[algorithmId].algorithm} WHERE cam_id = '${camera.id}' order by time desc`
    }

    let link = camera.http_in
    if (link && !link.includes('http')) {
      link = `http://${camera.http_in}`
    }

    getVideoDuration(link)
      .then(async (duration) => {
        dbconn
          .con()
          .query(countQuery, async function (err, countResult) {
            if (err) {
              return reject(err)
            }

            if (countResult.length === 0) {
              return resolve([])
            }

            dbconn
              .con().query(dataQuery, async function (err, dataResult) {
                if (err) {
                  return reject(err)
                }

                if (dataResult.length === 0) {
                  return resolve([])
                }

                const latest = dataResult[0].time ? addSecondsToDate(dataResult[0].time, duration) : null
                const data = []
                let videoClip = ''
                let image = ''

                if (latest) {
                  for (const res of dataResult) {
                    if (res.time >= new Date(latest)) {
                      break
                    }
                    videoClip = structure(res.time)
                    image = `http://${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${idAccount}/${idBranch}/${mapping[algorithmId].algorithm}/${camera.id}/${videoClip}_${res.track_id}.jpg`
                    videoClip = `http://${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${idAccount}/${idBranch}/${mapping[algorithmId].algorithm}/${camera.id}/${videoClip}_${res.track_id}_video.mp4`
                  }
                }

                for (const res of dataResult) {
                  let rowData = {}

                  if (mapping[algorithmId].attributes) {
                    for (const attribute of mapping[algorithmId].attributes) {
                      rowData[attribute] = res[attribute]
                    }
                  } else {
                    rowData = { ...rowData, ...res }
                  }
                  rowData.image = image
                  rowData.totalRows = countResult[0].count
                  rowData.videoClip = videoClip
                  rowData.algorithmId = algorithmId
                  data.push(rowData)
                }

                return resolve(data)
              })
          })
      }).catch(err => {
        console.error(err)
        reject(err)
      })
  })
}

exports.summ = async (req, res) => {
  const id = req.params.id
  const sumResources = `${dir}${req.id_account}/${req.id_branch}/summarization/`
  const cam = await Camera.findOne({
    where: { id: id },
    attributes: ['name', 'rtsp_in', 'http_in', 'createdAt']
  })
  const rels = await Relations.findAll({
    where: { camera_id: id }
  })
  let link = cam.http_in
  if (!cam.http_in.includes('http')) {
    link = `http://${cam.http_in}`
  }
  try {
    await fs.access(`${sumResources}${id}_data.json`)
    let data = await fs.readFile(`${sumResources}${id}_data.json`, 'binary')
    data = JSON.parse(data)
    const val = {
      sumVid: data.sumVid,
      paragraph: data.paragraph,
      oriVid: link,
      outcome: data.outcome
    }
    return res.status(200).json({ success: true, data: val })
  } catch (err) {
    getVideoDuration(link)
      .then(async duration => {
        const algos = {
          81: mapping[81],
          83: mapping[83],
          97: mapping[97],
          105: mapping[105],
          88: mapping[88],
          29: mapping[29],
          16: mapping[16],
          12: mapping[12],
          19: mapping[19],
          13: mapping[13],
          2: mapping[2],
          0: mapping[0],
          35: mapping[35],
          5: mapping[5],
          8: mapping[8],
          39: mapping[39],
          38: mapping[38],
          70: mapping[70]
        }
        let outcome = []
        let lastUpdt
        for (const rel of rels) {
          algos[rel.dataValues.algo_id] = true
          if (lastUpdt === undefined || lastUpdt < rel.dataValues.updatedAt) {
            lastUpdt = rel.dataValues.updatedAt
          }
          if (mapping[rel.dataValues.algo_id]) {
            algos[rel.dataValues.algo_id] = mapping[rel.dataValues.algo_id]
          }
        }
        if (process.env.TZ) {
          const diff = process.env.TZ.split('+')[1]
          lastUpdt = addHoursToDate(lastUpdt, diff)
        }
        if (lastUpdt === undefined) {
          lastUpdt = cam.dataValues.createdAt
        }
        if (Object.keys(algos).length === 0) {
          return res.status(200).json({
            success: true,
            data: {
              sumVid: '',
              paragraph: '',
              oriVid: ''
            }
          })
        }
        for (const alg of Object.keys(algos)) {
          if (algos[alg] !== true) {
            const query = `SELECT * from ${algos[alg].algorithm} WHERE cam_id = '${id}' and time >= ${JSON.stringify(lastUpdt)} order by time asc;`
            //   const query = `SELECT * from ${algos[alg]} WHERE cam_id = '${id}' and time >= '${lastUpdt}' and  time <= '${data.end}' order by time asc;`
            try {
              const result = await dbconn.query(query)
              if (result.length === 0) {
                continue
              }
              // const latest = addSecondsToDate(result[0].time, duration)
              for (const res of result) {
                // if (res.time >= new Date(latest)) {
                //   break
                // }
                let str = structure(res.time)
                let string
                if (algos[alg].algorithm === 'aod' || algos[alg].algorithm === 'collapse' || algos[alg].algorithm === 'crowd_count' || algos[alg].algorithm === 'fire' || algos[alg].algorithm === 'violence') {
                  str = `${str}_${res.id}_video.mp4`
                } else if (algos[alg].algorithm === 'weapon') {
                  str = `${str}_video.mp4`
                } else {
                  str = `${str}_${res.track_id}_video.mp4`
                }
                switch (alg) {
                  case '0': {
                    string = ''
                    break
                  }
                  case '2': {
                    string = 'Loitering detected at '
                    break
                  }
                  case '5': {
                    string = `Speeding of ${res.speed} detected at `
                    break
                  }
                  case '8': {
                    string = 'Wrongway detected at '
                    break
                  }
                  case '12': {
                    string = `Crowd of ${res.count} detected at `
                    break
                  }
                  case '13': {
                    string = `${res.veh_colour} ${res.veh_type} plate ${res.plate} detected at `
                    break
                  }
                  case '16': {
                    string = `Abandoned ${res.object_type} of color ${res.object_colour} detected at `
                    break
                  }
                  case '19': {
                    string = 'Violence detected at '
                    break
                  }
                  case '26': {
                    string = `Vehicle ${res.vehicle_type} detected at `
                    break
                  }
                  case '29': {
                    string = 'Accident detected at '
                    break
                  }
                  case '32': {
                    let bottom
                    if (res.bottom_length === 'short') {
                      bottom = 'shorts'
                    } else {
                      bottom = 'pants'
                    }
                    string = `Person detected  wearing ${res.top_colour} ${res.sleeve_length} sleeve top and ${res.bottom_colour} ${bottom} at `
                    break
                  }
                  case '35': {
                    string = 'Weapon detected at '
                    break
                  }
                  case '38': {
                    let gender = res.gender
                    if (res.gender === 'not detected') {
                      gender = 'Person'
                    }
                    string = `${gender} collapsing detected at `
                    break
                  }
                  case '39': {
                    string = 'Fire detected at '
                    break
                  }
                  case '75': {
                    string = 'Traffic signal violated at '
                    break
                  }
                  case '70': {
                    string = `Congestion of ${res.no_of_vehicles} detected at `
                    break
                  }
                  case '77': {
                    string = 'Stalking of a woman detected at '
                    break
                  }
                  case '81': {
                    string = 'Violence detected at '
                    break
                  }
                  case '83': {
                    string = 'Smoking detected at '
                    break
                  }
                  case '88': {
                    string = `${res.veh_colour} ${res.veh_ype} zigzag driving identified as ${res.veh_anpr} detected at `
                    break
                  }
                  case '97': {
                    string = `Unconscious ${res.gender} detected at `
                    break
                  }
                  case '102': {
                    string = 'Kidnapping detected at '
                    break
                  }
                  case '105': {
                    string = 'Violence detected at '
                    break
                  }
                }
                let tmstmp = 0
                if (res.video_timestamp) {
                  tmstmp = res.video_timestamp
                }
                outcome.push({
                  clip: str,
                  time: res.time,
                  timestamp: tmstmp,
                  string: string,
                  alg: alg
                })
                // console.log(str)
              }
            } catch (err) {
              console.error(err)
              continue
            }
          }
        }
        // outcome = outcome.slice().sort((a, b) => +new Date(b.time) + +new Date(a.time))

        outcome = sortObjectsByTimestamp(outcome)
        let par = ''
        for (const val of outcome) {
          par = par + val.string
        }
        // const fileContent = outcome.map(item => `file '${item.clip}'`).join('\n')
        if (outcome.length === 0) {
          return res.status(200).json({
            success: true,
            data: {
              sumVid: '',
              paragraph: par,
              oriVid: link,
              outcome: outcome
            }
          })
        }
        let fileContent = ''
        for (const item of outcome) {
          try {
            if (item.clip && os.type().toLocaleLowerCase().includes('windows')) {
              item.clip = item.clip.replaceAll(':', '')
            }
            await fs.access(path.join(dir, req.id_account, req.id_branch, algos[item.alg].algorithm, id, item.clip))
            fileContent += `file '${path.resolve(dir, req.id_account, req.id_branch, algos[item.alg].algorithm, id, item.clip)}'\n`
          } catch (err) {
          //   console.log(`File not found and skipped: ${item.clip}`)
          }
        }
        const file = `${sumResources}filelist.txt`
        try {
          await fs.access(sumResources)
        } catch (err) {
          await fs.mkdir(sumResources)
        }
        const output = `${sumResources}${id}_stitchedVideo.mp4`
        const linkSumVid = `http://${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${req.id_account}/${req.id_branch}/summarization/${id}_stitchedVideo.mp4`
        try {
          await fs.writeFile(file, fileContent)
          await new Promise((resolve, reject) => {
            ffmpeg()
              .input(file)
              .inputOptions(['-f concat', '-safe 0', '-err_detect ignore_err'])
              .outputOptions('-c copy')
              .output(output)
              .on('end', async function () {
                console.log('Concatenation finished.')
                await fs.unlink(file)
                const val = {
                  sumVid: linkSumVid,
                  paragraph: par,
                  oriVid: link,
                  outcome: outcome
                }
                await fs.writeFile(`${sumResources}${id}_data.json`, JSON.stringify(val))
                res.status(200).json({ success: true, data: val })
                resolve()
              })
              .on('error', async function (err) {
                console.log('Error: ' + err.message)
                // await fs.unlink(file)
                res.status(500).json({ success: false, error: err, outcome: outcome })
                reject(err)
              })
              .run()
          })
        } catch (err) {
          console.error(err)
        }
      })
      .catch(err => {
        console.error(err)
        res.status(500).json({ success: false, error: err })
      })
  }
}

function timestampToSeconds (timestamp) {
  const [hours, minutes, seconds] = timestamp.split(':').map(Number)
  return hours * 3600 + minutes * 60 + seconds
}

function sortObjectsByTimestamp (objects) {
  return objects.sort((a, b) => {
    return timestampToSeconds(a.timestamp) - timestampToSeconds(b.timestamp)
  })
}

exports.sumDock = async (req, res) => {
  const id = req.params.id

  try {
    const cam = await Camera.findOne({
      where: { id: id },
      attributes: ['name', 'rtsp_in', 'http_in', 'createdAt']
    })
    let pat = cam.rtsp_in.split('/')
    pat.pop()
    pat = pat.join('/')
    let link = cam.http_in

    if (!cam.http_in.includes('http')) {
      link = `http://${cam.http_in}`
    }
    const duration = await getVideoDuration(link)
    let dur = 300
    if (duration < 10) {
      dur = 3 * (duration - 1)
    }
    const name = cam.rtsp_in.split('/').pop()
    const formatAndName = name.split('.')
    const options = {
      id: id,
      path: pat,
      name: name,
      duration: dur
    }
    const config = {
      timeout: 100000000 // 10 seconds
    }
    const outFile = path.join(dir, req.id_account, req.id_branch, 'videos', `VS${formatAndName[0]}.mp4`)
    const outLink = `http://${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${req.id_account}/${req.id_branch}/videos/VS${formatAndName[0]}.mp4`
    // console.log(outLink, name, formatAndName)
    try {
      await fs.access(outFile)
      return res.status(203).json({ success: true, data: { file: outFile, link: outLink } })
    } catch (err) {
      // const duration = await getVideoDuration(cam.rtsp_in)
      // if (duration < (3 * 60)) {
      //   return res.status(403).json({ success: false, error: 'Video too short, needs to be at least 3 minutes long.' })
      // }
      const resul = await axios.post(`http://${process.env.my_ip}:${process.env.PORTPYTHON}/api2/sum`, options, config)
      ffmpeg(resul.data.path) // Input file
        .videoCodec('libx264') // Set video codec to libx264
        .output(outFile) // Output file
        .on('end', async function () {
          await fs.unlink(resul.data.path)
          return res.status(200).json({ success: true, data: { file: outFile, link: outLink } })
        })
        .on('error', function (err) {
          console.error(err)
          return res.status(500).json({ success: false, error: err })
        })
        .saveToFile(outFile, '-y')
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: err })
  }
}

exports.gpt = async (req, res) => {
  const data = req.body
  const query = `SELECT * from vs_gpt_summary where video_id = '${data.id}';`
  try {
    const resultQuery = await dbconn.query(query)
    if (resultQuery.length !== 0) {
      return res.status(200).json({ success: true, data: resultQuery[0] })
    }
    await axios.post(`http://${process.env.my_ip}:${process.env.PORTPYTHONGPT}/api3/gpt`, data)
    const resultAfterGpt = await dbconn.query(query)
    return res.status(200).json({ success: true, data: resultAfterGpt[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: err })
  }
}

exports.multSum = async (req, res) => {
  const data = req.body
  const sumResources = `${dir}${req.id_account}/${req.id_branch}/summarization/`
  const id = uuidv4()
  try {
    const match = await checkMatchingCounts(data)
    if (match !== false) {
      const sumVid = await SumVid.findOne({
        where: {
          id: match
        }
      })
      return res.status(203).json({ success: true, id: sumVid.dataValues.id })
    }
    let fileContent = ''
    const filePaths = []
    for (const vid of data) {
      try {
        const cam = await Camera.findOne({
          where: {
            id: vid
          }
        })
        let item = cam.dataValues.rtsp_in
        filePaths.push(item)
        if (item && os.type().toLocaleLowerCase().includes('windows')) {
          item = item.replaceAll(':', '')
        }
        await fs.access(item)
        fileContent += `file '${item}'\n`
      } catch (err) {
        console.log(`File not found and skipped: ${vid}`)
      }
    }
    const file = `${sumResources}filelistMultiple.txt`
    try {
      await fs.access(sumResources)
    } catch (err) {
      await fs.mkdir(sumResources)
    }
    const output = `${sumResources}${id}_sumVid.mp4`
    const linkSumVid = `http://${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${req.id_account}/${req.id_branch}/summarization/${id}_sumVid.mp4`
    try {
      await fs.writeFile(file, fileContent)
      // const filters = []
      // for (let i = 0; i < filePaths.length; i++) {
      //   filters.push(`[${i}:v]setpts=PTS-STARTPTS[v${i}]`)
      // }
      // // const filterGraph = `${filters.join(';')}[${filePaths.length}:v]concat=n=${filePaths.length}:v=1:a=0[out]`
      // let filterGraph = `${filters.join(';')};[v0]`
      // for (let i = 1; i < filePaths.length; i++) {
      //   filterGraph += `[v${i}]`
      // }
      // filterGraph += `concat=n=${filePaths.length}:v=1:a=0[out]`

      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(file)
          .inputOptions(['-f concat', '-safe 0'])
          .outputOptions(['-c:v copy', '-r 30', '-vsync cfr'])
          .output(output)
          .on('end', async function () {
            await fs.unlink(file)
            const sumVid = await SumVid.create({
              id: id,
              rtsp_in: output,
              http_in: linkSumVid,
              id_account: req.id_account,
              id_branch: req.id_branch
            })
            const roles = await Camera.findAll({
              where: {
                id: {
                  [Op.or]: data
                }
              }
            })
            await sumVid.setCameras(roles)
            // await fs.writeFile(`${sumResources}${id}_data.json`, JSON.stringify(val))
            res.status(200).json({ success: true, id: id })
            resolve()
          })
          .on('error', async function (err) {
            console.log('Error: ' + err.message)
            // await fs.unlink(file)
            res.status(500).json({ success: false, error: err })
            reject(err)
          })
          .run()
      })
    } catch (err) {
      console.error(err)
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, err: err })
  }
}

async function checkMatchingCounts (ids) {
  try {
    ids.sort((a, b) => {
      const nameA = a.toUpperCase()
      const nameB = b.toUpperCase()
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      return 0
    })
    const counts = await SV.findAll({
      attributes: ['sumId', [db.sequelize.fn('GROUP_CONCAT', db.sequelize.col('vidId')), 'vidIds']],
      group: ['sumId']
    })
    // console.log(counts)
    for (const count of counts) {
      const arr = count.dataValues.vidIds.split(',').sort((a, b) => {
        const nameA = a.toUpperCase()
        const nameB = b.toUpperCase()
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
      if (areArraysEqual(arr, ids)) {
        return count.dataValues.sumId
      }
    }
    return false
  } catch (error) {
    console.error('Error checking matching counts:', error)
    return false
  }
}

function areArraysEqual (arr1, arr2) {
  // Step 1: Check if both arrays have the same length
  if (arr1.length !== arr2.length) {
    return false
  }

  // Step 2: Iterate over each element of the arrays
  for (let i = 0; i < arr1.length; i++) {
    // Step 3: Compare elements at corresponding positions
    if (arr1[i] !== arr2[i]) {
      // Step 4: Return false if any pair of elements differs
      return false
    }
  }
  // If all elements match, return true
  return true
}
