const { dbOrm } = require("../config/database");

const addSchool = async (lon, lat, minimumGpa, maxNumberOfPupils) =>
    dbOrm.insert('School', {
        lon,
        lat,
        minimumGpa,
        maxNumberOfPupils
    })

module.exports = {
    addSchool
}
