const express = require('express');
const { addSchool} = require("../src/school");
const { addPupil, addPupilFriend, enrollPupil } = require("../src/pupil");
const router = express.Router();
const { test } = require("../test");

router.use((req, res, next)=> {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
  res.append('Content-Type', 'application/json');

  next();
});

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/test', async(req, res, next) => {
  await test()
  res.sendStatus(200)
});

router.post('/pupil', async (req, res, next) => {
  const { lat, lon, grades } = req.body
  try {
    const pupilId = await addPupil(lat, lon, grades)
    res.send({ pupilId })
  } catch(err){
    res.sendStatus(400)
  }
});

router.post('/school', async (req, res, next) => {
  const { lat, lon, minimumGpa, maxNumberOfPupils } = req.body
  try {
    const schoolId = await addSchool(lat, lon, minimumGpa, maxNumberOfPupils)
    res.send({ schoolId })
  } catch(err) {
    res.sendStatus(400)
  }
});

router.post('/setFriendShip/:firstPupilId/:secondPupilId', async (req, res, next) => {
  try {
    const { firstPupilId, secondPupilId } = req.params
    await addPupilFriend(firstPupilId, secondPupilId)
    res.sendStatus(200)
  } catch(err){
    res.sendStatus(400)
  }
});

router.post('/enroll/:pupilId', async (req, res, next) => {
  try{
  const { pupilId } = req.params
    await enrollPupil(pupilId)
    res.sendStatus(200)
  } catch(err){
    res.sendStatus(400)
  }
});

module.exports = router;
