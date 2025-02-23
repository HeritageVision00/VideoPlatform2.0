const db = require('../models')
require('dotenv').config({ path: '../../../config.env' })
const Mic = db.mic
const Relations = db.relation
const User = db.user
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const axios = require('axios')
const Stream = require('node-rtsp-stream')
const multer = require('multer')
const fs = require('fs')

const my_ip = process.env.my_ip

exports.addCamera = (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, (_err, decoded) => {
    const uuid = uuidv4()
    // Save User to Database
    Mic.create({
      id: uuid,
      name: req.body.name,
      rtsp_in: req.body.rtsp_in,
      id_account: decoded.id_account,
      id_branch: decoded.id_branch,
      stored_vid: 'No',
      atributes: {
        longitude: req.body.atributes.longitude,
        latitude: req.body.atributes.latitude
      }
    })
      .then(_camera => {
        res
          .status(200)
          .send({ success: true, message: 'Microphone was registered successfully!', id: uuid })
      })
      .catch(err => {
        console.error(err)
        res.status(500).send({ success: false, message: err.message })
      })
  })
}

exports.viewCams = async (req, res) => {
  const user = await User.findOne({
    where: { id_branch: req.id_branch }
  })
  Mic.findAll({
    where: { id_branch: req.id_branch },
    attributes: ['name', 'id', 'createdAt', 'updatedAt', 'stored_vid']
  })
    .then(cameras => {
      if (user.am === 1) {
        cameras.push({
          name: 'Webcam',
          id: 'aa-00-cc'
        })
      }
      res.status(200).send({ success: true, data: cameras })
    })
    .catch(err => {
      res.status(500).send({ success: false, message: err.message })
    })
}

exports.viewCamsHealth = (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    Mic.findAll({
      where: { id_branch: decoded.id_branch },
      attributes: ['name', 'id', 'createdAt', 'updatedAt', 'health_status', 'rtsp_in']
    })
      .then(cameraHealthStatus => {
        res.status(200).send({ success: true, data: cameraHealthStatus })
      })
      .catch(err => {
        res.status(500).send({ success: false, message: err.message })
      })
  })
}

exports.viewLiveCams = (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    Mic.findAll({
      where: { id_branch: decoded.id_branch },
      attributes: ['name', 'id', 'createdAt', 'updatedAt', 'heatmap_pic', 'stored_vid']
    })
      .then(cameras => {
        res.status(200).send({ success: true, data: cameras })
      })
      .catch(err => {
        res.status(500).send({ success: false, message: err.message })
      })
  })
}

exports.viewCam = (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.params
  const port = process.env.PORTSTREAM

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    Mic.findOne({
      where: { id: data.id, id_branch: decoded.id_branch }
    })
      .then(camera => {
        res.status(200).send({ success: true, data: camera })
        // try {
        //   playStream = new Stream({
        //     name: Mic.name,
        //     streamUrl: Mic.rtsp_in,
        //     wsPort: port,
        //     ffmpegOptions: {
        //       '-stats': '',
        //       '-r': 30,
        //       '-s': '640x480'
        //     },
        //     height: 480,
        //     width: 640,
        //     fps: 15
        //   })
        //   // res.status(200).send({ success: true, data: camera, url: `ws://${my_ip}:${port}` })
        //   console.log(playStream)
        //   // playStream.wsServer.onClose()
        //   res.status(200).send({ success: true, url: `ws://${my_ip}:${port}`, pid: playStream.stream.pid, data: camera })
        // } catch (e) {
        //   console.error(e)
        //   res.status(500).send({ success: false, message: e.message })
        // }
      })
      .catch(err => {
        res.status(500).send({ success: false, message: err.message })
      })
  })
}

exports.delCam = async (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    const mic = await Mic.findOne({
      where: { id: req.params.id, id_branch: decoded.id_branch }
    })
    if(mic.stored_vid === 'Yes'){
      fs.unlink(mic.rtsp_in, err => {
        if (err) console.log({ success: false, message: 'Image error: ' + err })
      })
    }
    Mic.destroy({
      where: { id: req.params.id, id_branch: decoded.id_branch }
    })
      .then(_cam => {
        res.status(200).send({ success: true, camera: req.params.uuid })
      })
      .catch(err => {
        res.status(500).send({ success: false, message: err.message })
      })
  })
}

exports.editCam = (req, res) => {
  const updt = req.body
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    Mic.update(updt, {
      where: { id: req.params.id, id_branch: decoded.id_branch, stored_vid: 'No' }
    })
      .then(_cam => {
        res.status(200).send({ success: true, data: updt })
      })
      .catch(err => {
        res.status(500).send({ success: false, message: err.message })
      })
  })
}

exports.addAtr = async (req, res) => {
  try {
    res.status(200).send({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).send({ success: false, message: err })
  }
}

function getStream (camera, port, id, tries) {
  if (tries === undefined) {
    tries = 0
  }
  return new Promise((resolve, reject) => {
    if (tries >= 3) {
      return reject(tries)
    }
    console.log('Proando stream', port, tries)
    const stream = new Stream({
      name: Mic.name,
      streamUrl: Mic.rtsp_in,
      height: 480,
      width: 640,
      wsPort: port,
      fps: 15,
      ffmpegOptions: {
        // options ffmpeg flags
        '-stats': '', // an option with no neccessary value uses a blank string
        '-r': 30, // options with required values specify the value after the key
        '-s': '640x480'
      }
    })

    stream.on('exitWithError', error => {
      stream.stop()
      reject(error)
    })

    let sent = false

    stream.on('camdata', _data => {
      if (sent) return

      streams.push({ str: stream, id: id, port: port })
      resolve({ str: stream, port: port })

      sent = true
    })

    stream.on('connection', () => {
      console.log('=====================================================================')
    })
  })
}

exports.cam = (req, res) => {
  const data = req.body
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    Mic.findOne({
      where: { id: data.id, id_branch: decoded.id_branch, stored_vid: 'No' }
    })
      .then(camera => {
        let port = 9999
        port = port - streams.length
        stream = getStream(camera, port, data.id)
          .then(stream => {
            res.status(200).send({ success: true, my_ip: my_ip, port: stream.port })
          })
          .catch(err => {
            if (stream && stream.stop) stream.stop()
            res.status(500).send({ success: false, message: err })
          })
      })
      .catch(err => {
        res.status(500).send({ success: false, message: err.message })
      })
  })
}

exports.stopCam = (req, res) => {
  const data = req.body
  for (let i = 0; i < streams.length; i++) {
    if (streams[i].id == data.id) {
      streams[i].str.stop()
      streams.splice(i, 1)
      continue
    }
  }
  res.status(200).send({ success: true, message: 'Stopped' })
}

var streams = []

exports.checkCamRel = (req, res) => {
  const data = req.body
  if (data.algo_id == -1) {
    return res.status(200).send({ success: true, message: 'Skipping' })
  }
  if (data.algo_id == -2) {
    return res.status(200).send({ success: true, message: 'Skipping' })
  }
  if (data.algo_id == -3) {
    return res.status(200).send({ success: true, fact: true })
  }
  if (data.algo_id == -4) {
    return res.status(200).send({ success: true, fact: true })
  }
  let wh
  if (data.type == 'show') {
    wh = { id_branch: data.id, algo_id: data.algo_id }
  } else {
    wh = { camera_id: data.id, algo_id: data.algo_id }
  }
  Relations.findAll({
    where: wh
  })
    .then(ress => {
      let mess
      if (ress.length == 0) {
        mess = false
      } else {
        mess = true
      }
      res.status(200).send({ success: true, fact: mess })
    })
    .catch(err => {
      res.status(500).send({ success: false, message: err.message })
    })
}

let liveStream = null

exports.getLiveStream = (req, res) => {
  const data = req.body
  const token = req.headers['x-access-token']
  const port = process.env.PORTSTREAM

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    if (liveStream !== null) {
      liveStream.stop()
      liveStream = null
    }

    try {
      liveStream = new Stream({
        name: 'videoStream',
        streamUrl: data.rtspUrl,
        wsPort: port,
        ffmpegOptions: {
          '-stats': '',
          '-r': 30
        }
      })
      console.log(liveStream)
      liveStream.wsServer.onClose()
      res.status(200).send({ success: true, url: `ws://${my_ip}:${port}`, pid: liveStream.stream.pid })
    } catch (e) {
      console.error(e)
    }
  })
}

exports.killStream = (req, res) => {
  if (liveStream !== null) {
    liveStream.stop()
    liveStream = null
  }
  res.status(200).send({ success: true, message: 'Success' })
}

exports.bulk = async (req, res) => {
  const data = req.body
  populate(data, req)
  res.status(200).send({ success: true, message: 'Populating database...' })
}

async function populate (array, req) {
  Mic.destroy({
    where: { id_branch: req.id_branch }
  })
  for (const cam of array) {
    try {
      const uuid = uuidv4()
      await Mic.create({
        id: uuid,
        name: cam.name,
        rtsp_in: cam.rtsp,
        id_account: req.id_account,
        id_branch: req.id_branch,
        stored_vid: 'No',
        atributes: {
          longitude: 0,
          latitude: 0
        }
      })
      await axios.post(`${process.env.my_ip}:${process.env.PORTPYTHON}/api2/frame`, {
        cameraId: uuid,
        id_account: req.id_account,
        id_branch: req.id_branch
      })
    } catch (err) {
      console.error(err.code)
    }
  }
}

const path =
  process.env.resourcePath

const stor = multer.diskStorage({
  // multers disk storage settings
  filename: function (req, file, cb) {
    const format = file.originalname.split('.')[1]
    if (req.type && req.type === 'zip' && format !== 'zip') {
      req.fileValidationError = 'Provided file is not a zip file'
      cb(new Error(req.fileValidationError))
    }
    const newName = file.originalname.split('.')[0] + '-' + Date.now() + '.' + format
    console.log(newName, file.originalname, format)
    cb(null, newName)
  },
  destination: function (req, file, cb) {
    const token = req.headers['x-access-token']

    jwt.verify(token, process.env.secret, (_err, decoded) => {
      const where = `${path}${decoded.id_account}/${decoded.id_branch}/audio/`

      if (!fs.existsSync(where)) {
        fs.mkdirSync(where, {
          recursive: true
        })
      }
      cb(null, where)
    })
  }
})
const upVideo = multer({
  // multer settings
  storage: stor
}).single('file')

exports.upload = (req, res) => {
  const uuid = uuidv4()
  const token = req.headers['x-access-token']
  upVideo(req, res, function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        error_code: 1,
        err_desc: err
      })
    } else {
      if (!req.file) {
        return res.status(500).json({
          success: false,
          error_code: 1
        })
      }
      // res.status(200).json({ success: true, name: req.file.filename });
      jwt.verify(token, process.env.secret, async (_err, decoded) => {
        // Save User to Database
        Mic.create({
          id: uuid,
          name: req.file.originalname.split('.')[0].split('_').join(' '),
          rtsp_in: req.file.path,
          http_in: `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/audio/${req.file.filename}`,
          id_account: decoded.id_account,
          id_branch: decoded.id_branch,
          stored_vid: 'Yes',
          type: 'audio'
        })
          .then(camera => {
            res.status(200).send({
              success: true,
              message: 'Stored video added successfully!',
              id: uuid,
              name: req.file.originalname.split('.')[0]
            })
          })
          .catch(err => {
            console.log('Error while uploading..............', err)
            res.status(500).send({
              success: false,
              message: err.message
            })
          })
      })
    }
  })
}