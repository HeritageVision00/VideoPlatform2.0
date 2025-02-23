const controller = require('../controllers/summarization.controller')
const { authJwt } = require('../middleware')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  app.get('/api/summarization/:id', [authJwt.verifyToken], controller.summ)
  app.post('/api/summarization', [authJwt.verifyToken], controller.multSum)
  app.post('/api/summarization/analyticsData/:id', [authJwt.verifyToken], controller.analyticsData)
  app.post('/api/sum2/gpt', [authJwt.verifyToken], controller.gpt)
  app.get('/api/sum/:id', [authJwt.verifyToken], controller.sumDock)
}
