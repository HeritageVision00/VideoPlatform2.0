const { authJwt, verifyCam } = require('../middleware')
const controller = require('../controllers/microphone.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  app.post(
    '/api/mic',
    [authJwt.verifyToken, authJwt.isClientOrBranch, verifyCam.rtsp, verifyCam.numCams],
    controller.addCamera
  )

  app.get('/api/mic/viewAll', [authJwt.verifyToken], controller.viewCams)

  app.get('/api/mic/viewLiveCams', [authJwt.verifyToken], controller.viewLiveCams)

  app.get(
    '/api/mic/viewOne/:id',
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.viewCam
  )

  app.put(
    '/api/mic/edit/:id/',
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.editCam
  )

  app.delete(
    '/api/mic/delete/:id',
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.delCam
  )

  app.post('/api/mic/checkRel', [authJwt.verifyToken], controller.checkCamRel)

  app.post('/api/mic/liveFeed', [authJwt.verifyToken], controller.getLiveStream)

  app.post('/api/mic/upload', [authJwt.verifyToken], controller.upload)
}
