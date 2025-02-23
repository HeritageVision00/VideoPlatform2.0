const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '../../../config.env' })

const verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token']
  
    // If token not available frokm header check if its available in query params
    if (!token) {
      token = req.query['x-access-token']
    }
  
    if (!token) {
      return res.status(403).send({
        message: 'No token provided!'
      })
    }
  
    jwt.verify(token, process.env.secret, (err, decoded) => {
      if (err || !decoded || !decoded.id) {
        return res.status(401).send({
          message: 'Unauthorized!'
        })
      }
  
      req.decodedJWT = decoded
      req.userId = decoded.id
      req.id_account = decoded.id_account
      req.id_branch = decoded.id_branch
  
      next()
    })
  }

  const authJwt = {
    verifyToken: verifyToken,
  }
  module.exports = authJwt