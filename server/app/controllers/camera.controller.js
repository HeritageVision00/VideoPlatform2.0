const db = require('../models')
require('dotenv').config({ path: '../../../config.env' })
const Camera = db.camera
const Relations = db.relation
const User = db.user
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const axios = require('axios')
const Stream = require('node-rtsp-stream')

const path = process.env.resourcePath
const my_ip = process.env.my_ip

exports.addCamera = (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, (_err, decoded) => {
    const uuid = uuidv4()
    // Save User to Database
    Camera.create({
      id: uuid,
      name: req.body.name,
      rtsp_in: req.body.rtsp_in,
      id_account: decoded.id_account,
      id_branch: decoded.id_branch,
      stored_vid: 'No',
      atributes: {
        longitude: req.body.atributes.longitude,
        latitude: req.body.atributes.latitude,
        vsEnd: 7,
        vsStr: 3
      }
    })
      .then(_camera => {
        res
          .status(200)
          .send({ success: true, message: 'Camera was registered successfully!', id: uuid })
      })
      .catch(err => {
        res.status(500).send({ success: false, message: err.message })
      })
  })
}

exports.viewCams = async (req, res) => {
  if (!req.id_branch) {
    req.id_branch = req.userId
  }

  const user = await User.findOne({
    where: { id_branch: req.id_branch }
  })
  Camera.findAll({
    where: { id_branch: req.id_branch },
    attributes: ['name', 'id', 'createdAt', 'updatedAt']
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

exports.viewCamsAndRels = async (req, res) => {
  if (!req.id_branch) {
    req.id_branch = req.userId
  }

  const user = await User.findOne({
    where: { id_branch: req.id_branch }
  })
  Camera.findAll({
    where: { id_branch: req.id_branch },
    attributes: ['name', 'id', 'createdAt', 'updatedAt']
  })
    .then(async cameras => {
      for (const cam of cameras) {
        const rels = await Relations.findAll({
          where: {
            camera_id: cam.dataValues.id
          }
        })
        cam.dataValues.rels = []
        for (const rel of rels) {
          const re = {
            algo_id: rel.dataValues.algo_id
          }
          cam.dataValues.rels.push(re)
        }
      }
      if (user.am === 1) {
        cameras.push({
          name: 'Webcam',
          id: 'aa-00-cc',
          rels: [{
            algo_id: -6
          }]
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
    Camera.findAll({
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

exports.viewLiveCams = async (req, res) => {
  const user = await User.findOne({
    where: { id_branch: req.id_branch }
  })
  let vms = false
  let cameras
  if (user.vms === 'Cognyte') {
    vms = '00-aa-321'
    try {
      const response = await axios.get(`http://${process.env.vmsUrl}/list_camera`, { timeout: 40000 })
      // console.log(response.data)
      cameras = await populate(response.data, req)
      // console.log(cameras)
      return res.status(200).send({ success: true, data: cameras, ds: vms })
    } catch (err) {
      console.error(err.data)
      cameras = await Camera.findAll({
        where: { id_branch: req.id_branch, stored_vid: 'No' },
        attributes: ['name', 'id', 'createdAt', 'updatedAt', 'heatmap_pic']
      })
      return res.status(200).send({ success: false, data: cameras, ds: vms, message: err.message })
    }
  }
  try {
    cameras = await Camera.findAll({
      where: { id_branch: req.id_branch, stored_vid: 'No' },
      attributes: ['name', 'id', 'createdAt', 'updatedAt', 'heatmap_pic']
    })
    res.status(200).send({ success: true, data: cameras, ds: vms })
  } catch (err) {
    res.status(500).send({ success: false, message: err.message })
  }
}

let playStream = null

exports.viewCam = (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.params
  const port = process.env.PORTSTREAM

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    Camera.findOne({
      where: { id: data.id, id_branch: decoded.id_branch }
    })
      .then(camera => {
        res.status(200).send({ success: true, data: camera })
        // try {
        //   playStream = new Stream({
        //     name: camera.name,
        //     streamUrl: camera.rtsp_in,
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
    await Relations.destroy({
      where: { camera_id: req.params.id }
    })
    const img = `${path}${decoded.id_account}/${decoded.id_branch}/heatmap_pics/${req.params.id}_heatmap.png`
    fs.unlink(img, err => {
      if (err) console.log({ success: false, message: 'Image error: ' + err })
    })
    Camera.destroy({
      where: { id: req.params.id, id_branch: decoded.id_branch, stored_vid: 'No' }
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
  Camera.update(updt, {
    where: { id: req.params.id, id_branch: req.id_branch, stored_vid: 'No' }
  })
    .then(_cam => {
      res.status(200).send({ success: true, data: updt })
    })
    .catch(err => {
      res.status(500).send({ success: false, message: err.message })
    })
}

exports.addAtr = async (req, res) => {
  const camID = req.body.cam_id

  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    try {
      const response = await axios.post(`${process.env.my_ip}:${process.env.PORTPYTHON}/api2/frame`, {
        cameraId: camID,
        id_account: decoded.id_account,
        id_branch: decoded.id_branch
      })
      res.status(200).send({ success: true, data: response.data })
    } catch (err) {
      console.error(err)
      res.status(500).send({ success: false, message: err })
    }
  })
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
      name: camera.name,
      streamUrl: camera.rtsp_in,
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
    Camera.findOne({
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
      if (ress.length === 0) {
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
  const port = process.env.PORTSTREAM

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
    res.status(200).send({ success: true, url: `ws://${my_ip}:${port}`, pid: liveStream.stream.pid })
    // liveStream.wsServer.onClose()
  } catch (e) {
    console.error(e)
  }
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
  await populate(data, req)
  res.status(200).send({ success: true, message: 'Populating database...' })
}

async function populate (array, req) {
  const list = []
  const cams = await Camera.findAll({
    where: { id_branch: req.id_branch, stored_vid: 'No' },
    attributes: ['name', 'id', 'createdAt', 'updatedAt', 'heatmap_pic', 'rtsp_in']
  })
  for (const cam of array) {
    for (const rtsp of cams) {
      if (cam.rtsp === rtsp.rtsp_in) {
        cam.exist = true
        rtsp.exist = true
      }
    }
  }
  for (const cam of array) {
    if (cam.exist === undefined) {
      try {
        await Camera.create({
          id: cam.id,
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
        // await axios.post(`${process.env.my_ip}:${process.env.PORTPYTHON}/api2/frame`, {
        //   cameraId: cam.id,
        //   id_account: req.id_account,
        //   id_branch: req.id_branch
        // })
        list.push(cam)
      } catch (err) {
        list.push(cam)
        console.error(err)
      }
    }
  }
  for (const rtsp of cams) {
    if (rtsp.exist === undefined) {
      Camera.destroy({
        where: { id: rtsp.id }
      })
    } else {
      list.push(rtsp)
    }
  }
  return list
}
