const { authJwt, verifySignUp } = require('../middleware')
const controller = require('../controllers/info.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  app.get(
    '/api/info',
    [],
    controller.info
  )

  app.get(
    '/api/infoMain',
    [],
    controller.infoMain
  )

  app.get(
    '/list_camera',
    [],
    controller.vmsResponse
  )
  app.post(
    '/export_video',
    [],
    controller.testVideoBack
  )  
}
