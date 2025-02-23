const db = require('../models')
require('dotenv').config({ path: '../../../config.env' })
const User = db.user
const Algorithm = db.algorithm
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path =
  process.env.resourcePath

const Op = db.Sequelize.Op

exports.signupClient = (req, res) => {
  // Save User to Database
  let branch = '0000'
  const id = uuidv4()
  if (req.body.unique === true) {
    branch = id
  }
  if (req.body.am === true) {
    req.body.am = 1
  } else {
    req.body.am = 0
  }
  if (req.body.vs === true) {
    req.body.vs = 1
  } else {
    req.body.vs = 0
  }
  if (req.body.vsd === true) {
    req.body.vsd = 1
  } else {
    req.body.vsd = 0
  }
  User.create({
    id: id,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 12),
    id_account: id,
    id_branch: branch,
    cameras: req.body.cameras,
    analytics: req.body.analytics,
    role: 'client',
    disabled: '0',
    vms: req.body.vms,
    am: req.body.am,
    vs: req.body.vs,
    mic: req.body.mic,
    pic: `http://${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${id}/${branch}/pictures/logo.${req.body.formatPic}`
  })
    .then(user => {
      if (req.body.algorithm) {
        Algorithm.findAll({
          where: {
            name: {
              [Op.or]: req.body.algorithm
            }
          }
        }).then(roles => {
          user.setAlgorithms(roles).then(async () => {
            const pathPic = `${path}${user.id_account}`
            if (!fs.existsSync(pathPic)) {
              await fs.promises.mkdir(pathPic)
            }
            if (req.body.unique === true) {
              const pathBranch = `${pathPic}/${branch}`
              await fs.promises.mkdir(pathBranch)
              await fs.promises.mkdir(`${pathBranch}/pictures`)
              await fs.promises.mkdir(`${pathBranch}/heatmap_pics`)
              await fs.promises.mkdir(`${pathBranch}/videos`)
            }
            res.status(201).send({
              message: 'User was registered successfully!',
              data: {
                idAccount: id,
                idBranch: branch
              }
            })
          })
        })
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}

exports.signupBranch = (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, (_err, decoded) => {
    // Save User to Database
    const id = uuidv4()
    User.create({
      id: id,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 12),
      id_account: decoded.id_account,
      id_branch: id,
      cameras: req.body.cameras,
      analytics: req.body.analytics,
      role: 'branch',
      disabled: '0',
      vms: req.body.vms
    })
      .then(async user => {
        const pathPic = `${path}${user.id_account}/${user.id_branch}`
        if (!fs.existsSync(pathPic)) {
          await fs.promises.mkdir(pathPic)
          await fs.promises.mkdir(`${pathPic}/pictures`)
          await fs.promises.mkdir(`${pathPic}/heatmap_pics`)
          await fs.promises.mkdir(`${pathPic}/videos`)
        }
        res.status(201).send({ message: 'User was registered successfully!' })
      })
      .catch(err => {
        res.status(500).send({ message: err.message })
      })
  })
}

exports.signupUser = (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, (_err, decoded) => {
    User.create({
      id: uuidv4(),
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 12),
      id_account: decoded.id_account,
      id_branch: decoded.id_branch,
      role: 'user',
      disabled: '0'
    })
      .then(user => {
        res.status(201).send({ success: true, message: 'User was registered successfully!' })
      })
      .catch(err => {
        res.status(500).send({ success: false, message: err.message })
      })
  })
}

exports.signupAdmin = (req, res) => {
  User.create({
    id: uuidv4(),
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 12),
    role: 'admin',
    disabled: '0'
  })
    .then(user => {
      res.status(201).send({ success: true, message: 'User was registered successfully!' })
    })
    .catch(err => {
      res.status(500).send({ success: false, message: err.message })
    })
}

let usersIn = []

exports.signin = (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res
      .status(402)
      .send({ success: false, message: 'Forbidden' })
  }
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .send({ success: false, message: 'Username does not exists', type: 'user' })
      }

      const passwordIsValid = bcrypt.compareSync(req.body.password, user.password)

      if (!passwordIsValid) {
        return res.status(400).send({
          success: false,
          message: 'Invalid Password',
          type: 'password'
        })
      }
      if (user.disabled === 1) {
        return res.status(401).send({
          success: false,
          message: 'This account has been disabled, please get in contact with the Administator.',
          type: 'disable'
        })
      }

      const exp = 43200 // 12 hours
      const days = 2592000 // 30 days

      let expiracy

      if (req.body.remember === true) {
        expiracy = days
      } else {
        expiracy = exp
      }

      const token = jwt.sign(
        { id: user.id, id_account: user.id_account, id_branch: user.id_branch },
        process.env.secret,
        {
          expiresIn: expiracy
        }
      )
      res.status(200).send({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          id_account: user.id_account,
          id_branch: user.id_branch,
          cameras: user.cameras,
          analytics: user.analytics,
          accessToken: token,
          theme: user.theme,
          vsd: user.vsd
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ success: false, message: err.message })
    })
}

exports.check = (req, res) => {
  res.status(200).send({ success: true, message: 'Session still active' })
}

exports.loggOut = (req, res) => {
  const data = req.body
  for (let a = 0; a < usersIn.length; a++) {
    if (data.username === usersIn[a].name) {
      usersIn = arrayRemove(usersIn, data.username)
      return res.status(200).send({ success: true, message: 'Logged Out' })
    }
  }
  res.status(500).send({ success: false, message: 'Session not found' })
}

function arrayRemove (arr, value) {
  return arr.filter(function (ele) {
    return ele.name !== value
  })
}

exports.googleLogin = (req, res) => {
  const data = req.body

  User.findOne({
    where: {
      email: data.data.email
    }
  })
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .send({ success: false, message: 'Username does not exists', type: 'user' })
      }

      if (user.disabled === 1) {
        return res.status(401).send({
          success: false,
          message: 'This account has been disabled, please get in contact with the Administator.',
          type: 'disable'
        })
      }
      const exp = 43200

      const token = jwt.sign(
        { id: user.id, id_account: user.id_account, id_branch: user.id_branch },
        process.env.secret,
        {
          expiresIn: exp // 12 hours
        }
      )

      res.status(200).send({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          id_account: user.id_account,
          id_branch: user.id_branch,
          cameras: user.cameras,
          analytics: user.analytics,
          accessToken: token
        }
      })
    })
    .catch(err => {
      res.status(500).send({ success: false, message: err.message })
    })
}

exports.msLogin = (req, res) => {
  const data = req.body
  User.findOne({
    where: {
      email: data.data.account.username
    }
  })
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .send({ success: false, message: 'User is not in the records', type: 'user' })
      }

      if (user.disabled === 1) {
        return res.status(401).send({
          success: false,
          message: 'This account has been disabled, please get in contact with the Administator.',
          type: 'disable'
        })
      }
      const exp = 43200

      const token = jwt.sign(
        { id: user.id, id_account: user.id_account, id_branch: user.id_branch },
        process.env.secret,
        {
          expiresIn: exp // 12 hours
        }
      )

      res.status(200).send({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          id_account: user.id_account,
          id_branch: user.id_branch,
          cameras: user.cameras,
          analytics: user.analytics,
          accessToken: token
        }
      })
    })
    .catch(err => {
      res.status(500).send({ success: false, message: err.message })
    })
}

exports.changeThem = (req, res) => {
  const updt = req.body
  User.update(updt, {
    where: { id: req.params.uuid }
  })
    .then(user => {
      res.status(200).send({ success: true, id: req.params.uuid })
    })
    .catch(err => {
      res.status(500).send({ success: false, message: err.message })
    })
}

exports.getTheme = (req, res) => {
  const id = req.params.uuid
  User.findOne({
    where: { id: id },
    attributes: [
      'theme'
    ]
  })
    .then(user => {
      res.status(200).send({ success: true, theme: user.theme })
    })
    .catch(err => {
      return res.status(500).send({ success: false, message: err.message })
    })
}
