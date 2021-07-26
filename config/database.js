const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:', err => {
    if (err) {
        return console.error(err.message);
    }
    db.run('CREATE TABLE Pupil (id INTEGER primary key autoincrement, lon REAL, lat REAL );');
    db.run('CREATE TABLE Grade (pupilId INTEGER, courseName TEXT, grade INTEGER);');
    db.run('CREATE TABLE School (id INTEGER primary key autoincrement, lon REAL, lat REAL, minimumGpa INTEGER, maxNumberOfPupils INTEGER );');
    db.run('CREATE TABLE PupilFriend (pupilId1 INTEGER, pupilId2 INTEGER );');
    db.run('CREATE TABLE PupilSchool (pupilId INTEGER, schoolId INTEGER );');
});

const getSqlValuesFormat = values =>
    values.map(value => typeof value === 'string' ? `'${value}'` : value)

const dbOrm = {
    insert: async (tableName, data = {}) => {
        return new Promise((resolve, reject) => {
            const transformedValues = getSqlValuesFormat(Object.values(data)).join(',')
            db.run(`INSERT INTO ${tableName} (${Object.keys(data)}) VALUES (${transformedValues})`)
            db.get('SELECT last_insert_rowid()', [], (err, result) =>
                !err ? resolve(result['last_insert_rowid()']) : reject(err))
        })
    },
    select: async (tableName, filters, intersect = 'AND') => {
        return new Promise((resolve, reject) => {
            let whereClause = ''
            if (filters) {
                const transformedValues = getSqlValuesFormat(Object.values(filters))
                whereClause = 'where ' +
                    Object.keys(filters).map((key, index) => `${key} = ${transformedValues[index]}`).join(` ${intersect} `)
            }

            const queryCmd = `SELECT * from ${tableName} ${whereClause}`
            db.all(queryCmd, [], (err, result) =>
                !err ? resolve(result) : reject(err))
        })
    },
    count: async (tableName, filters, intersect = 'AND') => (await dbOrm.select(tableName, filters, intersect)).length
}

module.exports = {
    dbOrm
};

