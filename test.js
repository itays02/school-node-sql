const {addSchool} = require("./src/school");
const {addPupil, addPupilFriend, enrollPupil, getFriendInSchoolCount} = require("./src/pupil");

const init = async () => {
    await addPupil(21.41, 22.43, [{
        "courseName": "English",
        "grade": 90
    }, {
        "courseName": "Sport",
        "grade": 86
    }
    ])
    await addPupil(24.26, 42.43, [{
        "courseName": "History",
        "grade": 67
    }, {
        "courseName": "Sport",
        "grade": 96
    }
    ])
    await addPupil(20.26, 32.91, [{
        "courseName": "History",
        "grade": 92
    }, {
        "courseName": "Sport",
        "grade": 90
    }
    ])
    await addSchool(24.38, 32.32, 70, 17)
    await addSchool(28.18, 21.13, 54, 2)
    await addPupilFriend(1, 2)
    await addPupilFriend(1, 3)
    await enrollPupil(1)
    await enrollPupil(2)
}

const test = async ()=> {
    await init()
    const school1 = (await getFriendInSchoolCount(1)).allPupils
    const school2 = (await getFriendInSchoolCount(2)).allPupils

    console.log(school1 === 0 && school2  === 2)
}

module.exports = {
    test
}
