const axios = require('axios')
const fs = require('fs')
const db = require('../models')
require('dotenv').config({ path: '../../../config.env' })
const Am = db.am
const nameGen = require('../helpers/name')
const { v4: uuidv4 } = require('uuid')

exports.compare = async (req, res) => {
    const data = req.body
    const path = process.env.resourcePath
    try{
    const response = await axios.post(`${process.env.IPFR}:${process.env.PORTFR}/compare`, {
        images:{
          data:[data.base64]
        },
        id: req.id_account
    })
    // const response = { data: { success: true, name: 'Ignacio', val: 0.8833859262100285 }} //Simulation when Fr server is down
    const files = fs.readdirSync(`${path}${req.id_account}/${req.id_branch}/pictures/`)
    let frUser
    let name = response.data.name
    if(name.includes('_')){
      name = name.split('_').join(' ')
    }
    for (let i = 0; i < files.length; i++) {
      const foldName = `${path}${req.id_account}/${req.id_branch}/pictures/${files[i]}/attr.json`
      const jsonFile = await fs.promises.readFile(foldName, 'binary')
      const ver = JSON.parse(jsonFile)
      if(ver.name === name){
        frUser = ver
        break
      }
    }
    const time = new Date()
    const uuid = uuidv4()
    const fileName = `${uuid}.${data.format}`
    await Am.create({
      user_id: frUser.uuid,
      time: time,
      event: data.event,
      name: name,
      camId: 'aa-00-cc',
      pName: fileName,
      id_account: req.id_account,
      id_branch: req.id_branch
    })
    const pathPicStored = `${path}${req.id_account}/${req.id_branch}/am`
    if (!fs.existsSync(pathPicStored)) {
      fs.mkdirSync(pathPicStored)
    }
    await fs.promises.writeFile(`${pathPicStored}/${fileName}`, data.base64, 'base64')
    res.status(200).send({
      success: true,
      data: {
        user: frUser,
        name: name,
        conf: response.data.val,
        time: time
      }
    })
    }catch(err){
      console.error(err)
      res.status(500).send({success: false, err: err.message})
    }
  }