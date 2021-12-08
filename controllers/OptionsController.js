const OptionsModel = require('../models/OptionsModel')

const OptionsController = {

  getOptionsList: async (req, res) => {
    const optionList = await OptionsModel.options()
    res.render('pages/options', { optionList })
  },
  updateFixedTime: async (req, res) => {
    console.log(req.body);

    const { optionId, fixedTime } = req.body;
    const id = optionId;
    console.log(id);

    const isUpdate = await OptionsModel.editWorkingFixedTime(optionId, fixedTime, id)
    if (isUpdate.errno) {
      res.send('Error')
    } else {
      res.redirect('/options')
    }
  },

}

module.exports = OptionsController
