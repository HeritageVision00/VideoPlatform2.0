const db = require('../models')
const usr = db.user
const algo = db.algorithm
const aa = db.aa
const bcrypt = require('bcryptjs')
const fs = require('fs')

exports.initial = async function () {
  const path =
  process.env.resourcePath
  try {
    await usr.create({
      id: '0000-11111-aaaaaa-bbbbbb',
      username: 'admin',
      password: bcrypt.hashSync('gr@ymaticsAdmin312', 12),
      email: 'test@graymatics.com',
      role: 'admin',
      id_account: '0000',
      id_branch: '0000',
      disabled: 0
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 0,
      name: 'Facial Recognition'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 1,
      name: 'Person Climbing Barricade'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 2,
      name: 'Loitering Detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 3,
      name: 'D&C of human, animal and vehicle'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 4,
      name: 'Parking Violation'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 5,
      name: 'Speeding Vehicle'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 6,
      name: 'Helmet detection on two-wheeler'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 7,
      name: 'Banned vehicle detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 8,
      name: 'Wrong way or illegal turn detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 9,
      name: 'Graffiti & Vandalism detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 10,
      name: 'Debris & Garbage detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 11,
      name: 'Garbage bin, cleanned or not'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 12,
      name: 'People Count'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 13,
      name: 'ANPR'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 14,
      name: 'Heatmap'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 15,
      name: 'Demographics'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 16,
      name: 'Abandoned Object'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 17,
      name: 'Intrusion Alert'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 18,
      name: 'Attendance Management'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 19,
      name: 'Violence'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 20,
      name: 'No Mask'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 21,
      name: 'Social Distancing'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 22,
      name: 'Queue Management'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 23,
      name: 'Helmet Detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 24,
      name: 'Vault Open'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 25,
      name: 'Barrier Not Closed'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 26,
      name: 'Vehicle Counting'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 27,
      name: 'Camera Tampering'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 28,
      name: 'Animals On Road'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 29,
      name: 'Accident Detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 30,
      name: 'Axle Detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 31,
      name: 'Carmake'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 32,
      name: 'Clothing'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 33,
      name: 'Vehicle Count at Screen'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 34,
      name: 'Car Brand'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 35,
      name: 'Weapon'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 36,
      name: 'Bottle'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 37,
      name: 'People Path'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 38,
      name: 'Person Collapsing'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 39,
      name: 'Fire Detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 40,
      name: 'Pulling Hair'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 41,
      name: 'Waving Hands'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 42,
      name: 'Smoking'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 43,
      name: 'Crowd'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 44,
      name: 'Slapping'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 45,
      name: 'Blocking'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 46,
      name: 'Running'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 47,
      name: 'Disrobing'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 48,
      name: 'Purse Snatching'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 49,
      name: 'Following'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 50,
      name: 'Pushing'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 51,
      name: 'People Tracking'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 52,
      name: 'Transpassing'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 53,
      name: 'Camera Defocused'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 54,
      name: 'Camera Blinded'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 55,
      name: 'Scene Change'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 56,
      name: 'Object Removal'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 57,
      name: 'Smoke Detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 58,
      name: 'Velocity'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 59,
      name: 'Enter / Exit'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 60,
      name: 'No Exit'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 61,
      name: 'Harrasment'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 62,
      name: 'Abduction'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 63,
      name: 'Direction of car'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 64,
      name: 'Video Signal Lost'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 65,
      name: 'Vehicle entered / exited restricted area'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 66,
      name: 'Fire and Smoke detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 67,
      name: 'People in the tunnel'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 68,
      name: 'Meat / Ham & Cheese'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 69,
      name: 'Black / White Listed'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 70,
      name: 'Vehicle congestion'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 71,
      name: 'PPE'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 72,
      name: 'Vehicle loitering'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 73,
      name: 'Battery defect'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 74,
      name: 'Battery module defect'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 75,
      name: 'Traffic Signal'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 76,
      name: 'Flashing Nudity'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 77,
      name: 'Stalking Woman in Isolated Area'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 78,
      name: 'Stalking Woman at Night Time'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 79,
      name: "Chasing Woman's Scooty in Isolated Area."
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 80,
      name: 'Gunshot audio'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 81,
      name: 'Injury and Blood'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 82,
      name: 'Suicide Tendency'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 83,
      name: 'Smokers Group Identification'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 84,
      name: 'Drinkers Group Idetification'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 85,
      name: 'Teasing Woman Near Pan Shop'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 86,
      name: 'Open Defecation'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 87,
      name: 'Acid Attack'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 88,
      name: 'Zigzag Driving'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 89,
      name: 'Male Movement'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 90,
      name: 'Male Behavior'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 91,
      name: 'Abnormal Behavior'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 92,
      name: 'Jaywalking'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 93,
      name: 'Abnormal Running'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 94,
      name: 'Gambling Spot'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 95,
      name: 'Frequent Visiting'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 96,
      name: 'Stranded Girl'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 97,
      name: 'Unconscious Woman'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 98,
      name: 'Stunt Bikers'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 99,
      name: 'Ink Throwing'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 100,
      name: 'Drugs Distribution'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 101,
      name: 'Pornographic Material'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 102,
      name: 'Kidnapping'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 103,
      name: 'Women Safety'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 104,
      name: 'Women Collapse'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 105,
      name: 'Women Violence'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 106,
      name: 'Detection of Slapping/Hitting Women'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 107,
      name: 'NPR of snatching Detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 108,
      name: 'Behaviour Detection of Boys/Men at Shadow area '
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 109,
      name: 'Frequent Visiting Detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 110,
      name: 'Uniform Tracking'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 111,
      name: 'Edge crossing'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 112,
      name: 'Jump on track'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 113,
      name: 'Forklift Pedestrian Proximity Detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 114,
      name: 'Pallet Dwell Time Detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 115,
      name: 'Street Vendor detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 116,
      name: 'Nurse dwelling'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 117,
      name: 'Bag Detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 118,
      name: 'Absences'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  try {
    await algo.create({
      id: 119,
      name: 'Bi-Cycle Theft and Motorbike Theft'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // const lastId = 70
  try {
    await usr.create({
      id: '3333-666666-cccccc-nnnnnn',
      username: 'testing',
      password: bcrypt.hashSync('Graymatics1!', 12),
      email: 'testing@graymatics.com',
      role: 'client',
      id_account: '3333-666666-cccccc-nnnnnn',
      id_branch: '3333-666666-cccccc-nnnnnn',
      cameras: 9999,
      analytics: 9999,
      disabled: 0
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  const pathPic = `${path}3333-666666-cccccc-nnnnnn`
  if (!fs.existsSync(pathPic)) {
    await fs.promises.mkdir(pathPic)
    const pathBranch = `${pathPic}/3333-666666-cccccc-nnnnnn`
    await fs.promises.mkdir(pathBranch)
    await fs.promises.mkdir(`${pathBranch}/pictures`)
    await fs.promises.mkdir(`${pathBranch}/heatmap_pics`)
  }
  for (let i = 0; i <= this.lastId; i++) {
    try {
      await aa.create({
        algoId: i,
        accountId: '3333-666666-cccccc-nnnnnn'
      })
    } catch (err) {
      if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
    }
  }
}
// INSERT INTO `multi_tenant`.`algorithms` (`id`, `name`, `createdAt`, `updatedAt`) VALUES ('27', 'Camera Tampering', '2020-10-05 07:31:29', '2020-10-05 07:31:29');

exports.lastId = 119
