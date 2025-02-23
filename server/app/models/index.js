const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../../config.env') })
const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DB, process.env.USERM, process.env.PASSWORD, {
  host: process.env.HOST,
  port: process.env.PORT || 3306,
  dialect: process.env.DIALECT,
  operatorsAliases: 0,
  logging: false

  // pool: {
  //   max: config.pool.max,
  //   min: config.pool.min,
  //   acquire: config.pool.acquire,
  //   idle: config.pool.idle
  // }
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = require('../models/user.model.js')(sequelize, Sequelize)
db.camera = require('../models/camera.model.js')(sequelize, Sequelize)
db.algorithm = require('../models/algorithm.model.js')(sequelize, Sequelize)
db.relation = require('../models/relation.model.js')(sequelize, Sequelize)
db.schedule = require('../models/schedule.model.js')(sequelize, Sequelize)
db.am = require('../models/am.model.js')(sequelize, Sequelize)
db.helpdesk = require('../models/helpdesk.model.js')(sequelize, Sequelize)
db.reply = require('../models/reply.model.js')(sequelize, Sequelize)
db.incidentLog = require('../models/incidentLog.model.js')(sequelize, Sequelize)
db.manualTrigger = require('../models/manualTrigger.model.js')(sequelize, Sequelize)
db.aa = require('../models/account_algorithm.model.js')(sequelize, Sequelize)
db.mic = require('../models/microphone.model.js')(sequelize, Sequelize)
db.sumVid = require('../models/summarizationVid.model.js')(sequelize, Sequelize)
db.sv = require('../models/sum_video.model.js')(sequelize, Sequelize)
db.status = require('../models/status.model.js')(sequelize, Sequelize)
db.sumvidmultiple = require('../models/sumvid.model.js')(sequelize, Sequelize)

db.algorithm.belongsToMany(db.user, {
  through: 'account_algorithm',
  foreignKey: 'algoId',
  otherKey: 'accountId'
})
db.user.belongsToMany(db.algorithm, {
  through: 'account_algorithm',
  foreignKey: 'accountId',
  otherKey: 'algoId'
})

db.camera.belongsToMany(db.algorithm, {
  through: {
    model: 'relations',
    unique: false
  },
  foreignKey: 'camera_id',
  otherKey: 'algo_id',
  constrains: false
})
db.algorithm.belongsToMany(db.camera, {
  through: {
    model: 'relations',
    unique: false
  },
  foreignKey: 'algo_id',
  otherKey: 'camera_id',
  constrains: false
})

db.manualTrigger.belongsTo(db.camera, { foreignKey: 'camera_id' })

db.camera.hasMany(db.manualTrigger, {
  foreignKey: 'camera_id'
})

db.helpdesk.belongsTo(db.user, { foreignKey: 'user_id' })

db.user.hasMany(db.helpdesk, {
  foreignKey: 'user_id'
})

db.incidentLog.belongsTo(db.user, { foreignKey: 'user_id' })

db.user.hasMany(db.incidentLog, {
  foreignKey: 'user_id'
})

db.camera.belongsToMany(db.sumVid, {
  through: {
    model: 'relSumVideo'
  },
  foreignKey: 'vidId',
  otherKey: 'sumId'
})

db.sumVid.belongsToMany(db.camera, {
  through: {
    model: 'relSumVideo'
  },
  foreignKey: 'sumId',
  otherKey: 'vidId'
})

db.camera.hasMany(db.status, { foreignKey: 'idCam', sourceKey: 'id' })

db.status.belongsTo(db.camera, { foreignKey: 'idCam', targetKey: 'id' })

module.exports = db
