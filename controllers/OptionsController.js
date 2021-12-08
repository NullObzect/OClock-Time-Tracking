const OptionsModel = require('../models/OptionsModel')

const OptionsController = {

  getOptionsList: async (req, res) => {
    const optionList = await OptionsModel.options()
    res.render('pages/options', { optionList })
  },

}

module.exports = OptionsController
