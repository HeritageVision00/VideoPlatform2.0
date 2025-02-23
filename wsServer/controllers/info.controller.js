const fs = require('fs').promises;
const axios = require('axios')

exports.info = async (req, res) => {
    try{
        const data = await fs.readFile("package.json", 'binary');
        const ver = JSON.parse(data)
        delete ver.scripts
        delete ver.dependencies
        delete ver.devDependencies
        delete ver.main
        res.status(200).json({success: true, data: ver})
    }catch(err){
        res.status(500).json({success: false, error: err})
    }
}

exports.infoMain = async (req, res) => {
    const endpoint = `http://localhost:3300/api/serve/inf`
    try {
        const response = await axios.get(endpoint)
        res.status(200).json({ success: true, mess: response.data.data})
      } catch (err) {
        res.status(500).json({success: false, error: err.code})
      }
}

exports.vmsResponse = async (req, res) => {
    const resp = [
      {
        "name": "cam1",
        "rtsp": "rtsp://testing1",
        "id":"1256abc"
      },
      {
        "name": "cam2",
        "rtsp": "rtsp://testing2",
        "id":"1234abc"
      },
      {
        "name": "cam3",
        "rtsp": "rtsp://testing3",
        "id":"1234cba"
      },
      {
        "name": "cam4",
        "rtsp": "rtsp://testing4",
        "id":"4321abc"
      },
      {
        "name": "cam5",
        "rtsp": "rtsp://testing5",
        "id":"1234ert" 
      },
      {
        "name": "cam6",
        "rtsp": "rtsp://testing6",
        "id":"1234ertw" 
      }
    ]
    setTimeout(()=>{
        console.log('aaa')
        res.status(200).json(resp)
    },19000)
  }

  exports.testVideoBack = async (req, res) => {
    res.status(200).json({
        video_url: 'http://localhost:3301/api/pictures/checking-1684240523867.mp4'
    })
  }