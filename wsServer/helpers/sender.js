const ws = require('ws')
const { v4: uuidv4 } = require('uuid')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

exports.sender = async function(){
    try{
        const connection = new ws('ws://localhost:3301/ws/connect/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/algorithm')
        let ts, uuid, message, dwell = 10, analytic, parameters, track_id = 1, zone = 0
        await delay(1000)
        dynamicIntervalFunction(connection);

        // setInterval(async ()=>{
        //     uuid = uuidv4()
        //     ts = Math.round((new Date()).getTime() / 1000)
        //     analytic = 47
        //     parameters = {
        //         camera_name: "test House",
        //     }
        //     message = {
        //         "id": `${uuid}`,
        //         "TimeStamp": ts,
        //         "Analytic": analytic,
        //         "CameraId": "bffdb3cf-8cf3-4454-9474-3a47cf99ef10",
        //         "Parameters": parameters,
        //         "Detail": "string",
        //         "UrlImage": "string"
        //     }
        //     connection.send(JSON.stringify(message))
        //     await delay(1000)
        //     uuid = uuidv4()
        //     ts = Math.round((new Date()).getTime() / 1000)
        //     connection.send(JSON.stringify(message))
        
        //     await delay(2000)
        //     uuid = uuidv4()
        //     ts = Math.round((new Date()).getTime() / 1000)
        //     connection.send(JSON.stringify(message))
        // }, 5000)
    }catch(err){
        console.error(err)
    }
}

let currentInterval = 1000, counter = 0
async function dynamicIntervalFunction(connection) {
    counter++
    currentInterval += 1000;

    if(currentInterval === 3000){
        currentInterval += 1000
    }
    if(currentInterval === 5000){
        currentInterval = 1000
    }
    if(currentInterval === 16000){
        currentInterval = 1000
    }
    if(currentInterval === 61000){
        currentInterval = 1000
    }
    if(counter === 15){
        currentInterval = 10000
    }
    if(counter === 30){
        currentInterval = 60000
    }
    let uuid = uuidv4()
    let ts = Math.round((new Date()).getTime() / 1000)
    analytic = 47
    parameters = {
        camera_name: "test House",
    }
    message = {
        "id": `${uuid}`,
        "TimeStamp": ts,
        "Analytic": analytic,
        "CameraId": "bffdb3cf-8cf3-4454-9474-3a47cf99ef10",
        "Parameters": parameters,
        "Detail": "string",
        "UrlImage": "string"
    }
    connection.send(JSON.stringify(message))
    setTimeout(() => {
      dynamicIntervalFunction(connection);
    }, currentInterval);
  }
