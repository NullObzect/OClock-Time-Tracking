const dbConnect = require('../config/database')

const OptionsModel = {
  options: async () => {
    const optionsSql = 'SELECT * FROM `options`'
    const [rows] = await dbConnect.promise().execute(optionsSql)
    return rows
  },
  editWorkingFixedTime: async (id, fixedTime, opId) => {
    const getSql = 'UPDATE `options` SET `id`= ?, `option_value`= ? WHERE id = ?'
    const values = [id, fixedTime, opId]
    console.log({ values });

    const [rows] = await dbConnect.promise().execute(getSql, values)
    return rows.affectedRows
  },

}

module.exports = OptionsModel
