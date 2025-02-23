const axios = require('axios')
const SoapClient = require('../helpers/soap-client-lib')
require('dotenv').config({
    path: '../../../config.env'
  })
const http = require('http')
const fs = require('fs')
const db = require('../models')
const Camera = db.camera
const { v4: uuidv4 } = require('uuid')
const ffmpeg = require('fluent-ffmpeg')
const path =
  process.env.resourcePath

exports.recording = async (req, res) => {
    const data = req.body
    try {
        console.log({
            start_time: data.start,
            end_time: data.end,
            camera_id: parseInt(data.cam_name)
        })
        const response = await axios.post(`http://${process.env.vmsUrl}/export_video`, {
            start_time: data.start,
            end_time: data.end,
            camera_id: parseInt(data.cam_name)
        })
        res.status(200).send({ success: true, data: response.data })
        } catch (err) {
        console.error(err)
        res.status(500).send({ success: false, message: err })
        }
}

exports.getList = async (req, res) => {
    const client = new SoapClient(process.env.URLNEXTIVA)

    try {
        await client.GetEncryptionKey()
        const sessionID = await client.Login(process.env.USERNAMENEXTIVA, process.env.PASSWORDNEXTIVA)

        // Handle the loginResponse as needed
        const cameraList = await client.GetCameraBasicInfo(sessionID)
        res.status(200).send({ success: true, data: cameraList })
    } catch (err) {
        console.error(err)
        res.status(500).send({ success: false, message: err })
    }
}

exports.getrecording = async (req, res) => {
    const data = req.body
    const uuid = uuidv4()
    try{
        const client = new SoapClient(process.env.URLNEXTIVA)
        await client.GetEncryptionKey()
        const vidName = `recording-${data.name}-${data.id}-${uuid}`
        const sessionID = await client.Login(process.env.USERNAMENEXTIVA, process.env.PASSWORDNEXTIVA)
        const exportInfo = await client.Export(sessionID, data.id, data.timeStart, data.timeEnd, `${vidName}.avi`)
        const json = exportInfo.ExportFilesUri[0]
        const address = json['a:string'][0]

        const intervalId = setInterval(async () => {
            try {
                const status = await client.ExportUpdateStatus(sessionID, exportInfo)
                if (parseInt(status.ProgressInPercent) === 100) {
                    clearInterval(intervalId) // This will break the loop
                    const fileUrl = address
                    const filePath = `${process.env.resourcePath}${req.id_account}/${req.id_branch}/videos/${vidName}.avi`
        
                    const file = fs.createWriteStream(filePath)
                    http.get(fileUrl, function (response) {
                        response.pipe(file)
                        file.on('finish', async () => {
                            file.close() // Close the file after writing
                            ffmpeg(`${process.env.resourcePath}${req.id_account}/${req.id_branch}/videos/${vidName}.avi`)
                                .videoCodec('libx264')
                                .audioCodec('copy')
                                .on('end', async () => {
                                    console.log('Processing finished successfully')
                                    // fs.unlink(`${process.env.resourcePath}${req.id_account}/${req.id_branch}/videos/${vidName}.avi`, err => {
                                    //     if (err) console.log({ success: false, message: 'Image error: ' + err })
                                    // })
                                    await Camera.create({
                                        id: uuid,
                                        name: vidName.split('.')[0].split('_').join(' '),
                                        rtsp_in: `${path}${req.id_account}/${req.id_branch}/videos/${vidName}.mp4`,
                                        http_in: `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${req.id_account}/${req.id_branch}/videos/${vidName}.mp4`,
                                        id_account: req.id_account,
                                        id_branch: req.id_branch,
                                        stored_vid: 'Yes',
                                        type: 'video'
                                        })
                                    await client.ExportDisposeServerResources(sessionID, exportInfo)
                                    res.status(200).send({ success: true })
                                })
                                .on('error', (err) => {
                                console.error('Error during processing:', err.message)
                                })
                                .save(`${process.env.resourcePath}${req.id_account}/${req.id_branch}/videos/${vidName}.mp4`)
                        })
                    }).on('error', function (err) { // Handle errors
                        fs.unlink(filePath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error('Error deleting file:', unlinkErr)
                            }
                        })
                        console.error('Error downloading the file:', err)
                        res.status(500).send({ success: false, message: err })
                    })
                }
            } catch (error) {
                console.error('Error sending keep alive:', error)
            }
        }, 5000)
    } catch (err) {
        console.error(err)
        res.status(500).send({ success: false, message: err })
    }
}
