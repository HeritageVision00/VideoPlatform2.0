require('dotenv').config({ path: '..././../config.env' })
const jwt = require('jsonwebtoken')
const db = require('../models/dbmysql')
const dateFormat = require('dateformat')
const os = require('os')
const moment = require('moment')
const graph = require('../helpers/sortgraphdasgboard')
const map = require('../helpers/mapping')

const count = {
  st0: 0, // st0 - Total Alerts remaining
  st1: 0, // st1 - Total Alerts solved
  l0: 0, // l0 - low level alerts
  l0r: 0, // l0r - low level alerts remaining
  l1: 0, // l1 - Medium level
  l1r: 0, // l1r - Medium rem
  l2: 0, // l2 - high level
  l2r: 0
}
exports.love = (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  let dateString=data.start
  const minutesInDay = 24 * 60
  //const type='3333-666666-cccccc-nnnnnn'
  //const id= '3333-666666-cccccc-nnnnnn'
  const id = Array.isArray(data.id) ? data.id[data.id.length - 1] : data.id
  //console.log('new value ssssssssssssssssssss')
  const dateTimeFormat = 'DD-MM-YYYY'
  let startDate = new Date()
  let endDate = new Date()
  let timerange = data.sec
  if (dateString) {
    dateString = new Date(dateString)
  }
  jwt.verify(token, process.env.secret, (_err, _decoded) => {
    if (dateString && !moment(dateString, dateTimeFormat, true).isValid()) {
      return res.status(400).send({
        success: false,
        message: `Invalid date format, pattern must be ${dateTimeFormat}`
      })
    }

    if (!dateString) {
      startDate = new Date()
      endDate = new Date()
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(0, 0, 0, 0)
    } else {
      startDate = moment(dateString, dateTimeFormat, true).toDate()
      endDate = moment(dateString, dateTimeFormat, true).toDate()
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(0, 0, 0, 0)
    }

    if (!timerange) {
      timerange = minutesInDay
    }

    if ((timerange && !Number.isInteger(parseFloat(timerange))) || (timerange && Number.isInteger(parseFloat(timerange)) && parseFloat(timerange) < 0)) {
      return res.status(400).send({
        success: false,
        message: 'Invalid timerange, timerange should be positive integer'
      })
    }

    timerange = parseInt(timerange)

    if (timerange <= minutesInDay) {
      endDate.setHours(0, timerange, 0, 0)
    } else {
      let endTimeRange = timerange % minutesInDay

      if (endTimeRange === 0 && (timerange - minutesInDay) > 0) {
        endTimeRange = minutesInDay
      }

      const startTimeRange = timerange - endTimeRange

      endDate.setHours(0, endTimeRange, 0, 0)
      startDate.setHours(0, -startTimeRange, 0, 0)
    }

    startDate = moment(startDate).format('YYYY-MM-DD HH:mm:ss')
    endDate = moment(endDate).format('YYYY-MM-DD HH:mm:ss')
    db.con().query(
      `SELECT type, COUNT(*) AS count FROM tickets WHERE ${data.type} = '${id}' AND createdAt >= '${startDate}' AND createdAt < '${endDate}' GROUP BY type;`,
      function (err, result1) {
        if (err) return res.status(500).json({ success: false, message: err })
          //const typeCounts = values[2];
        const typeCountMap = result1.reduce((acc, item) => {
          acc[item.type] = item.count;
          return acc;
        }, {});
        const sql=`SELECT * from tickets where ${data.type} = '${id}' and createdAt >= '${startDate}' and  createdAt <= '${endDate}' order by createdAt asc;`
        db.con().query(sql, (err, rsu) => {
          if (err) {
            // Handle any errors here `SELECT * from tickets where ${data.type} = '${id}' and createdAt >= '${startDate}' and  createdAt <= '${endDate}' order by time asc;`,
            res.status(500).json({ success: false, error: "Database error" });
            return;
          }
          const groupedData = {};
          // let dhulpeople=[]
          // let dhulVehicleClassCount=[]
          // let dhulqueuemgt=[]
          // for (const v of rsu) {
          //   if(v.type=='People Count'){
          //     dhulpeople.push(v)
          //   }
          //   if(v.type=='Vehicle Class Count'){
          //     dhulVehicleClassCount.push(v)
          //   }  
          //   if(v.type=='queue_mgt'){
          //     dhulqueuemgt.push(v)
          //   } 
          // }
          // // const listof=[dhulpeople,dhulVehicleClassCount]
          // // const lisrtdata=graph.dashgenerate(listof,timerange)
          // // console.log(lisrtdata.ress,'$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
          // // console.log(lisrtdata.ress[0][0],'0000000000000$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
          // const dashpeoplecount = graph.dashgenerate(dhulpeople,timerange)
          // const dashvehiclecountdata=graph.dashgenerate(dhulVehicleClassCount,timerange)//  dashvehiclecountdata:dashvehiclecountdata.ress,mgt:mgt.ress
          // const mgt=graph.dashgenerate(dhulqueuemgt,timerange)
          // //console.log(dashpeoplecount.ress,'123@@@@@@@@2',Object.values(dashpeoplecount.ress))
          // //console.log(dashvehiclecountdata.ress,'AAAAAAAAAAAAAAAAAAAAAAAAAAa')
          // const listgraph=[dashpeoplecount.ress,dashvehiclecountdata.ress,mgt.ress]
          // //console.log(listgraph,'gggggggggggggggggggggggggg')
          
          res.status(200).json({ success: true, data: result1, res: typeCountMap,dashpeoplecount: alllistofdash,  })

        })
        //res.status(200).json({ success: true, data: result1, res: typeCountMap })dashpeoplecount: listgraph,
      }
    )
  })
}

exports.getAll = (req, res) => {
  const data = req.query
  const token = req.headers['x-access-token']
  const id = Array.isArray(data.id) ? data.id[data.id.length - 1] : data.id
  const type = Array.isArray(data.type) ? data.type[data.type.length - 1] : data.type
  const page = parseInt(data._page)
  const limit = parseInt(data._limit)
  const offset = (page - 1) * limit
  const _sort = Array.isArray(data._sort) ? data._sort[data._sort.length - 1] : data._sort
  const _order = Array.isArray(data._order) ? data._order[data._order.length - 1] : data._order
  let extra = ' '
  if (data.cam !== '' && data.cam !== undefined) {
    extra = ` AND cam_id = '${data.cam}'`
  }
  if (data.algo_id) {
    extra = `${extra} AND type ='${map.map[data.algo_id].algorithm}'`
  }
  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    const promise1 = new Promise((resolve, reject) => {
      db.con().query(`SELECT count(*) as count FROM tickets WHERE ${type} = '${id}';`, (_err, resp) => {
        resolve(resp[0].count)
      })
    })
    const promise2 = new Promise((resolve, reject) => {
      db.con().query(`SELECT * FROM tickets WHERE BINARY ${type} = '${id}'${extra} ORDER BY ${_sort} ${_order} LIMIT ${limit} OFFSET ${offset};`, (_err, resp) => {
        resolve(resp)
      })
    })
    Promise.all([promise1, promise2])
      .then(values => {
        // console.log(values, `SELECT * FROM tickets WHERE BINARY ${type} = '${id}'${extra} ORDER BY ${_sort} ${_order} LIMIT ${limit} OFFSET ${offset};`)
        values[1].forEach(element => {
          element.createdAt = dateFormat(element.createdAt, 'yyyy-mm-dd HH:MM:ss')
          element.updatedAt = dateFormat(element.updatedAt, 'yyyy-mm-dd HH:MM:ss')
          // console.log(element.img_path, element)
          if (element.img_path !== null) {
            if (element.img_path && os.type().toLocaleLowerCase().includes('windows')) {
              element.img_path = element.img_path.replaceAll(':', '_')
            }

            if (element.img_path.startsWith('/home/resources/')) {
              element.picture = `/api/pictures/${element.img_path.split('/home/resources/')[1]}`
            }
            else if (element.img_path.startsWith('/home/videos/')) {
              element.picture = `/api/pictures/${element.img_path.split('/home/videos/')[1]}`
            }
          }
          if (element.createdAt === element.updatedAt) {
            element.updatedAt = ''
          }
          switch (element.type) {
            case 'loitering': {
              element.folder = element.type
              element.type = 'Person Loitering in restricted area'
              break
            }
            case 'intrude': {
              element.folder = element.type
              element.type = 'Person trespassing - tripwire'
              break
            }
            case 'aod': {
              element.folder = element.type
              element.type = 'Object left unattended'
              break
            }
            case 'fr': {
              element.folder = element.type
              element.type = 'Face detection'
              break
            }
            case 'crowd': {
              element.folder = element.type
              element.type = 'People converged or crowd gathering'
              break
            }
            case 'sceneChange': {
              element.folder = element.type
              element.type = 'Camera scene changed'
              break
            }
            case 'objectRemoval': {
              element.folder = element.type
              element.type = 'Object removed/ possible theft'
              break
            }
            case 'Veh_Entered': {
              element.folder = element.type
              element.type = 'Vehicle entere restricted area'
              break
            }
            case 'Entered': {
              element.folder = element.type
              element.type = 'Person entered restricted area'
              break
            }
            case 'fire': {
              element.folder = element.type
              element.type = 'Incipient fire / fire detection'
              break
            }
            case 'cameraBlinded': {
              element.folder = element.type
              element.type = 'Camera Blinded'
              break
            }
            case 'cameraDefocused': {
              element.folder = element.type
              element.type = 'Camera defocused/ blurred'
              break
            }
            case 'Exited': {
              element.folder = element.type
              element.type = 'Person exited restricted area'
              break
            }
            case 'Veh_Exited': {
              element.folder = element.type
              element.type = 'Vehicle exited restricted area'
              break
            }
            case 'velocity': {
              element.folder = element.type
              element.type = 'Speeding vehicle'
              break
            }
            case 'enterExit': {
              element.folder = element.type
              element.type = 'Person entered / exited restricted area'
              break
            }
            case 'queue_mgt': {
              element.folder = element.type
              element.type = 'Queue Management'
              break
            }
            case 'faces': {
              element.folder = element.type
              element.type = 'Face detection'
              break
            }
            case 'parking': {
              element.folder = element.type
              element.type = 'Parking Violation in Restricted Area'
              break
            }
            case 'congestion': {
              element.folder = element.type
              element.type = 'Vehicle Congestion'
              break
            }
            case 'anpr': {
              element.folder = element.type
              element.type = 'ANPR alert'
              break
            }
          }
        })
        res.status(200).json({ success: true, data: values[1], total: values[0] })
      })
      .catch(error => {
        throw error
      })
  })
}

const getAllTickets = async (row_count, type, id, data, res) => {
  const page = parseInt(data._page)
  const limit = parseInt(data._limit)
  const offset = (row_count === (page * limit)) ? (page - 1) * limit : (page - 1) * limit
  const _sort = Array.isArray(data._sort) ? data._sort[data._sort.length - 1] : data._sort
  const _order = Array.isArray(data._order) ? data._order[data._order.length - 1] : data._order
  await db.con().query(`SELECT type, createdAt, updatedAt, assigned, level, reviewed, assignedBy, cam_name FROM tickets WHERE BINARY ${type} = '${id}' ORDER BY ${_sort} ${_order} LIMIT ${limit} OFFSET ${offset};`, function (err, result) {
    if (err) return res.status(500).json({ success: false, message: err })
    result.forEach(element => {
      element.createdAt = dateFormat(element.createdAt, 'yyyy-mm-dd HH:MM:ss')
      element.updatedAt = dateFormat(element.updatedAt, 'yyyy-mm-dd HH:MM:ss')
      if (element.createdAt === element.updatedAt) {
        element.updatedAt = ''
      }
      switch (element.type) {
        case 'loitering': {
          element.folder = element.type
          element.type = 'Person Loitering in restricted area'
          break
        }
        case 'intrude': {
          element.folder = element.type
          element.type = 'Person trespassing - tripwire'
          break
        }
        case 'aod': {
          element.folder = element.type
          element.type = 'Object left unattended'
          break
        }
        case 'fr': {
          element.folder = element.type
          element.type = 'Face detection'
          break
        }
        case 'crowd': {
          element.folder = element.type
          element.type = 'People converged or crowd gathering'
          break
        }
        case 'sceneChange': {
          element.folder = element.type
          element.type = 'Camera scene changed'
          break
        }
        case 'objectRemoval': {
          element.folder = element.type
          element.type = 'Object removed/ possible theft'
          break
        }
        case 'Veh_Entered': {
          element.folder = element.type
          element.type = 'Vehicle entere restricted area'
          break
        }
        case 'Entered': {
          element.folder = element.type
          element.type = 'Person entered restricted area'
          break
        }
        case 'fire': {
          element.folder = element.type
          element.type = 'Incipient fire / fire detection'
          break
        }
        case 'cameraBlinded': {
          element.folder = element.type
          element.type = 'Camera Blinded'
          break
        }
        case 'cameraDefocused': {
          element.folder = element.type
          element.type = 'Camera defocused/ blurred'
          break
        }
        case 'Exited': {
          element.folder = element.type
          element.type = 'Person exited restricted area'
          break
        }
        case 'Veh_Exited': {
          element.folder = element.type
          element.type = 'Vehicle exited restricted area'
          break
        }
        case 'velocity': {
          element.folder = element.type
          element.type = 'Speeding vehicle'
          break
        }
        case 'enterExit': {
          element.folder = element.type
          element.type = 'Person entered / exited restricted area'
          break
        }
        case 'parking': {
          element.folder = element.type
          element.type = 'Vehicle parked in restricted area'
          break
        }
        case 'queue_mgt': {
          element.folder = element.type
          element.type = 'Queue Management'
          break
        }
        case 'faces': {
          element.folder = element.type
          element.type = 'Face detection'
          break
        }
      }
    })
    res.status(200).json({ success: true, data: result, total: row_count })
  })
}

exports.searchAllTickets = (req, res) => {
  const data = req.query
  const token = req.headers['x-access-token']
  const id = Array.isArray(data.id) ? data.id[data.id.length - 1] : data.id
  const type = Array.isArray(data.type) ? data.type[data.type.length - 1] : data.type
  let searchStr = Array.isArray(data.searchStr) ? data.searchStr[data.searchStr.length - 1] : data.searchStr
  const searchField = Array.isArray(data.searchField) ? data.searchField[data.searchField.length - 1] : data.searchField
  const page = parseInt(data._page)
  const limit = parseInt(data._limit)
  const offset = (page - 1) * limit
  const _sort = Array.isArray(data._sort) ? data._sort[data._sort.length - 1] : data._sort
  const _order = Array.isArray(data._order) ? data._order[data._order.length - 1] : data._order
  switch (searchStr) {
    case 'Person Loitering in restricted area': {
      searchStr = 'loitering'
      break
    }
    case 'Person trespassing - tripwire': {
      searchStr = 'intrude'
      break
    }
    case 'trespassing': {
      searchStr = 'intrude'
      break
    }
    case 'Object left unattended': {
      searchStr = 'aod'
      break
    }
    case 'Face detection': {
      searchStr = 'fr'
      break
    }
    case 'face': {
      searchStr = 'fr'
      break
    }
    case 'People converged or crowd gathering': {
      searchStr = 'crowd'
      break
    }
    case 'Camera scene changed': {
      searchStr = 'sceneChange'
      break
    }
    case 'Object removed/ possible theft': {
      searchStr = 'objectRemoval'
      break
    }
    case 'Vehicle entere restricted area': {
      searchStr = 'Veh_Entered'
      break
    }
    case 'Person entered restricted area': {
      searchStr = 'Entered'
      break
    }
    case 'Incipient fire / fire detection': {
      searchStr = 'fire'
      break
    }
    case 'Camera Blinded': {
      searchStr = 'cameraBlinded'
      break
    }
    case 'Camera defocused/ blurred': {
      searchStr = 'cameraDefocused'
      break
    }
    case 'Person exited restricted area': {
      searchStr = 'Exited'
      break
    }
    case 'Vehicle exited restricted area': {
      searchStr = 'Veh_Exited'
      break
    }
    case 'Speeding vehicle': {
      searchStr = 'velocity'
      break
    }
    case 'Person entered / exited restricted area': {
      searchStr = 'enterExit'
      break
    }
    case 'Vehicle parked in restricted area': {
      searchStr = 'parking'
      break
    }
    case 'Queue Management': {
      searchStr = 'queue_mgt'
      break
    }
    case 'Face detection': {
      searchStr = 'faces'
      break
    }
  }
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    /* await db.con().query(`SELECT count(*) as count FROM tickets WHERE ${type} = '${id}' AND ${searchField} = '${searchStr}';`, function(err, resp) {
      search_total_row_count = resp[0].count;
      searchTickets(search_total_row_count, type, id, searchField, searchStr, data, res);
    }); */
    const promise1 = new Promise((resolve, reject) => {
      db.con().query(`SELECT count(*) as count FROM tickets WHERE ${type} = '${id}' AND ${searchField} = '${searchStr}';`, (err, resp) => {
        resolve(resp[0].count)
      })
    })
    const promise2 = new Promise((resolve, reject) => {
      db.con().query(`SELECT type, createdAt, updatedAt, assigned, level, reviewed, assignedBy, cam_name FROM tickets WHERE BINARY ${type} = '${id}' AND ${searchField} LIKE '%${searchStr}%' ORDER BY ${_sort} ${_order} LIMIT ${limit} OFFSET ${offset};`, (err, resp) => {
        resolve(resp)
      })
    })
    Promise.all([promise1, promise2])
      .then(values => {
        values[1].forEach(element => {
          element.createdAt = dateFormat(element.createdAt, 'yyyy-mm-dd HH:MM:ss')
          element.updatedAt = dateFormat(element.updatedAt, 'yyyy-mm-dd HH:MM:ss')
          if (element.createdAt === element.updatedAt) {
            element.updatedAt = ''
          }
          switch (element.type) {
            case 'loitering': {
              element.folder = element.type
              element.type = 'Person Loitering in restricted area'
              break
            }
            case 'intrude': {
              element.folder = element.type
              element.type = 'Person trespassing - tripwire'
              break
            }
            case 'aod': {
              element.folder = element.type
              element.type = 'Object left unattended'
              break
            }
            case 'fr': {
              element.folder = element.type
              element.type = 'Face detection'
              break
            }
            case 'crowd': {
              element.folder = element.type
              element.type = 'People converged or crowd gathering'
              break
            }
            case 'sceneChange': {
              element.folder = element.type
              element.type = 'Camera scene changed'
              break
            }
            case 'objectRemoval': {
              element.folder = element.type
              element.type = 'Object removed/ possible theft'
              break
            }
            case 'Veh_Entered': {
              element.folder = element.type
              element.type = 'Vehicle entere restricted area'
              break
            }
            case 'Entered': {
              element.folder = element.type
              element.type = 'Person entered restricted area'
              break
            }
            case 'fire': {
              element.folder = element.type
              element.type = 'Incipient fire / fire detection'
              break
            }
            case 'cameraBlinded': {
              element.folder = element.type
              element.type = 'Camera Blinded'
              break
            }
            case 'cameraDefocused': {
              element.folder = element.type
              element.type = 'Camera defocused/ blurred'
              break
            }
            case 'Exited': {
              element.folder = element.type
              element.type = 'Person exited restricted area'
              break
            }
            case 'Veh_Exited': {
              element.folder = element.type
              element.type = 'Vehicle exited restricted area'
              break
            }
            case 'velocity': {
              element.folder = element.type
              element.type = 'Speeding vehicle'
              break
            }
            case 'enterExit': {
              element.folder = element.type
              element.type = 'Person entered / exited restricted area'
              break
            }
            case 'parking': {
              element.folder = element.type
              element.type = 'Vehicle parked in restricted area'
              break
            }
          }
        })
        res.status(200).json({ success: true, data: values[1], total: values[0] })
      })
      .catch(error => {
        throw error
      })
  })
}

const searchTickets = async (row_count, type, id, searchField, searchStr, data, res) => {
  const page = parseInt(data._page)
  const limit = parseInt(data._limit)
  const offset = (row_count === (page * limit)) ? (page - 1) * limit : (page - 1) * limit
  const _sort = Array.isArray(data._sort) ? data._sort[data._sort.length - 1] : data._sort
  const _order = Array.isArray(data._order) ? data._order[data._order.length - 1] : data._order

  await db.con().query(`SELECT * FROM tickets WHERE BINARY ${type} = '${id}' AND ${searchField} = '${searchStr}' ORDER BY ${_sort} ${_order} LIMIT ${limit} OFFSET ${offset};`, function (err, result) {
    if (err) return res.status(500).json({ success: false, message: err })
    result.forEach(element => {
      element.createdAt = dateFormat(element.createdAt, 'yyyy-mm-dd HH:MM:ss')
      element.updatedAt = dateFormat(element.updatedAt, 'yyyy-mm-dd HH:MM:ss')
      if (element.createdAt === element.updatedAt) {
        element.updatedAt = ''
      }
      switch (element.type) {
        case 'loitering': {
          element.folder = element.type
          element.type = 'Person Loitering in restricted area'
          break
        }
        case 'intrude': {
          element.folder = element.type
          element.type = 'Person trespassing - tripwire'
          break
        }
        case 'aod': {
          element.folder = element.type
          element.type = 'Object left unattended'
          break
        }
        case 'fr': {
          element.folder = element.type
          element.type = 'Facial Recognition'
          break
        }
        case 'crowd': {
          element.folder = element.type
          element.type = 'People converged or crowd gathering'
          break
        }
        case 'sceneChange': {
          element.folder = element.type
          element.type = 'Camera scene changed'
          break
        }
        case 'objectRemoval': {
          element.folder = element.type
          element.type = 'Object removed/ possible theft'
          break
        }
        case 'Veh_Entered': {
          element.folder = element.type
          element.type = 'Vehicle entere restricted area'
          break
        }
        case 'Entered': {
          element.folder = element.type
          element.type = 'Person entered restricted area'
          break
        }
        case 'fire': {
          element.folder = element.type
          element.type = 'Incipient fire / fire detection'
          break
        }
        case 'cameraBlinded': {
          element.folder = element.type
          element.type = 'Camera Blinded'
          break
        }
        case 'cameraDefocused': {
          element.folder = element.type
          element.type = 'Camera defocused/ blurred'
          break
        }
        case 'Exited': {
          element.folder = element.type
          element.type = 'Person exited restricted area'
          break
        }
        case 'Veh_Exited': {
          element.folder = element.type
          element.type = 'Vehicle exited restricted area'
          break
        }
        case 'velocity': {
          element.folder = element.type
          element.type = 'Speeding vehicle'
          break
        }
        case 'enterExit': {
          element.folder = element.type
          element.type = 'Person entered / exited restricted area'
          break
        }
        case 'parking': {
          element.folder = element.type
          element.type = 'Vehicle parked in restricted area'
          break
        }
      }
    })
    res.status(200).json({ success: true, data: result, total: row_count })
  })
}

exports.alertsOverview = async (req, res) => {
  const data = req.query
  const token = req.headers['x-access-token']
  const id = Array.isArray(data.id) ? data.id[data.id.length - 1] : data.id
  const type = Array.isArray(data.type) ? data.type[data.type.length - 1] : data.type
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    const st0 = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and createdAt = updatedAt;`, (err, resp) => {
        resolve(resp[0].count)
      })
    })
    const st1 = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and createdAt != updatedAt;`, (err, resp) => {
        resolve(resp[0].count)
      })
    })
    const l0 = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and level=0;`, (err, resp) => {
        resolve(resp[0].count)
      })
    })
    const l1 = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and level=1;`, (err, resp) => {
        resolve(resp[0].count)
      })
    })
    const l2 = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and level=2;`, (err, resp) => {
        resolve(resp[0].count)
      })
    })
    const l0r = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and createdAt = updatedAt and level=0;`, (err, resp) => {
        resolve(resp[0].count)
      })
    })
    const l1r = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and createdAt = updatedAt and level=1;`, (err, resp) => {
        resolve(resp[0].count)
      })
    })
    const l2r = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and createdAt = updatedAt and level=2;`, (err, resp) => {
        resolve(resp[0].count)
      })
    })
    Promise.all([st0, st1, l0, l1, l2, l0r, l1r, l2r])
      .then(values => {
        count.st0 = values[0]
        count.st1 = values[1]
        count.l0 = values[2]
        count.l1 = values[3]
        count.l2 = values[4]
        count.l0r = values[5]
        count.l1r = values[6]
        count.l2r = values[7]
        res.status(200).json({ success: true, data: count })
      })
      .catch(error => {
        throw error
      })
  })
}

exports.countTypes = async (req, res) => {
  const data = req.body
  await db.con().query(`SELECT type, count(type) as count FROM multi_tenant.tickets WHERE createdAt >= '${data.start}' and  createdAt <= '${data.end}' group by type;`, function (err, result) {
    if (err) return res.status(500).json({ success: false, message: err })
    const response = {
      count: result
    }
    res.status(200).json({ success: true, data: response })
  })
}

exports.getPeriod = async (req, res) => {
  const data = req.body
  await db.con().query(`SELECT * FROM tickets WHERE createdAt >= '${data.start}' and  createdAt <= '${data.end}' order by createdAt desc;`, function (err, result) {
    if (err) return res.status(500).json({ success: false, message: err })

    const response = {
      raw: result
    }
    res.status(200).json({ success: true, data: response })
  })
}

exports.check = (req, res) => {
  const d = new Date()
  const data = req.body
  let date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
  if (data.user == null) {
    date = data.date
    date = new Date(date)
    date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  }
  db.con().query(`UPDATE tickets set updatedAt = '${date}', reviewed = '${data.user}' where id = '${req.params.id}';`, function (err, result) {
    if (err) return res.status(500).json({ success: false, message: err })
    res.status(200).json({ success: true, data: result })
  })
}

exports.assign = (req, res) => {
  const data = req.body
  db.con().query(`UPDATE tickets set assigned= '${data.assigned}', assignedBy= '${data.assignedBy}' where id = '${req.params.id}';`, function (err, result) {
    if (err) return res.status(500).json({ success: false, message: err })
    res.status(200).json({ success: true, data: result })
  })
}
