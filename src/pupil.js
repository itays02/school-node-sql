const {calculatePupilFormula} = require("./helpers");
const {calculateAverage} = require("./helpers");
const { dbOrm: db } = require("../config/database");

const addPupil = async (lon, lat, grades) => {
    const pupilId = await db.insert('Pupil',{
        lon,
        lat
    })

    const insertGradesPromises = grades.map(singleGrade => {
        db.insert('Grade',{
            pupilId,
            courseName: singleGrade.courseName,
            grade: singleGrade.grade
        })
    })

    await Promise.all(insertGradesPromises)
    return pupilId
}

const addPupilFriend = async (pupilId1, pupilId2) =>
    db.insert('PupilFriend',{ pupilId1, pupilId2 })


const getFriendInSchoolCount = async (schoolId, friendsIds = []) => {
    const schoolPupils = await db.select('PupilSchool', { schoolId })
    return {
        allPupils: schoolPupils.length,
        friendsInSchool: schoolPupils.filter(pupilId => friendsIds.includes(pupilId)).length
    }
}

const enrollPupil = async pupilId => {
    const pupil = (await db.select('Pupil', { id: pupilId }))[0]
    const friendsIds =
        (await db.select('PupilFriend', { pupilId1: pupilId, pupilId2: pupilId }, 'OR')).map(connection=>
            connection.pupilId1 === pupil.id ? connection.pupilId2 : connection.pupilId1)
    const schools = await db.select('School')

    let chosenSchool = {
        max: 0,
        schoolId: -1
    }

   for(let i=0; i<schools.length; i++){
       const { id, lon, lat, minimumGpa, maxNumberOfPupils } = schools[i]

       const {allPupils, friendsInSchool} = await getFriendInSchoolCount(id, friendsIds)
       const pupilGrades = (await db.select('Grade', { pupilId })).map(({grade}) => grade)
       const gpa = calculateAverage(pupilGrades)
       if(allPupils < maxNumberOfPupils && minimumGpa < gpa){
           const pointsPerPupil = calculatePupilFormula(friendsInSchool, {lat, lon}, {lat: pupil.lat, lon: pupil.lon})
           if(chosenSchool.max <= pointsPerPupil){
               chosenSchool = { max: pointsPerPupil, schoolId: id }
           }
       }
   }

    if(chosenSchool.schoolId !== -1) {
        await db.insert('PupilSchool', {pupilId, schoolId: chosenSchool.schoolId})
    }

}

module.exports = {
    addPupil,
    addPupilFriend,
    getFriendInSchoolCount,
    enrollPupil
}
