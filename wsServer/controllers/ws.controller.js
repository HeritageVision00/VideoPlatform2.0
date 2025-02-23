const fs = require('fs')
require('dotenv').config({ path: '../../config.env' })
const check = require('../helpers/structure').checkStructure
const file = `${process.env.resourcePath}logs/wsAccess.log`
const line = '\n'
const { v4: uuidv4 } = require('uuid')
const connections = []
const { spawn } = require('child_process');

exports.ws =  (ws ,req) => {
    const id = req.params.id
    const clientId = req.params.clientId
    const branchId = req.params.branchId
    let dev = true
    if(process.env.NODE_ENV === 'production'){
        dev = false
    }
    let writer = fs.createWriteStream(file, { flags: 'a' }) 

    if (id !== 'client' && id !== 'algorithm'){
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
        
        if(id === 'algorithm'){
            ws.id = 'algorithm'
            connections.push(ws)
            ws.on('message', function incoming(message) {
                if(dev === true) console.log(`${id} said: ${message}`);
                const value = check(message)
                if(value.result === false){
                    const messa = {
                        success: false,
                        error: value.reason
                    }
                    ws.send(JSON.stringify(messa));
                }else{
                    broadcast(message, ids, ws)
                }
            });
        }else if (id === 'client'){
            ws.id = 'client'
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
        if(ws.id === 'algorithm'){
            return;
        }
        if(ws.ids.clientId === ids.clientId && ws.ids.branchId === ids.branchId){
            ws.send(message)
        }
    })
}

exports.stream =  (ws ,req) => {
    let dev = true
    if(process.env.NODE_ENV === 'production'){
        dev = false
    }
    try{
        const mess = `connection from: ${req._remoteAddress} at ${req._startTime}.`
        const initialMess =`Started ${mess}`
        ws.uuid = uuidv4()
        if(dev === true) console.log(initialMess)
        let ffmpeg
        ws.on('message', function incoming(message) {
            message = JSON.parse(message)
            const factor = 5
            if(dev === true) console.log(`Res: ${message.width} x ${message.height}`);
            if(!message.video){
                ffmpeg = spawn('ffmpeg', [
                    '-f', 'rawvideo',
                    '-pixel_format', 'rgb24',
                    '-video_size', `${Math.round(message.width / factor)}x${Math.round(message.height / factor)}`,
                    '-framerate', `${message.framerate}`,
                    '-i', '-',
                    '-codec:v', 'libx264',
                    '-preset', 'ultrafast',
                    '-loglevel', 'error',
                    // '-fflags', 'discardcorrupt',
                    // '-g',`${message.framerate}`,
                    // '-b:v', `${Math.round(videoData.byteLength /1000)}k`,
                    // '-maxrate',`${Math.round(videoData.byteLength /1000)}k`,
                    // '-bufsize', `${Math.round(videoData.byteLength /1000)}k`,
                    // '-buffer_size', `${videoData.byteLength}`,
                    '-tune', 'zerolatency',
                    '-f', 'rtsp',
                    'rtsp://127.0.0.1:1111/rtsp/stream',
                ])
            }else{
                const base64Data = message.video;
                const videoData = Buffer.from(base64Data, 'base64');
                console.log(videoData.byteLength, '===========================================',Math.round(message.width / factor) * Math.round(message.height / factor))

                ffmpeg.stdin.write(videoData);
                ffmpeg.stdin.end();
                
                ffmpeg.stderr.on('data', (data) => {
                    console.error(`FFmpeg : ${data}`);
                    });
    
                ffmpeg.on('exit', (code, signal) => {
                    if (dev) console.log(`FFmpeg process exited with code ${code} and signal ${signal}`);
            
                    // Close the WebSocket connection
                    ws.close();
                });
            }

        });
        ws.on('close', () => {
            const finalMess = `Stopped ${mess}`
            rem(ws.uuid)
            if(dev === true) console.log(finalMess)
        })
    }catch(err){
        if(dev === true) console.log(err)
    }
}