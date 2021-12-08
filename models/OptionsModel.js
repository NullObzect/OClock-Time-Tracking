const dbConnect = require('../config/database')

const OptionsModel = {
  options: async () => {
    const optionsSql = 'SELECT * FROM `options`'
    const [rows] = await dbConnect.promise().execute(optionsSql)
    return rows
  },

}

module.exports = OptionsModel
