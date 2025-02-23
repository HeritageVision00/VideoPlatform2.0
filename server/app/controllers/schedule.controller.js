const db = require('../models')
require('dotenv').config({ path: '../../../config.env' })
const jwt = require('jsonwebtoken')
const Schedule = db.schedule

exports.getSched = (req, res) => {
  Schedule.findAll({
    where: { user_id: req.params.id }
  }).then(sched => {
    res.status(200).send({ success: true, data: sched })
  }).catch(err => {
    res.status(500).send({ message: err.message })
  })
}

exports.createSched = (req, res) => {
  const token = req.headers['x-access-token']
  const sched = req.body
  console.log(sched)
  jwt.verify(token, process.env.secret, (err, decoded) => {
    Schedule.create({
      user_id: sched.user_id,
      day: sched.day,
      entrance: sched.entrance,
      leave_time: sched.leave_time,
      id_account: decoded.id_account,
      id_branch: decoded.id_branch
    })
      .then(user => {
        res.status(200).send({ success: true, message: 'Schedule was registered successfully!' })
      })
      .catch(err => {
        res.status(500).send({ success: false, message: err.message })
      })
  })
}

exports.deleteSched = (req, res) => {
  Schedule.destroy({
    where: { user_id: req.params.id }
  }).then(rel => {
    res.status(200).send({ success: true, rel: req.params.id })
  }).catch(err => {
    res.status(500).send({ success: false, message: err.message })
  })
}

exports.editSched = (req, res) => {
  const updt = req.body

  console.log(updt)
  Schedule.update(updt, {
    where: { user_id: req.params.id, day: updt.day }
  }).then(user => {
    res.status(200).send({ success: true, data: updt })
  }).catch(err => {
    console.error(err)
    res.status(500).send({ success: false, message: err.message })
  })
}
