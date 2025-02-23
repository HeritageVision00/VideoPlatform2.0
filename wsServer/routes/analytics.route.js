const controller = require('../controllers/analytics.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  app.ws(
    '/ws/analytics/:clientId/:branchId/:algoId/:id',
    controller.ws
  )
}
