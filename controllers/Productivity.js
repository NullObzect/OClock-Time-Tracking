const LogModel = require('../models/LogModel')

const Productivity = {

  getProductivityPage: async (req, res) => {
    console.log('page')

    res.render('pages/productivity')
  },

  lastThirtydaysData: async (req, res) => {
    const { user } = req
    console.log(user.id)
    const lastThrityDays = await LogModel.lastThirtydaysData(user.id)

    console.log({ lastThrityDays })
    if (lastThrityDays.length !== 0) {
      res.json(lastThrityDays)
    }
  },

}
module.exports = Productivity
