const controller = require('../controllers/status.controller')
const { authJwt } = require('../middleware')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  app.ws(
    '/ws/status/:clientId/:branchId/:sender',
    controller.status
  )

  app.post(
    '/api4/status/:clientId/:branchId',
    [authJwt.verifyToken],
    controller.checker
  )
}
