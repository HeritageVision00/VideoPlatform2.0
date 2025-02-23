const elasticsearch = require('@elastic/elasticsearch')
require('dotenv').config({
  path: '../../../config.env'
})
const jwt = require('jsonwebtoken')
const fs = require('fs')
const db = require('../models')
const Camera = db.camera
const SumVid = db.sumvidmultiple
const { v4: uuidv4 } = require('uuid')
const unzipper = require('unzipper')
const axios = require('axios')
const ffmpeg = require('fluent-ffmpeg')
const client = new elasticsearch.Client({
  node: process.env.HOST_ELAST,
  log: 'trace',
  apiVersion: '7.x', // use the same version of your Elasticsearch instance
  auth: {
    username: process.env.USER_ELAST,
    password: process.env.PASS_ELAST
  }
})

const con = require('../models/dbmysql')
const path =
  process.env.resourcePath
const multer = require('multer')
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESSKEY,
  secretAccessKey: process.env.SECRETKEY
})
const incidentIndex = 'gmtc_'

exports.ping = async (req, res) => {
  try {
    const body = await client.ping({
      requestTimeout: 30000
    })
    res.status(200).json({
      success: true,
      data: body
    })
  } catch (error) {
    console.trace('elasticsearch cluster is down!')
    console.error(error)

    console.trace(error.message)
    res.status(500).json({
      success: false,
      mess: error
    })
  }
}

async function searchAndAdd (arr, time, index, range, n = 0, output = [], del = [],
  params = {
    index: [index],
    body: {
      query: {
        bool: {
          must: [
            {
              match: {
                description: ''
              }
            }
          ]
        }
      }
    }
  }
) {
  try {
    if (range !== undefined) {
      params.body.query.bool.must.push({
        range: {
          time: {
            gte: range.start,
            lte: range.end
          }
        }
      })
    }
    params.body.query.bool.must[0].match.description = arr[n]
    const body = await client.search(params)
    const hits = body.body.hits
    if (hits.hits.length > 0) {
      n++
      params.body.query.bool.must[0].match.description = arr[n]
      for (const hit of hits.hits) {
        try {
          const gt = new Date(Date.parse(hit._source.time) - time * 1000)
          const lt = new Date(Date.parse(hit._source.time) + time * 1000)
          if (!params.body.query.bool.must[1]) {
            params.body.query.bool.must.push({
              range: {
                time: {
                  gte: gt,
                  lte: lt
                }
              }
            })
          } else {
            params.body.query.bool.must[1] = {
              range: {
                time: {
                  gte: gt,
                  lte: lt
                }
              }
            }
          }
          // console.log(JSON.stringify(params, null, 4))
          const body = await client.search(params)
          const hits = body.body.hits
          if (hits.hits.length === 0) {
            hit.del = true
            continue
          } else if (n + 1 < arr.length && hits.hits.length > 0) {
            n++
            params.body.query.bool.must[0].match.description = arr[n]
            for (const hit1 of hits.hits) {
              try {
                const gt = new Date(Date.parse(hit1._source.time) - time * 1000)
                const lt = new Date(Date.parse(hit1._source.time) + time * 1000)
                if (!params.body.query.bool.must[1]) {
                  params.body.query.bool.must.push({
                    range: {
                      time: {
                        gte: gt,
                        lte: lt
                      }
                    }
                  })
                } else {
                  params.body.query.bool.must[1] = {
                    range: {
                      time: {
                        gte: gt,
                        lte: lt
                      }
                    }
                  }
                }
                // console.log(JSON.stringify(params, null, 4))
                const body = await client.search(params)
                const hits = body.body.hits
                // console.log(output[n - 1][i])
                if (hits.hits.length === 0) {
                  hit.del = true
                  hit1.del = true
                  continue
                } else {
                  output.push(hit)
                  output.push(hit1)
                  for (const ele of hits.hits) {
                    output.push(ele)
                  }
                }
              } catch (err) {}
            }
          } else if (n + 1 === arr.length && hits.hits.length > 0) {
            output.push(hit)
            for (const ele of hits.hits) {
              output.push(ele)
            }
          }
        } catch (err) {}
      }
      return output
    } else {
      return output
    }
  } catch (err) {
    console.error(err)
  }
}

exports.searchIncident = async (req, res) => {
  const data = req.body
  // const actualIndexName = `dp_a0667974-3618-4297-b510-f2c607e85902`
  const actualIndexName = `dp_${req.id_branch}`
  try {
    const indexAlreadyExists = await client.indices.exists({
      index: actualIndexName
    })
    if (indexAlreadyExists.statusCode !== 200) {
      res.status(404).json({
        success: false,
        data: { hits: [] },
        issue: 'No index created'
      })
    } else {
      let params = {
        index: [actualIndexName],
        body: {
          size: 10000,
          query: {
            bool: {
              must: [
                {
                  match: {
                    summary: data.query
                  }
                }
              ]
            }
          }
        }
      }
      if (data.filters.bounded) {
        const words = data.query.split(' ')
        for (let i = 0; i < words.length; i++) {
          if (words[i] === 'and') {
            words.splice(i, 1)
          }
        }
        const recRes = await searchAndAdd(
          words,
          data.filters.bounded.time,
          actualIndexName,
          data.filters.range
        )
        for (const elem of recRes) {
          if (elem._source.filename) {
            elem._source.url =
              `http://${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${encodeURI(elem._source.filename)}`
            if (process.env.DOCKER === 'True') {
              elem._source.url =
              `/api/pictures${encodeURI(elem._source.filename)}`
            }
          }
        }

        return res.status(200).json({ success: true, data: { hits: recRes } })
      }
      if (data.filters.only) {
        const words = data.query.split(' ')
        const params = {
          index: [actualIndexName],
          body: {
            size: 10000,
            query: {
              bool: {
                must: words.map(word => ({
                  match: { summary: word }
                }))
              }
            }
          }
        }
        if (data.filters.range) {
          params.body.query.bool.must.push({
            range: {
              time: {
                gte: data.filters.range.start,
                lte: data.filters.range.end
              }
            }
          })
        }
        // console.log(params)
        // console.dir(params, { depth: null })
        const recRes = await client.search(params)
        // console.log(recRes.body.hits.hits)
        for (const elem of recRes.body.hits.hits) {
          if (elem._source.filename) {
            elem._source.url =
              `http://${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${encodeURI(elem._source.filename)}`
            if (process.env.DOCKER === 'True') {
              elem._source.url =
              `/api/pictures${encodeURI(elem._source.filename)}`
            }
          }
        }
        return res.status(200).json({ success: true, data: { hits: recRes.body.hits.hits } })
      }
      if (data.filters.and) {
        const words = data.query.split(' ')
        params.body.query.bool.must[0] = {
          terms: {
            description: words,
            boost: 1.0
          }
        }
      }
      if (data.filters.range) {
        params.body.query.bool.must.push({
          range: {
            time: {
              gte: data.filters.range.start,
              lte: data.filters.range.end
            }
          }
        })
      }
      if (data.filters.algo) {
        params.body.query.bool.must.push({
          match: {
            algo: data.filters.algo
          }
        })
      }
      if (data.filters.isBookMarked) {
        const isBookMarkedObj = {
          match: {
            'bookmarkDetails.isBookMarked': true
          }
        }
        if (data.query === '') {
          params.body.query.bool.must[0] = isBookMarkedObj
        } else {
          params.body.query.bool.must.push(isBookMarkedObj)
        }
      }

      try {
        if (data.query === '' && data.filters.range) {
          params = {
            index: [actualIndexName],
            body: {
              size: 10000,
              query: {
                range: {
                  time: {
                    gte: data.filters.range.start,
                    lte: data.filters.range.end
                  }
                }
              }
            }
          }
        }
        const body = await client.search(params)
        const hits = body.body.hits
        if (hits.hits.length > 0) {
          for (const elem of hits.hits) {
            if (elem._source.filename) {
              elem._source.url =
                `http://${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${encodeURI(elem._source.filename)}`
              if (process.env.DOCKER === 'True') {
                elem._source.url =
                `/api/pictures${encodeURI(elem._source.filename)}`
              }
            }
          }
          const gt = new Date(Date.parse(hits.hits[0]._source.time) - 1000)
          const lt = new Date(Date.parse(hits.hits[0]._source.time) + 1000)
          try {
            const secondBody = await client.search({
              index: [actualIndexName],
              body: {
                size: 10000,
                query: {
                  bool: {
                    must: [
                      {
                        range: {
                          time: {
                            gte: gt,
                            lte: lt
                          }
                        }
                      }
                    ],
                    must_not: [
                      {
                        ids: {
                          values: [hits.hits[0]._id]
                        }
                      }
                    ]
                  }
                }
              }
            })
            const hits2 = secondBody.body.hits
            if (hits2.hits.length !== 0) {
              for (const elem of hits2.hits) {
                if (elem._source.filename) {
                  elem._source.url =
                    `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${encodeURI(elem._source.filename)}`
                }
                hits.hits.push(elem)
              }
            }
            // search = hits
            return res.status(200).json({
              success: true,
              data: hits,
              second: hits2
            })
          } catch (err) {
            console.trace(err.message)
            return res.status(500).json({
              success: false,
              mess: err
            })
          }
        }
        res.status(200).json({
          success: true,
          data: hits
        })
      } catch (error) {
        // console.trace(error.message)
        //  console.log(error)
        res.status(500).json({
          success: false,
          mess: error
        })
      }
    }
  } catch (err) {
    console.trace(err)
    console.error(err)
    res.status(500).json({
      success: false,
      mess: err
    })
  }
}

// const test = ['male', 'car', 'bicycle']

exports.search1 = async (req, res) => {
  const data = req.body
  const index = 'gmtc_searcher'
  const params = {
    index: [index],
    body: {
      query: {
        bool: {
          must: [
            {
              match: {
                description: data.query
              }
            }
          ]
        }
      }
    }
  }
  if (data.filters.bounded) {
    const words = data.query.split(' ')
    for (let i = 0; i < words.length; i++) {
      if (words[i] === 'and') {
        words.splice(i, 1)
      }
    }
    const recRes = await searchAndAdd(words, data.filters.bounded.time, index, data.filters.range)
    for (const elem of recRes) {
      elem._source.url =
        `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures${encodeURI(elem._source.filename)}`
      if (process.env.DOCKER === 'True') {
        elem._source.url =
        `/api/pictures${encodeURI(elem._source.filename)}`
      }
    }

    return res.status(200).json({ success: true, data: { hits: recRes } })
  }
  if (data.filters.and) {
    const words = data.query.split(' ')
    params.body.query.bool.must[0] = {
      terms: {
        description: words,
        boost: 1.0
      }
    }
  }
  if (data.filters.range) {
    params.body.query.bool.must.push({
      range: {
        time: {
          gte: data.filters.range.start,
          lte: data.filters.range.end
        }
      }
    })
  }
  if (data.filters.algo) {
    params.body.query.bool.must.push({
      match: {
        algo: data.filters.algo
      }
    })
  }
  try {
    const body = await client.search(params)
    const hits = body.body.hits
    if (hits.hits.length > 0) {
      for (const elem of hits.hits) {
        elem._source.url =
          `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures${encodeURI(elem._source.filename)}`
        if (process.env.DOCKER === 'True') {
          elem._source.url =
          `/api/pictures${encodeURI(elem._source.filename)}`
        }
      }
      const gt = new Date(Date.parse(hits.hits[0]._source.time) - 1000)
      const lt = new Date(Date.parse(hits.hits[0]._source.time) + 1000)
      try {
        const secondBody = await client.search({
          index: [index],
          body: {
            query: {
              bool: {
                must: [
                  {
                    range: {
                      time: {
                        gte: gt,
                        lte: lt
                      }
                    }
                  }
                ],
                must_not: [
                  {
                    ids: {
                      values: [hits.hits[0]._id]
                    }
                  }
                ]
              }
            }
          }
        })
        const hits2 = secondBody.body.hits
        if (hits2.hits.length !== 0) {
          for (const elem of hits2.hits) {
            elem._source.url =
              `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures${encodeURI(elem._source.filename)}`
            if (process.env.DOCKER === 'True') {
              elem._source.url =
              `/api/pictures${encodeURI(elem._source.filename)}`
            }
            hits.hits.push(elem)
          }
        }
        // search = hits
        return res.status(200).json({
          success: true,
          data: hits,
          second: hits2
        })
      } catch (err) {
        console.trace(err.message)
        return res.status(500).json({
          success: false,
          mess: err
        })
      }
    }
    res.status(200).json({
      success: true,
      data: hits
    })
  } catch (error) {
    console.trace(error.message)
    console.log(error)
    res.status(500).json({
      success: false,
      mess: error
    })
  }
}

exports.search = async (req, res) => {
  const data = req.body
  const actualIndexName = `${incidentIndex}${req.id_branch}`
  // const actualIndexName = `dp_a0667974-3618-4297-b510-f2c607e85902`
  // const actualIndexName = 'gmtc_d718af11-ef4f-4818-8bb0-736502885ac0'
  try {
    const indexAlreadyExists = await client.indices.exists({
      index: actualIndexName
    })
    if (indexAlreadyExists.statusCode !== 200) {
      res.status(404).json({
        success: false,
        data: { hits: [] },
        issue: 'No index created'
      })
    } else {
      const params = {
        index: [actualIndexName],
        body: {
          size: 10000,
          query: {
            bool: {
              must: [
                {
                  match: {
                    description: data.query
                  }
                }
              ]
            }
          }
        }
      }
      if (data.filters.bounded) {
        const words = data.query.split(' ')
        for (let i = 0; i < words.length; i++) {
          if (words[i] === 'and') {
            words.splice(i, 1)
          }
        }
        const recRes = await searchAndAdd(
          words,
          data.filters.bounded.time,
          actualIndexName,
          data.filters.range
        )
        for (const elem of recRes) {
          if (elem._source.filename) {
            elem._source.url =
              `http://${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${encodeURI(elem._source.filename)}`
            if (process.env.DOCKER === 'True') {
              elem._source.url =
              `/api/pictures${encodeURI(elem._source.filename)}`
            }
          }
        }

        return res.status(200).json({ success: true, data: { hits: recRes } })
      }
      if (data.filters.only) {
        const words = data.query.split(' ')
        const params = {
          index: [actualIndexName],
          body: {
            size: 10000,
            query: {
              bool: {
                must: words.map(word => ({
                  match: { description: word }
                }))
              }
            }
          }
        }
        const recRes = await client.search(params)
        for (const elem of recRes.body.hits.hits) {
          if (elem._source.filename) {
            elem._source.url =
              `http://${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${encodeURI(elem._source.filename)}`
            if (process.env.DOCKER === 'True') {
              elem._source.url =
              `/api/pictures${encodeURI(elem._source.filename)}`
            }
          }
        }
        return res.status(200).json({ success: true, data: { hits: recRes.body.hits.hits } })
      }
      if (data.filters.and) {
        const words = data.query.split(' ')
        params.body.query.bool.must[0] = {
          terms: {
            description: words,
            boost: 1.0
          }
        }
      }
      if (data.filters.range) {
        params.body.query.bool.must.push({
          range: {
            time: {
              gte: data.filters.range.start,
              lte: data.filters.range.end
            }
          }
        })
      }
      if (data.filters.algo) {
        params.body.query.bool.must.push({
          match: {
            algo: data.filters.algo
          }
        })
      }
      if (data.filters.isBookMarked) {
        const isBookMarkedObj = {
          match: {
            'bookmarkDetails.isBookMarked': true
          }
        }
        if (data.query === '') {
          params.body.query.bool.must[0] = isBookMarkedObj
        } else {
          params.body.query.bool.must.push(isBookMarkedObj)
        }
      }

      try {
        // console.dir(params, {depth: null})
        const body = await client.search(params)
        const hits = body.body.hits
        if (hits.hits.length > 0) {
          for (const elem of hits.hits) {
            if (elem._source.filename) {
              elem._source.url =
                `http://${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${encodeURI(elem._source.filename)}`
              if (process.env.DOCKER === 'True') {
                elem._source.url =
                `/api/pictures${encodeURI(elem._source.filename)}`
              }
            }
          }
          const gt = new Date(Date.parse(hits.hits[0]._source.time) - 1000)
          const lt = new Date(Date.parse(hits.hits[0]._source.time) + 1000)
          try {
            const secondBody = await client.search({
              index: [actualIndexName],
              body: {
                size: 10000,
                query: {
                  bool: {
                    must: [
                      {
                        range: {
                          time: {
                            gte: gt,
                            lte: lt
                          }
                        }
                      }
                    ],
                    must_not: [
                      {
                        ids: {
                          values: [hits.hits[0]._id]
                        }
                      }
                    ]
                  }
                }
              }
            })
            const hits2 = secondBody.body.hits
            if (hits2.hits.length !== 0) {
              for (const elem of hits2.hits) {
                if (elem._source.filename) {
                  elem._source.url =
                    `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${encodeURI(elem._source.filename)}`
                }
                hits.hits.push(elem)
              }
            }
            // search = hits
            return res.status(200).json({
              success: true,
              data: hits,
              second: hits2
            })
          } catch (err) {
            console.trace(err.message)
            return res.status(500).json({
              success: false,
              mess: err
            })
          }
        }
        res.status(200).json({
          success: true,
          data: hits
        })
      } catch (error) {
        // console.trace(error.message)
        //  console.log(error)
        res.status(500).json({
          success: false,
          mess: error
        })
      }
    }
  } catch (err) {
    console.trace(err)
    console.error(err)
    res.status(500).json({
      success: false,
      mess: err
    })
  }
}

const stor = multer.diskStorage({
  // multers disk storage settings
  filename: function (req, file, cb) {
    const format = file.originalname.split('.')[1]
    if (req.type && req.type === 'zip' && format !== 'zip') {
      req.fileValidationError = 'Provided file is not a zip file'
      cb(new Error(req.fileValidationError))
    }
    const newName = file.originalname.split('.')[0] + '-' + Date.now() + '.' + format
    cb(null, newName)
  },
  destination: function (req, file, cb) {
    const token = req.headers['x-access-token']

    jwt.verify(token, process.env.secret, (_err, decoded) => {
      const where = `${path}${req.id_account}/${req.id_branch}/videos/`

      if (!fs.existsSync(where)) {
        fs.mkdirSync(where, {
          recursive: true
        })
      }
      cb(null, where)
    })
  }
})
const upVideo = multer({
  // multer settings
  storage: stor
}).single('file')

exports.upload = (req, res) => {
  const uuid = uuidv4()

  upVideo(req, res, async function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        error_code: 1,
        err_desc: err
      })
    } else {
      if (!req.file) {
        return res.status(500).json({
          success: false,
          error_code: 1
        })
      }
      if (req.file.filename.split('.')[1] !== 'mp4') {
        ffmpeg(req.file.path)
          .videoCodec('libx264')
          .audioCodec('copy')
          .on('end', () => {
            fs.unlink(req.file.path, err => {
              if (err) console.log({ success: false, message: 'Image error: ' + err })
            })
            Camera.create({
              id: uuid,
              name: req.file.filename.split('.')[0].split('_').join(' '),
              shortHttp: `/pictures/${req.id_account}/${req.id_branch}/videos/${req.file.filename.split('.')[0]}.mp4`,
              rtsp_in: `${path}${req.id_account}/${req.id_branch}/videos/${req.file.filename.split('.')[0]}.mp4`,
              http_in: `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${req.id_account}/${req.id_branch}/videos/${req.file.filename.split('.')[0]}.mp4`,
              id_account: req.id_account,
              id_branch: req.id_branch,
              stored_vid: 'Yes',
              type: 'video'
            })
              .then(camera => {
                res.status(200).send({
                  success: true,
                  message: 'Stored video added successfully!',
                  id: uuid,
                  name: req.file.originalname.split('.')[0]
                })
              })
              .catch(err => {
                console.log('Error while uploading..............', err)
                res.status(500).send({
                  success: false,
                  message: err.message
                })
              })
          })
          .on('error', (err) => {
            console.error('Error during processing:', err.message)
          })
          .save(`${path}${req.id_account}/${req.id_branch}/videos/${req.file.filename.split('.')[0]}.mp4`)
      } else {
        Camera.create({
          id: uuid,
          name: req.file.originalname.split('.')[0].split('_').join(' '),
          shortHttp: `/pictures/${req.id_account}/${req.id_branch}/videos/${req.file.filename.split('.')[0]}.mp4`,
          rtsp_in: `${path}${req.id_account}/${req.id_branch}/videos/${req.file.filename.split('.')[0]}.mp4`,
          http_in: `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${req.id_account}/${req.id_branch}/videos/${req.file.filename.split('.')[0]}.mp4`,
          id_account: req.id_account,
          id_branch: req.id_branch,
          stored_vid: 'Yes',
          type: 'video'
        })
          .then(camera => {
            res.status(200).send({
              success: true,
              message: 'Stored video added successfully!',
              id: uuid,
              name: req.file.originalname.split('.')[0]
            })
          })
          .catch(err => {
            console.log('Error while uploading..............', err)
            res.status(500).send({
              success: false,
              message: err.message
            })
          })
      }
    }
  })
}

exports.uploadZip = (req, res) => {
  // const uuid = uuidv4()
  const token = req.headers['x-access-token']
  req.type = 'zip'
  upVideo(req, res, function (err) {
    if (err) {
      if (req.fileValidationError) {
        return res.status(400).json({
          success: false,
          error_code: 1,
          err_desc: req.fileValidationError
        })
      } else {
        return res.status(500).json({
          success: false,
          error_code: 1,
          err_desc: err
        })
      }
    } else {
      if (!req.file) {
        return res.status(500).json({
          success: false,
          error_code: 1
        })
      }

      jwt.verify(token, process.env.secret, async (_err, decoded) => {
        const unZipPath = `${path}${decoded.id_account}/${decoded.id_branch}/videos/`
        const fileName = req.file.originalname.split('.')[0].split('_').join(' ')
        const newPath = fileName + '-' + Date.now()
        const refactoredPath = unZipPath + newPath
        fs.mkdir(refactoredPath, err => {
          if (err) console.error(err)
        })

        await fs
          .createReadStream(req.file.path)
          .pipe(
            unzipper.Extract({
              path: refactoredPath
            })
          )
          .promise()
          .then(
            () => {
              let count = 0
              fs.readdirSync(refactoredPath).forEach(async folder => {
                const stats = fs.statSync(refactoredPath + '/' + folder)
                if (folder === '__MACOSX') {
                  fs.rmdirSync(refactoredPath + '/' + folder, {
                    recursive: true
                  })
                  return
                }
                if (stats.isDirectory()) {
                  fs.readdirSync(refactoredPath + '/' + folder).forEach(async unzippedFile => {
                    const name = `${fileName}-${count}.${unzippedFile.split('.').pop()}`
                    const dir = `${refactoredPath}/${name}`
                    fs.renameSync(
                      refactoredPath + '/' + folder + '/' + unzippedFile,
                      dir,
                      function (err) {
                        if (err) throw err
                      }
                    )
                    count++
                    const uuid2 = uuidv4()
                    await Camera.create({
                      id: uuid2,
                      name: name,
                      rtsp_in: dir,
                      http_in: `http://${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/videos/${newPath}/${name}`,
                      id_account: decoded.id_account,
                      id_branch: decoded.id_branch,
                      stored_vid: 'Yes',
                      type: 'video'
                    })
                  })

                  fs.rmdirSync(refactoredPath + '/' + folder, {
                    recursive: true
                  })
                } else {
                  const name = `${fileName}-${count}.${folder.split('.').pop()}`
                  const dir = `${refactoredPath}/${name}`
                  console.log(name, dir)
                  fs.renameSync(
                    refactoredPath + '/' + folder,
                    dir,
                    function (err) {
                      if (err) throw err
                    }
                  )
                  count++
                  const uuid2 = uuidv4()
                  await Camera.create({
                    id: uuid2,
                    name: name,
                    rtsp_in: dir,
                    http_in: `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${decoded.id_account}/${decoded.id_branch}/videos/${newPath}/${name}`,
                    id_account: decoded.id_account,
                    id_branch: decoded.id_branch,
                    stored_vid: 'Yes',
                    type: 'video'
                  })
                }
              })
              fs.unlink(req.file.path, function (err) {
                if (err) {
                  console.log(err)
                } else {
                  res.status(200).send({
                    success: true,
                    message: 'Stored zip added successfully!'
                  })
                }
              })
            },
            e => console.log('error', e)
          )
      })
    }
  })
}

exports.s3up = (req, res) => {
  const uuid = uuidv4()
  const token = req.headers['x-access-token']

  const myFile = req.file.originalname.split('.')
  const format = myFile[myFile.length - 1]
  const newName = req.file.originalname.split('.')[0] + '-' + Date.now() + '.' + format

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    const params = {
      Bucket: process.env.BUCKET_S3,
      Key: `${decoded.id_account}/${decoded.id_branch}/${newName}`,
      Body: req.file.buffer
    }

    s3.upload(params, (error, data) => {
      if (error) {
        return res.status(500).send({ success: false, mess: error })
      }
      Camera.create({
        id: uuid,
        name: req.file.originalname.split('.')[0],
        rtsp_in: newName,
        http_in: newName,
        id_account: decoded.id_account,
        id_branch: decoded.id_branch,
        stored_vid: 's3'
      })
        .then(camera => {
          res.status(200).send({
            success: true,
            message: 'Stored video added successfully!',
            id: uuid,
            name: req.file.originalname.split('.')[0]
          })
        })
        .catch(err => {
          console.log('Error while uploading..............', err)
          res.status(500).send({
            success: false,
            message: err.message
          })
        })
    })
  })
}

exports.viewVids = async (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    Camera.findAll({
      where: {
        id_branch: decoded.id_branch,
        stored_vid: 'Yes'
      },
      attributes: ['name', 'id', 'createdAt', 'updatedAt', 'rtsp_in', 'stored_vid']
    })
      .then(cameras => {
        res.status(200).send({
          success: true,
          data: cameras
        })
      })
      .catch(err => {
        res.status(500).send({
          success: false,
          message: err.message
        })
      })
  })
}

exports.delVid = (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    if (data.which === 'Yes') {
      const vid = `${path}${decoded.id_account}/${decoded.id_branch}/videos/${data.vidName}`
      const img = `${path}${decoded.id_account}/${decoded.id_branch}/heatmap_pics/${data.uuid}_heatmap.png`
      fs.unlink(img, err => {
        if (err) console.log({ success: false, message: 'Image error: ' + err })
      })
      fs.unlink(vid, err => {
        if (err) console.log({ success: false, message: 'Image error: ' + err })
      })
    } else if (data.which === 's3') {
      const params = {
        Bucket: process.env.BUCKET_S3,
        Key: `${decoded.id_account}/${decoded.id_branch}/${req.body.vidName}`
      }
      s3.deleteObject(params, function (err, data) {
        if (err) return res.status(500).json({ success: false, mess: err })
      })
    }
    // console.log('Debug Data : ', data)

    Camera.destroy({
      where: { id: data.uuid, id_branch: decoded.id_branch, stored_vid: 'Yes' }
    })
      .then(cam => {
        res.status(200).send({ success: true, camera: data.uuid })
      })
      .catch(err => {
        // console.log('err............', err)
        res.status(500).send({
          success: false,
          message: err.message
        })
      })
  })
}

exports.editVid = (req, res) => {
  const updt = req.body
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    Camera.update(updt, {
      where: { id: req.params.id, id_branch: decoded.id_branch, stored_vid: 'Yes' }
    })
      .then(_cam => {
        res.status(200).send({ success: true, data: updt })
      })
      .catch(err => {
        res.status(500).send({ success: false, message: err.message })
      })
  })
}

const index = 'gmtc_searcher_3333-666666-cccccc-nnnnnn'

exports.some3 = async (req, res) => {
  // const a = await client.info()
  // console.log(a)
  try {
    await run()
    const a = await read()
    res.status(200).json({ success: true, mess: a })
  } catch (err) {
    res.status(500).json({ success: false, mess: err })
  }
}

async function read () {
  const { body } = await client.search({
    index: index,
    body: {
      query: {
        match: { description: 'winter' }
      }
    }
  })
  // console.log(body.hits.hits)
  return body.hits.hits
}

async function run () {
  await client.index({
    index: index,
    body: {
      character: 'Ned Stark',
      time: new Date(),
      description: 'Winter is coming.'
    }
  })

  await client.index({
    index: index,
    body: {
      character: 'Daenerys Targaryen',
      time: new Date(),
      description: 'I am the blood of the dragon.'
    }
  })

  await client.index({
    index: index,
    body: {
      character: 'Tyrion Lannister',
      time: new Date(),
      description: 'A mind needs books like a sword needs whetstone.'
    }
  })

  await client.indices.refresh({ index: index })
}

exports.some = async (req, res) => {
  const data = {}
  data.query = ''
  const actualIndexName = 'antwrep'
  // const indexAlreadyExists = await client.indices.exists({
  //   index: actualIndexName
  // })
  // if (indexAlreadyExists.statusCode !== 200) {
  //   res.status(501).json({
  //     success: true,
  //     data: { hits: [] }
  //   })
  // } else {
  const params = {
    index: [actualIndexName],
    body: {
      size: 10000,
      query: {
        bool: {
          must: [
            {
              match: {
                description: data.query
              }
            }
          ]
        }
      }
    }
  }
  try {
    console.dir(params, { depth: null })
    const body = await client.search(params)
    const hits = body.body.hits
    res.status(200).json({ success: true, hits })
  } catch (err) {
    res.status(500).json({ success: false, mess: err })
  }
  // }
}

async function deleteIndex (table) {
  client.indices.delete({ index: table }, async function (_err, resp, status) {
    await createIndex(table)
  })
}
async function createIndex (table) {
  client.indices.create(
    {
      index: table
    },
    async function (err, resp, status) {
      if (err) {
        console.log(err)
      } else {
        await readMysql(table)
      }
    }
  )
}

async function readMysql (table) {
  const sql = 'select * from ' + table + ';'
  con.con().query(sql, async function (err, result) {
    if (err) throw err
    console.log(result.length)
    result.forEach(async o => {
      const jsonStr = JSON.stringify(o)
      await saveToES(jsonStr, table)
    })

    setTimeout(printHourlyData, 10000)
    setTimeout(printDailyData, 10000)
    // pringData('day');
  })
}

function saveToES (o, table) {
  client.index(
    {
      index: table,
      type: 'alerts',
      body: o
    },
    function (_err, resp, status) {
      return resp
    }
  )
}

function printHourlyData () {
  printData('hour')
}

function printDailyData () {
  printData('day')
}

function printData (interval, table) {
  client.search(
    {
      index: table,
      type: 'alerts',
      body: {
        aggs: {
          simpleDatehHistogram: {
            date_histogram: {
              field: 'time',
              interval: interval
            }
          }
        }
      }
    },
    function (error, response, status) {
      if (error) {
        console.log('search error: ' + error)
      } else {
        response.aggregations.simpleDatehHistogram.buckets.forEach(function (hit) {
          return hit
        })
      }
    }
  )
}

exports.loit = async (req, res) => {
  const interval = 'day'
  const table = '_all'
  try {
    const search = await client.search({
      index: table,
      type: 'alerts',
      body: {
        aggs: {
          simpleDatehHistogram: {
            date_histogram: {
              field: 'time',
              interval: interval
            }
          }
        }
      }
    })
    res.status(200).json({ success: true, data: search.aggregations.simpleDatehHistogram.buckets })
  } catch (err) {
    res.status(500).json({ success: false, mess: err })
  }
}

exports.videoLink = async (req, res) => {
  const data = req.body
  try {
    const uuid = uuidv4()
    const destinationPath = `${path}${req.id_account}/${req.id_branch}/videos/${uuid}.${data.video_url.split('.')[data.video_url.split('.').length - 1]}`
    await downloadVideo(data.video_url, destinationPath)
    await Camera.create({
      id: uuid,
      name: `Recording of ${data.name} ${uuid}`,
      rtsp_in: destinationPath,
      http_in: `${process.env.my_ip}:${process.env.PORTNODE}/api/pictures/${req.id_account}/${req.id_branch}/videos/${uuid}.${data.video_url.split('.')[data.video_url.split('.').length - 1]}`,
      id_account: req.id_account,
      id_branch: req.id_branch,
      stored_vid: 'Yes',
      type: 'video'
    })
    res.status(200).json({ success: true, id: uuid })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false })
  }
}

const downloadVideo = async function (videoUrl, dest, tries = 0) {
  console.log('Try :', tries)
  const delay = 5000
  const permission = 0o664
  return new Promise(async function (resolve, reject) {
    if (tries === 3) {
      reject('Max retries reached')
      return // Ensure we exit the function here
    }

    try {
      console.log('Trying...')
      const response = await axios.get(videoUrl, { responseType: 'stream' })
      console.log('Tried...')

      const writer = fs.createWriteStream(dest)
      console.log('Piping...')
      writer.on('finish', async () => {
        console.log('Piping...')
        writer.close(async () => {
          await fs.promises.chmod(dest, permission)
          resolve('Download successful')
        })
      })

      writer.on('error', (error) => {
        console.error('Write stream error:', error)
        writer.close(() => {
          console.log('Closed due to error...')
          setTimeout(async () => {
            console.log('Next try: ', tries + 1)
            try {
              const retryResult = await downloadVideo(videoUrl, dest, tries + 1)
              resolve(retryResult) // Resolve with the result from the retry
            } catch (retryError) {
              reject(retryError) // Reject if retries also fail
            }
          }, delay)
        })
      })

      response.data.pipe(writer)
    } catch (error) {
      console.error('Download error:', error)
      setTimeout(async () => {
        console.log('Next try: ', tries + 1)
        try {
          const retryResult = await downloadVideo(videoUrl, dest, tries + 1)
          resolve(retryResult) // Resolve with the result from the retry
        } catch (retryError) {
          reject(retryError) // Reject if retries also fail
        }
      }, delay)
    }
  })
}

const storageMult = multer.diskStorage({
  filename: function (req, file, cb) {
    const format = file.originalname.split('.')[file.originalname.split('.').length - 1]
    const newName = file.originalname.split('.')[0] + '-' + Date.now() + '.' + format
    file.originalname = newName
    cb(null, newName)
  },
  destination: function (req, file, cb) {
    const where = `${path}${req.id_account}/${req.id_branch}/videos/`

    if (!fs.existsSync(where)) {
      fs.mkdirSync(where, {
        recursive: true
      })
    }
    cb(null, where)
  }
})
const upVideos = multer({
  storage: storageMult
}).single('files')

exports.uploadVideos = (req, res) => {
  const uuid = uuidv4()
  try {
    upVideos(req, res, function (err) {
      if (err) {
        console.error(err)
        return res.status(500).json({
          success: false,
          error_code: 1,
          err_desc: err
        })
      } else {
        const batchId = req.file.originalname.split('-NVS-')[0]
        const name = req.file.originalname.split('-NVS-')[1]
        if (req.file.filename.split('.')[req.file.filename.split('.').length - 1] !== 'mp4') {
          const fileNaaame = `${req.file.originalname.split('.')[0]}.mp4`
          ffmpeg(req.file.path)
            .videoCodec('libx264')
            .audioCodec('copy')
            .on('end', () => {
              fs.unlink(req.file.path, err => {
                if (err) console.log({ success: false, message: 'Image error: ' + err })
              })

              SumVid.create({
                id: uuid,
                name: `${name.split('.')[0]}.mp4`,
                batch_id: batchId,
                stored_name: fileNaaame,
                id_account: req.id_account,
                id_branch: req.id_branch
              })
                .then(camera => {
                  res.status(200).send({
                    success: true,
                    message: 'Stored video added successfully!',
                    id: uuid,
                    name: `${name.split('.')[0]}.mp4`
                  })
                })
                .catch(err => {
                  console.log('Error while uploading..............', err)
                  res.status(500).send({
                    success: false,
                    message: err.message
                  })
                })
            })
            .on('error', (err) => {
              console.error('Error during processing:', err.message)
            })
            .save(`${path}${req.id_account}/${req.id_branch}/videos/${fileNaaame}`)
        } else {
          const batchId = req.file.originalname.split('-NVS-')[0]
          const name = req.file.originalname.split('-NVS-')[1]
          SumVid.create({
            id: uuid,
            name: name,
            batch_id: batchId,
            stored_name: req.file.originalname,
            id_account: req.id_account,
            id_branch: req.id_branch
          })
            .then(camera => {
              res.status(200).send({
                success: true,
                message: 'Stored video added successfully!',
                id: uuid,
                name: req.file.originalname.split('.')[0]
              })
            })
            .catch(err => {
              console.log('Error while uploading..............', err)
              res.status(500).send({
                success: false,
                message: err.message
              })
            })
        }
      }
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      success: false,
      error_code: 1
    })
  }
}

exports.videosView = async (req, res) => {
  SumVid.findAll({
    where: { batch_id: req.params.id }
  })
    .then(cameras => {
      for (const vid of cameras) {
        vid.dataValues.fullPath = `${process.env.resourcePath}${req.id_account}/${req.id_branch}/videos/${vid.stored_name}`
      }
      res.status(200).send({ success: true, data: cameras })
    })
    .catch(err => {
      res.status(500).send({ success: false, message: err.message })
    })
}

exports.videosUpdateData = async (req, res) => {
  const data = req.body
  try {
    if (Object.keys(data).length === 0) {
      const response = await axios.post(`http://${process.env.my_ip2}:3331/api2/sumDp`, data)
      for (const vid of Object.values(response.data.output)) {
        if (vid['output_file']) {
          vid['location'] = vid['output_file'].replace('/home/resources/', `${process.env.resourcePath}`)
        }
      }
      return res.status(200).send({ success: true, data: Object.values(response.data.output) })
    }
    let i = 0
    for (const vid of data) {
      i++
      if (i !== data.length) {
        vid.fullPath = `/home/resources/${vid.fullPath.split(process.env.resourcePath)[1]}`
        const updt = {
          order: vid.order,
          description: vid.description
        }
        await SumVid.update(updt, {
          where: { id: vid.id }
        })
      }
    }
    const response = await axios.post(`http://${process.env.my_ip2}:3331/api2/sumDp`, data)
    for (const vid of Object.values(response.data.output)) {
      if (vid['output_file']) {
        vid['location'] = vid['output_file'].replace('/home/resources/', `${process.env.resourcePath}`)
      }
      if (vid['save_paths']) {
        for (let img of vid['save_paths']) {
          img = img.replace('/home/resources/', `${process.env.resourcePath}`)
        }
      }
    }
    // let res123 = JSON.stringify(response.data)
    // res123 = res123.replace('\n', '').split('\n').join('')

    // res123 = JSON.parse(res123)
    // console.log(res123)
    // res123 = Object.values(res123)[1].split('\n').join('')
    // res123 = res123.replace(/(\d+):/g, '"$1":').replace(/'/g, '"')
    // console.log(res123)
    // res123 = Object.values(JSON.parse(res123))
    res.status(200).send({ success: true, data: Object.values(response.data.output) })
  } catch (err) {
    console.error(err)
    res.status(500).send({ success: false, message: err })
  }
}

exports.deleteVideos = async (req, res) => {
  const data = req.body.body
  await SumVid.destroy({
    where: { id: data.id }
  })
  fs.unlink(`${data.location}`, err => {
    if (err) console.log({ success: false, message: 'Image error: ' + err })
  })
  fs.unlink(`${data.stored_vid}`, err => {
    if (err) console.log({ success: false, message: 'Image error: ' + err })
  })
  res.status(200).send({ success: true })
}
