const { authJwt } = require('../middleware')
const controller = require('../controllers/elastic.controller')
const multer = require('multer')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  app.get('/api/elastic/ping', [], controller.ping)

  app.post('/api/elastic/search/', [authJwt.verifyToken], controller.search)

  app.post('/api/elastic/video', [authJwt.verifyToken], controller.upload)

  app.post('/api/elastic/zip', [authJwt.verifyToken], controller.uploadZip)

  app.get('/api/elastic/video/list', [authJwt.verifyToken], controller.viewVids)

  app.post('/api/elastic/video/link', [authJwt.verifyToken], controller.videoLink)

  app.get('/api/elastic/demo', [], controller.some)

  app.get('/api/elastic/demo2', [], controller.some3)

  app.post('/api/elastic/video/delete', [authJwt.verifyToken], controller.delVid)

  app.post('/api/elastic/video/s3', [authJwt.verifyToken, multer().single('file')], controller.s3up)

  app.post('/api/elastic/zipVsd', [authJwt.verifyToken], controller.uploadVideos)

  app.get('/api/elastic/videosView/:id', [authJwt.verifyToken], controller.videosView)

  app.post('/api/elastic/videosUpdateData/:id', [authJwt.verifyToken], controller.videosUpdateData)

  app.post('/api/elastic/delPair', [authJwt.verifyToken], controller.deleteVideos)

  app.post('/api/elastic/search1/', [authJwt.verifyToken], controller.searchIncident)
}
