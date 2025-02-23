const controller = require('../controllers/vms.controller')
const { authJwt } = require('../middleware')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  app.post('/api/vms/export_video', controller.recording)

  app.get('/api/vms/nextiva/getCams', [authJwt.verifyToken], controller.getList)

  app.post('/api/vms/nextiva/recording', [authJwt.verifyToken], controller.getrecording)
}
