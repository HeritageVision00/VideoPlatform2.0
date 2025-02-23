const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config({ path: '../config.env' })
const app = express()
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const init = require('./app/initializator/initialFunct')
const mysql = require('mysql2/promise')
const compression = require('compression')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const db = require('./app/models')
const os = require('os')
const usr = db.user
const algo = db.algorithm

const resourcesFolderPath = path.join(process.env.resourcePath)

app.use(compression())

if (process.env.NODE_ENV === 'production') {
  const corsOptions = {
    origin: [
      `http://${process.env.my_ip}`,
      `http://${process.env.my_ip}:4200`,
      `${process.env.my_ip}:${process.env.PORTNODE}`,
      'http://localhost:4200',
      `http://${process.env.my_ip}:3200`
    ]
  }
  app.use(cors(corsOptions))
  console.log(`Running on Production for http://${process.env.my_ip}:4200`)
} else {
  const corsOptions = {
    origin: [
      `http://${process.env.my_ip}:4200`,
      `${process.env.my_ip}:${process.env.PORTNODE}`,
      'http://localhost:4200',
      `http://${process.env.my_ip}:3200`
    ]
  }
  app.use(cors(corsOptions))
  console.log(`Running Dev version on port ${process.env.PORTNODE}`)
}

function customHeaders (req, res, next) {
  app.disable('X-Powered-By')
  res.setHeader('X-Powered-By', 'HeritageVision-server')

  res.setHeader('Content-Security-Policy', "default-src 'self'")

  res.setHeader('X-Frame-Options', 'SAMEORIGIN')

  next()
}

app.use(customHeaders)

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: '10000mb', extended: true }))
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '10000mb', extended: true }))
if (process.env.NODE_ENV === 'production') {
  app.all(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', `http://${process.env.my_ip}:4200`)
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, x-access-token'
    )
    next()
  })
} else {
  app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200', `http://${process.env.my_ip}:4200`)
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, x-access-token'
    )
    next()
  })
}

app.use(
  morgan(
    'Method: :method:url // Url: :remote-addr // Status::status // User-agent: :user-agent // Date: :date[web]'
  )
)
app.use(
  morgan(
    'Date: :date[web] // Url: :remote-addr // Method: :method:url // Status::status // User-agent: :user-agent',
    {
      stream: fs.createWriteStream(`${resourcesFolderPath}logs/access.log`, { flags: 'a' })
    }
  )
)

process.on('unhandledRejection', (error, promise) => {
  console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise)
  console.log(' The error was: ', error)
})

process.on('uncaughtException', function (err, promise) {
  console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise)
  console.log(' The error was: ', err)
})

if (process.env.INSTALL === 'true') {
  mysql
    .createConnection({
      user: process.env.USERM,
      password: process.env.PASSWORD,
      host: process.env.HOST,
      port: process.env.PORT || 3306,
      connectTimeout: 60000
    })
    .then(async connection => {
      console.log('Connected to MySQL...')
      connection.query('CREATE DATABASE IF NOT EXISTS ' + process.env.DB + ';').then(async () => {
        db.sequelize.sync({ force: false, alter: true }).then(async () => {
          console.log('Drop and Resync Db...')
          const find = await usr.findOne({
            where: { id: '0000-11111-aaaaaa-bbbbbb' }
          })
          if (find === null) {
            await init.initial()
          } else {
            const algos = await algo.findAll({
              limit: 1,
              order: [['createdAt', 'DESC']]
            })
            if (init.lastId > algos[0].dataValues.id) {
              await init.initial()
              console.log('Db updated')
            }
          }
          connection.query(
            'CREATE TABLE IF NOT EXISTS `' +
              process.env.DB +
              '`.tickets (`id` varchar(45) NOT NULL,`type` varchar(45) NOT NULL,`createdAt`datetime NOT NULL, `updatedAt` datetime NOT NULL, `assigned` varchar(45) DEFAULT NULL, `id_account` varchar(45) NOT NULL, `id_branch` varchar(45) NOT NULL, `level` int(10) NOT NULL,`cam_name` varchar(45) DEFAULT NULL,`cam_id` varchar(45) DEFAULT NULL, `img_path` varchar(215) DEFAULT NULL,`reviewed` varchar(45) DEFAULT NULL, `assignedBy` varchar(45) DEFAULT NULL, PRIMARY KEY (`id`), UNIQUE KEY `id_UNIQUE` (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;'
          )
          connection.query('CREATE TABLE IF NOT EXISTS `' +
          process.env.DB +
          '`.alerts (`id` VARCHAR(45) NOT NULL,`time` DATETIME NULL,`alert` VARCHAR(45) NULL,`cam_name` VARCHAR(45) NULL,`cam_id` VARCHAR(45) NULL,`trackid` INT NULL,`alert_type` INT NULL,`id_account` VARCHAR(45) NULL,`id_branch` VARCHAR(45) NULL, PRIMARY KEY (`id`));')
          console.log('Finallized DB')
        })
      })
    }).catch(err => {
      console.error(err)
    })
}

const opt = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HeritageVision API',
      version: '5.2.1',
      description: 'HeritageVision API Information',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      },
      contact: {
        name: 'HeritageVision',
        url: 'www.heritageVision.com',
        email: 'work0801it@gmail.com'
      }
    },
    servers: [
      {
        url: `${process.env.my_ip}:${process.env.PORTNODE}`,
        description: 'Main'
      },
      {
        url: 'localhost:3311',
        description: 'Local'
      }
    ]
  },
  apis: ['server.js', './app/routes/*.js']
}

const swaggerDocs = swaggerJsDoc(opt)

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    explorer: true,
    customCssUrl: '/api/pictures/swagger.css',
    customSiteTitle: 'HeritageVision API Manual',
    customfavIcon: '/api/pictures/hbicon.ico',
    swaggerOptions: {
      url: `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/swagger.json`,
      docExpansion: 'none',
      validatorUrl: null
    },
    apis: ['server.js', './app/routes/*.js']
  })
)

// if (1 === 2) {
//   const doc = YAML.dump(swaggerDocs)
//   fs.writeFileSync('./resources/swagger.yaml', doc, 'utf8')
// }

// routes
require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)
require('./app/routes/fr.routes')(app)
require('./app/routes/image.routes')(app)
require('./app/routes/camera.routes')(app)
require('./app/routes/algorithm.routes')(app)
require('./app/routes/heatmap.routes')(app)
require('./app/routes/relations.routes')(app)
require('./app/routes/schedule.routes')(app)
require('./app/routes/ticket.routes')(app)
require('./app/routes/analytics.routes')(app)
// require('./app/routes/email.routes')(app)
require('./app/routes/elastic.routes')(app)
require('./app/routes/alerts.routes')(app)
require('./app/routes/path.routes')(app)
require('./app/routes/helpdesk.routes')(app)
require('./app/routes/reply.routes')(app)
require('./app/routes/incident.routes')(app)
require('./app/routes/manualTrigger.routes')(app)
require('./app/routes/info.routes')(app)
require('./app/routes/report.routes')(app)
require('./app/routes/am.routes')(app)
require('./app/routes/microphone.routes')(app)
require('./app/routes/vms.routes')(app)
require('./app/routes/summarization.routes')(app)

// resources being served
app.use('/api/pictures', (req, res, next) => {
  if (os.type().toLocaleLowerCase().includes('windows') && req.url.includes(':')) {
    req.url = req.url.replaceAll(':', '')
  }
  
  next()
}, express.static(resourcesFolderPath))

// Start the server
const port = process.env.PORTNODE || 3300
app.listen(port, () => {
  console.log(`Backend running on http://${process.env.my_ip || 'localhost'}:${port}`)
})
module.exports = app
