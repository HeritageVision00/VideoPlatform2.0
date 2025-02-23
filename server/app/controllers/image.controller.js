require('dotenv').config({ path: '../../../config.env' })
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const ExifImage = require('exif').ExifImage
const cp = require('child_process')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const path =
  process.env.resourcePath

exports.imageUp = (req, res) => {
  let base64 = req.body.base64
  base64 = base64.split(';base64,').pop()
  const name = `${uuidv4()}.${req.body.format}`

  const pathPic = `${path}${req.id_account}/${req.id_branch}/pictures/${req.params.uuid}`

  try {
    fs.writeFile(`${pathPic}/${name}`, base64, 'base64', async function (err) {
      try {
        new ExifImage({ image: `${pathPic}/${name}` }, async function (error, exifData) {
          if (error) {
            try{
              const response = await axios.post(`${process.env.IPFR}:${process.env.PORTFR}/new`, {
                images:{
                  data:[base64]
                },
                id: req.id_account,
                format: req.body.format,
                person_name: req.body.name,
                fileName: name
              })
              res.status(200).send({
                success: true,
                message: 'Image error: ' + error.message + '. But was uploaded',
                name: name
              })
            }catch(err){
              // console.error(err)
              res.status(200).send({success: true, err: 'image not sent, but uploaded'})
              // res.status(500).send({success: false, err: err.message})
            }
          } else if (exifData.image.Orientation == 6) {
            const form = name.split('.')
            cp.exec(
              'ffmpeg -y -i ' +
                pathPic +
                '/' +
                form[0] +
                '.' +
                form[1] +
                ' -vf transpose=1 ' +
                pathPic +
                '/' +
                form[0] +
                '_1.' +
                form[1],
              function (err, data) {
                console.log('err: ', err)
                console.log('data: ', data)
                fs.unlink(pathPic + '/' + form[0] + '.' + form[1], async err => {
                  if (err) res.send(err)
                  try{
                    const response = await axios.post(`${process.env.IPFR}:${process.env.PORTFR}/new`, {
                      images:{
                        data:[base64]
                      },
                      id: req.id_account,
                      format: req.body.format,
                      person_name: req.body.name,
                      fileName: name
                    })
                    res.status(200).send({ success: true, message: 'Image added and transposed!', name: name })
                  }catch(err){
                    console.error(err)
                    res.status(200).send({success: true, err: 'image not sent, but uploaded and transposed'})
                  }
                })
              }
            )
          } else {
            try{
              const response = await axios.post(`${process.env.IPFR}:${process.env.PORTFR}/new`, {
                images:{
                  data:[base64]
                },
                id: req.id_account,
                format: req.body.format,
                person_name: req.body.name,
                fileName: name
              })
              res.status(200).send({ success: true, message: 'Image added!', name: name })
            }catch(err){
              console.error(err)
              res.status(200).send({success: true, err: 'image not sent, but uploaded'})
              // res.status(500).send({success: false, err: err.message})
            }
          }
        })
      } catch (error) {
        res
          .status(500)
          .send({ success: false, message: 'Image error: ' + error.message, name: name })
      }
    })
  } catch (error) {
    res.status(500).send({ success: false, message: 'Image error: ' + error.message, name: name })
  }
}

exports.delImg = async (req, res) => {
  const user_id = req.body.user_id
  const name = req.body.imageName

  // eslint-disable-next-line camelcase
  const img = `${path}${req.id_account}/${req.id_branch}/pictures/${user_id}/${name}`
  fs.unlink(img, async err => {
    if (err) res.status(500).send({ success: false, message: 'Image error: ' + err, name: name })
    else {
      try {
        await axios.post(`${process.env.IPFR}:${process.env.PORTFR}/remove/p`, {
          id: req.id_account,
          fileName: name,
          person_name: req.body.userName,
          images: {}
        })

        res.status(200).send({ success: true, message: 'Image deleted', name: name })
      } catch (err) {
        console.error(err)
        res.status(500).send({ success: false, err: err.message })
      }
    }
  })
}

exports.readImgs = (req, res) => {
  const arreglo = []
  const id = req.params.uuid

  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (err, decoded) => {
    const files = fs.readdirSync(`${path}${decoded.id_account}/${decoded.id_branch}/pictures/${id}`)
    for (let i = 0; i < files.length; i++) {
      const fileName = `${path}${decoded.id_account}/${decoded.id_branch}/pictures/${id}/${files[i]}`
      const file = fs.statSync(fileName)
      if (file.isFile()) {
        if (
          files[i].includes('.jpg') ||
          files[i].includes('.png') ||
          files[i].includes('.JPG') ||
          files[i].includes('.jpeg') ||
          files[i].includes('.PNG')
        ) {
          arreglo.push({ name: files[i] })
        }
      }
    }
    res.status(200).json({ success: true, data: arreglo })
  })
}

exports.imageLogo = (req, res) => {
  let base64 = req.body.base64
  base64 = base64.split(';base64,').pop()
  const name = `logo.${req.body.format}`

  const pathPic = `${path}${req.body.idAccount}/${req.body.idBranch}/pictures`

  try {
    fs.writeFile(`${pathPic}/${name}`, base64, 'base64', async function (_err) {
      res.status(200).send({
        success: true,
        message: 'Image uploaded',
        name: name
      })
    })
  } catch (error) {
    res.status(500).send({ success: false, message: 'Image error: ' + error.message, name: name })
  }
}