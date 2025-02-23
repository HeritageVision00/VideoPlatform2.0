const ws = require('ws')
const { v4: uuidv4 } = require('uuid')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const db = require('../models')
const Status = db.status

exports.sender = async function(){
    try{
        const idAccount = '3333-666666-cccccc-nnnnnn'
        const idBranch = '3333-666666-cccccc-nnnnnn'
        const connection = new ws(`ws://localhost:3301/ws/status/${idAccount}/${idBranch}/sender`)
        await delay(1000)
        const status =  await Status.findAll({
            where: { id_branch: idBranch, id_account: idAccount  }
        })
        // console.log(status)

        setInterval(async ()=>{
            uuid = uuidv4()
            message = {
                "id": `${uuid}`,
            }
            connection.send(JSON.stringify(message))
            await delay(1000)
            uuid = uuidv4()
            connection.send(JSON.stringify(message))
        
            await delay(2000)
            uuid = uuidv4()
            connection.send(JSON.stringify(message))
        }, 5000)
    }catch(err){
        console.error(err)
    }
}
