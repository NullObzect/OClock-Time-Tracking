const dbConnect = require('../config/database')

const HolidayModel = {

  addHoliday: async (title, start, end) => {
    const addHolidaySql = 'INSERT INTO holidays (title, start, end) VALUES(?,?,?)'
    const values = [title, start, end];
    const [rows] = await dbConnect.promise().execute(addHolidaySql, values);
    return rows;
  },
  holidaysList: async () => {
    const getList = "SELECT H.id AS id, H.title AS title, DATE_FORMAT(start,'%d %b %y') AS start, DATE_FORMAT(end, '%d %b %y') AS end, DATEDIFF(end,start) + 1 AS duration  FROM `holidays` AS H";
    const [rows] = await dbConnect.promise().execute(getList)
    return rows;
  },
  getHolidayData: async (id) => {
    const getData = "SELECT H.title AS title, DATE_FORMAT(start, '%m/%d/%Y') AS start, DATE_FORMAT(end, '%m/%d/%Y') AS end FROM `holidays` AS H WHERE id = ?";
    const value = [id];
    const [row] = await dbConnect.promise().execute(getData, value)
    return row[0];
  },
  updateHoliday: async (id, title, start, end, hId) => {
    const getUpdateSql = 'UPDATE `holidays` SET `id`=?,`title`=?,`start`=?,`end`=? WHERE id = ?';
    const value = [hId, title, start, end, id]
    const [row] = await dbConnect.promise().execute(getUpdateSql, value);
    return row.affectedRows
  },
  deleteHoliday: async (id) => {
    const deleteSql = 'DELETE FROM `holidays` WHERE  id = ?'
    const value = [id]
    const [row] = await dbConnect.promise().execute(deleteSql, value)
    return row.affectedRows;
  },
  // this week holiday
  thisWeekHolidays: async (saturdayDate) => {
    const query = `SELECT DATE_FORMAT(start,'%Y-%m-%d') AS holidayStartDate, DATEDIFF(end,start) + 1 countHolidays FROM holidays AS h  WHERE DATE(H.start) BETWEEN '${saturdayDate}' AND DATE(NOW()-1)`
    const [rows] = await dbConnect.promise().execute(query);
    return rows;
  },
  thisMonthOffdaysInHolidays: async () => {
    const query = 'SELECT DAYNAME(H.start) AS stratDayName, DATEDIFF(end,start) + 1 countDays FROM holidays AS h  WHERE  DATE(H.start) BETWEEN date( CURRENT_DATE - INTERVAL  DAYOFMONTH(CURRENT_DATE)-1 DAY) and date(CURRENT_DATE)'
    const [rows] = await dbConnect.promise().execute(query);
    return rows;
  },
  // this year holidays
  thisYearHolidays: async () => {
    const query = "SELECT DATE_FORMAT(start,'%Y-%m-%d') AS holidayStartDate, DATEDIFF(end,start) + 1 countHolidays FROM holidays AS h  WHERE DATE(H.start) BETWEEN date( CURRENT_DATE - INTERVAL  DAYOFYEAR(CURRENT_DATE)-1 DAY) and date(CURRENT_DATE)"
    const [rows] = await dbConnect.promise().execute(query);
    return rows;
  },
  // this year holidays in year

  thisYearOffdaysInHolidays: async () => {
    const query = 'SELECT DAYNAME(H.start) AS stratDayName, DATEDIFF(end,start) + 1 countDays FROM holidays AS h  WHERE  DATE(H.start) BETWEEN date( CURRENT_DATE - INTERVAL  DAYOFYEAR(CURRENT_DATE)-1 DAY) and date(CURRENT_DATE)'
    const [rows] = await dbConnect.promise().execute(query);
    return rows;
  },
  //  between two dates holidays
  betweenTwoDatesHolidays: async (startDate, endDate) => {
    const query = 'SELECT DAYNAME(start) AS stratDayName, DATEDIFF(end,start) + 1 countDays, DATE_FORMAT(start,"%Y-%m-%d") AS holidayStartDate, DATEDIFF(end,start) + 1 countHolidays FROM holidays AS h  WHERE DATE(H.start) BETWEEN ? AND ?'
    const values = [startDate, endDate]
    const [rows] = await dbConnect.promise().execute(query, values);
    return rows;
  },

}

module.exports = HolidayModel
