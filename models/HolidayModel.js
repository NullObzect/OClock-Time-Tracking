const dbConnect = require('../config/database')

const HolidayModel = {

  addHoliday: async (title, start, end) => {
    const addHolidaySql = 'INSERT INTO holidays (title, start, end) VALUES(?,?,?)'
    const values = [title, start, end];
    const [rows] = await dbConnect.promise().execute(addHolidaySql, values);
    return rows;
  },

}

module.exports = HolidayModel
