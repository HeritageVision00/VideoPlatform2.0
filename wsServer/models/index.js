const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../../config.env') })
const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DB, process.env.USERM, process.env.PASSWORD, {
  host: process.env.HOST,
  port: process.env.PORT || 3306,
  dialect: process.env.DIALECT,
  operatorsAliases: 0,
  logging: false
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.camera = require('../models/camera.model.js')(sequelize, Sequelize)
db.status = require('../models/status.model.js')(sequelize, Sequelize)

db.camera.hasMany(db.status, { foreignKey: 'idCam', sourceKey: 'id' })

db.status.belongsTo(db.camera, { foreignKey: 'idCam', targetKey: 'id' })

module.exports = db
