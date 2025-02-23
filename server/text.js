function calculateVal (start, end) {
  const currentDate = new Date(start)
  const targetDate = new Date(end)
  const hoursPerDay = 10
  let val = 0

  if ((targetDate - currentDate) / (1000 * 3600 * 24) < 1 && (targetDate - currentDate) / (1000 * 3600) < 10) {
    val = (targetDate - currentDate) / (1000 * 3600)
    val = Math.round(val * 100) / 100
  } else {
    while (currentDate <= targetDate) {
      const dayOfWeek = currentDate.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        val++
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }
    val = val * hoursPerDay
  }

  return val
}

const lessThanADay = {
  start: '2023-10-17T12:00:00.000Z',
  end: '2023-10-17T13:58:59.000Z'
}

const today = {
  start: '2023-10-17T00:00:00.000Z',
  end: '2023-10-17T23:58:59.000Z'
}

const month = {
  start: '2023-09-30T23:00:00.000Z',
  end: '2023-10-31T23:59:59.000Z'
}

const year = {
  start: '2022-01-01T00:00:00.000Z',
  end: '2023-01-01T23:59:59.000Z'
}

// const hoursWeird = calculateVal(lessThanADay.start, lessThanADay.end)
// const hoursToday = calculateVal(today.start, today.end)
// const hoursMonth = calculateVal(month.start, month.end)
// const hoursYear = calculateVal(year.start, year.end)

// console.log(hoursWeird, hoursToday, hoursMonth, hoursYear)

// const val = 'http://10.7.5.104:5010/ExportedFiles/101723195510142/ExportedMedia_4.avi'

// console.log(val.split('.')[val.split('.').length - 1])

const array1 = [{ id: 1, name: 'Alice' }];
const array2 = [{ id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' }];
const array3 = [{ id: 4, name: 'David' }, { id: 5, name: 'Eve' }, { id: 6, name: 'Frank' }];

const mergedArray = [...array1, ...array2, ...array3]
// console.log(mergedArray)


// console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)


let re = [
  {
    "output_file": "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/videos/170e1769-995c-494a-9399-b4d8024dbed5_processed.mp4",
    "location": "/usr/src/app/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/videos/170e1769-995c-494a-9399-b4d8024dbed5_processed.mp4"
  },
  {
    "output_file": "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/videos/88bdecdb-be72-4893-b8a4-1911b9756c56_processed.mp4",
    "save_paths": [
      "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/50_1737467294.761011_a36e24f54f8542c38c230ab9c011c215.jpg",
      "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/100_1737467386.7140362_a2596ae4df53473caf1a2c0106b83509.jpg",
      "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/150_1737467392.116226_c8034bb3250748ecb0dd535790463881.jpg",
      "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/200_1737467471.9187517_6176221bc6384574a4598b9b11a37654.jpg",
      "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/250_1737467477.3370476_e0c565920eb44b8fa10974eb5b7131e1.jpg",
      "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/300_1737467481.6977034_0d55ea20e9334f228ec009098dbcd431.jpg",
      "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/350_1737467485.393059_7bd2711aa2d747c98729223b8d057f58.jpg",
      "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/400_1737467496.1406457_0ad8cb2adc98474ab5671adc8a9ecc6d.jpg",
      "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/450_1737467498.692019_727e011722c44cc6b24dfac6ad2c8988.jpg",
      "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/500_1737467569.5202348_42e22e4d5111437f92a30d03ba2c180d.jpg",
      "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/550_1737467579.851558_63aaff79872e4c4cb368190d99a11ea7.jpg",
      "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/600_1737467583.2023675_e8e64e2596e54270af07d98a38494028.jpg",
      "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/650_1737467592.9729197_abb4a77343c74330a956e929c6864e70.jpg",
      "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/700_1737467662.3829312_aa5c1d8a4d834743b0ee859755b5b3fa.jpg",
      "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/750_1737467667.8354163_4586fcc4d7bb487da4e75a217f566554.jpg",
      "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/800_1737467677.5138648_87229c9db2454359901571ccf7be537b.jpg"
    ],
    "location": "/usr/src/app/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/videos/88bdecdb-be72-4893-b8a4-1911b9756c56_processed.mp4"
  },
  "**The video contains the following information that was retrieved by the Graymatics Video Summarization's GenAI Module:**\n\n**Summary:**\nThe video footage depicts several individuals engaging in various activities during different time stamps. From these observations, it appears that there were two main groups of people involved in the incident - one consisting of three males and another comprising of a single male and a female.\nDuring the bike theft incident (timestamp 0:00-0:15), a male individual wearing a white T-shirt and white pants was observed standing near the bicycle. Another male person was also spotted nearby, but their appearance was not described in detail.\nAt timestamp 0:20-0:30, a violent incident occurred involving multiple individuals. One male person was seen standing, while another male person was observed wearing a white shirt and white pants. Additionally, a third male person was noticed standing nearby.\nIncidentally, around timestamp 0:45-0:55, a female person was seen standing alone."
]

const api = 'aaaaaa'
for(let i = 0; i < re.length; i++){
  if(re[i].output_file){
    re[i].output_file = re[i].output_file.replace('/home/resources/', `${api}/pictures/`)
    re[i].disabled = false
    if(re[i].save_paths){
      re[i].save_paths = re[i].save_paths.map(img =>
        img.replace('/home/resources/', `${api}/pictures/`)
      );
    }
  }else{
    this.summary = re[i].replace(/\\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }
}
console.log(re)