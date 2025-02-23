const fs = require('fs')
require('dotenv').config({ path: '../../config.env' })
const file = `${process.env.resourcePath}logs/wsAccess.log`
const { v4: uuidv4 } = require('uuid')
const connections = []
const line = '\n'
const ws = require('ws')
const db = require('../models')
const Status = db.status
const token = {}
const intervals = {}
const axios = require('axios')
const promiseObject = {};
const cams = {}

exports.status =  (ws ,req) => {
    const id = req.params.sender
    const clientId = req.params.clientId
    const branchId = req.params.branchId
    let dev = true
    if(process.env.NODE_ENV === 'production'){
        dev = false
    }
    let writer = fs.createWriteStream(file, { flags: 'a' }) 

    if (id !== 'reader' && id !== 'sender'){
        const messa = {
            success: false,
            error: "Unauthorized"
        }
        ws.send(JSON.stringify(messa));
        const mess = `Tried to connect ${req._remoteAddress} using id: ${id} at ${req._startTime}.`
        writer.write(mess + line);
        if(dev === true) console.log(mess);
        return ws.close()
    }

    try{
        const mess = `connection from: ${id} in ${req._remoteAddress} at ${req._startTime}.`
        const initialMess =`Started ${mess}`
        ws.uuid = uuidv4()
        const ids = {
            clientId: clientId,
            branchId: branchId
        }
        ws.ids = ids
        if(dev === true) console.log(initialMess)

        writer.write(initialMess + line);

        const connectionMessage = {
            success: true,
            time: new Date(),
            Parameters: {
                clientId: clientId,
                branchId: branchId
            }
        }
        ws.send(JSON.stringify(connectionMessage))
        
        if(id === 'sender'){
            ws.id = 'sender'
            connections.push(ws)
            ws.on('message', function incoming(message) {
                if(dev === true) console.log(`${id} said: ${message}`);
                // const value = check(message)
                // if(value.result === false){
                //     const messa = {
                //         success: false,
                //         error: value.reason
                //     }
                //     ws.send(JSON.stringify(messa));
                // }else{
                broadcast(message, ids, ws)
                // }
            });
        }else if (id === 'reader'){
            ws.id = 'reader'
            connections.push(ws)
            ws.on('message', function incoming(message) {
                if(dev === true) console.log(`${id} said: ${message}`);
                const messa = {
                    success: false,
                    error: "Message can't be sent"
                }
                ws.send(JSON.stringify(messa));
            });
        }
    
        ws.on('close', () => {
            const finalMess = `Stopped ${mess}`
            writer.write(finalMess + line);
            rem(ws.uuid)
            if(dev === true) console.log(finalMess)
        })
    }catch(err){
        if(dev === true) console.log(err)
    }

}

function rem(uuid){
    for(let i = 0; i < connections.length; i++){
        if(connections[i].uuid === uuid){
            connections.splice(i, 1)
        }
    }
}

function broadcast(message, ids){
    connections.forEach( (ws) => {
        if(ws.id === 'sender'){
            return;
        }
        if(ws.ids.clientId === ids.clientId && ws.ids.branchId === ids.branchId){
            ws.send(message)
        }
    })
}

exports.checker = async (req, res) => {
    const data = req.body
    const clientId = req.params.clientId
    const branchId = req.params.branchId
    token[`${clientId}/${branchId}`] = req.headers['x-access-token']
    if (data.start === true) {
        if(!intervals[`${clientId}/${branchId}`]){
            start(clientId, branchId)
            res.status(200).json({success: true, mess: 'Starting...'})
        } else {
            res.status(201).json({success: true, mess: 'Connecting...'})
        }
    }else {
        stop(clientId, branchId)
        token[`${clientId}/${branchId}`] = null
        res.status(202).json({success: true, mess: 'Stopping...'})
    }
}

async function start(idAccount, idBranch){
    const id = `${idAccount}/${idBranch}`
    const length = parseInt(process.env.ALGOSNUM)
    try{
        const connection = new ws(`ws://${process.env.my_ip}:${process.env.PORTWS}/ws/status/${idAccount}/${idBranch}/sender`)
        const count = {}
        const int = setInterval(async ()=>{
            const status =  await Status.findAll({
                where: { id_branch: idBranch, id_account: idAccount  }
            })
            let camId = null, progr = 0
            const cache = {}
            if(!cams.hasOwnProperty(id)){
                cams[id] = {}
            }
            for (const stat of status){
                if(camId === null){
                    camId = stat.dataValues.idCam
                    count[camId] = 0
                }
                if(camId !== stat.dataValues.idCam){
                    camId = stat.dataValues.idCam
                    if(cache[camId] !== true){
                        count[camId] = 0
                    }
                    if(cams[id].hasOwnProperty(camId)){
                        progr = cams[id][camId]
                    }else{
                        count[camId] = 0
                        progr = 0
                    }
                }
                cache[camId] = true
                if(cams[id][camId] === 100 || cams[id][camId] === 200 || cams[id][camId] === 300) {
                    continue
                }
                count[camId]++
                if(stat.dataValues.status === 1){
                    const num = ( 1 / length ) * 100
                    progr = progr + (Math.round(num * 100) / 100)
                }
                if(count[camId] === length){
                    if(progr === 0) progr = 1
                    if(progr === 99.99 || progr === 100 ){
                        progr = 100
                    }
                }
                cams[id][camId] = progr
            }

            uuid = uuidv4()
            message = {
                "cams": cams[id],
            }
            console.log(message)
            connection.send(JSON.stringify(message))

            for (const cam of Object.keys(cams[id])){
                try{
                    if(cams[id][cam] === 100){
                        checkPromiseStatus(cam, `http://${process.env.my_ip}:${process.env.PORTNODE}/api/summarization/${cam}`, id)
                            .then(data => {
                                // Do something with the resolved data
                                cams[id][cam] = 200
                            })
                            .catch(error => {
                                // cams[cam] = progr
                                // Continue checking if data is not yet available
                                console.log('Data is not yet available');
                            });
                    }else if (cams[id][cam] === 200){
                        checkPromiseStatus(cam, `http://${process.env.my_ip}:${process.env.PORTNODE}/api/sum/${cam}`, id)
                        .then(data => {
                            // Do something with the resolved data
                            cams[id][cam] = 300
                        })
                        .catch(error => {
                            // cams[cam] = progr
                            // Continue checking if data is not yet available
                            console.log('Data is not yet available');
                        });
                    } else if (cams[id][cam] === 300){
                        continue
                    } else {
                        cams[id][cam] = 0
                    }
                }catch (err){
                    console.error(err)
                }
            }
        }, 1000)

        intervals[id] = int;
        return int;
    }catch(err){
        console.error(err)
    }
}

function stop(idAccount, idBranch) {
    const id = `${idAccount}/${idBranch}`
    clearInterval(intervals[id])
    delete intervals[id]
}

function startFetchingData(key,route, ids) {
    promiseObject[key] = fetchData(route, ids);
}

function fetchData(route, ids) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token[ids]
        }
    };
    return axios.get(route, config)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;
        });
}

function checkPromiseStatus(key, route, ids) {
    if (promiseObject[key]) {
        return promiseObject[key].then(data => {
            // console.log('Promise resolved with data:', data);
            return data;
        }).catch(error => {
            console.error('Promise rejected with error:', error);
            throw error;
        });
    } else {
        startFetchingData(key, route, ids);
        console.log('Promise not found for key:', key);
        return Promise.reject('Promise not found');
    }
}
