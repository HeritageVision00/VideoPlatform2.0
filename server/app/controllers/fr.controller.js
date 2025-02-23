require('dotenv').config({ path: '../../../config.env' })
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const axios = require('axios')
const path =
  process.env.resourcePath

exports.addFr = async (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (err, decoded) => {
    const user = req.body
    user.uuid = uuidv4()
    const pathPic = `${path}${decoded.id_account}/${decoded.id_branch}/pictures/${user.uuid}`
    if (!fs.existsSync(pathPic)) {
      fs.mkdirSync(pathPic)
    }
    fs.writeFile(pathPic + '/attr.json', JSON.stringify(user), function (err) {
      console.error(err)
    })
    // const file = await fs.promises.readFile(path + '/info.json', 'utf8');
    res
      .status(200)
      .send({ success: true, message: 'User was registered successfully!', id: user.uuid })
  })
}

exports.viewUsers = (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (err, decoded) => {
    const picPath = `${path}${decoded.id_account}/${decoded.id_branch}/pictures/`
    const usrs = fs.readdirSync(picPath)
    const information = []
    for (let i = 0; i < usrs.length; i++) {
      const fileName = picPath + usrs[i]
      const file = fs.statSync(fileName)
      if (file.isDirectory()) {
        information.push(JSON.parse(fs.readFileSync(`${fileName}/attr.json`)))
      }
    }
    res.status(200).json({ success: true, data: information })
  })
}

exports.viewUser = (req, res) => {
  const token = req.headers['x-access-token']
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    const fileName = `${path}${decoded.id_account}/${decoded.id_branch}/pictures/${req.params.uuid}`
    const info = JSON.parse(fs.readFileSync(`${fileName}/attr.json`))
    res.status(200).json({ success: true, data: info })
  })
}

exports.editUser = async (req, res) => {
  const token = req.headers['x-access-token']
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    const user = req.body
    const pathPic = `${path}${decoded.id_account}/${decoded.id_branch}/pictures/${user.uuid}`
    await fs.promises.writeFile(pathPic + '/attr.json', JSON.stringify(user))
    // const file = await fs.promises.readFile(path + '/info.json', 'utf8');
    res.status(200).send({ success: true, message: 'User was updated successfully!', id: user.uuid })
  })
}

exports.deleteUser = async (req, res) => {
  const folder = `${path}${req.id_account}/${req.id_branch}/pictures/${req.params.uuid}`
  fs.rmdir(folder, { recursive: true }, async err => {
    if (err) {
      res.status(500).send({ message: err.message })
    } else {
      try{
        const response = await axios.post(`${process.env.IPFR}:${process.env.PORTFR}/remove/u`, {
          id: req.id_account,
          person_name: req.params.name,
          images: {}
        })
        res
        .status(200)
        .json({ success: true, message: 'Successfully deleted folder', id: req.params.uuid })
      }catch(err){
        console.error(err)
        res.status(500).send({success: false, err: err.message})
      }
    }
  })
}
