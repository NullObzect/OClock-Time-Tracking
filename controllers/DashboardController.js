const UserModel = require('../models/UserModel')

const DashboardController = {
  getDashboard: async (req, res) => {
    const users = await UserModel.getAllUsersList()
    res.render('pages/dashboard', { users })
  },
}
module.exports = DashboardController
