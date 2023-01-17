const PayrollModel = require('../models/PayrollModel')
const UserModel = require('../models/UserModel')

const Payroll = {

  getPayroll: async (req, res) => {
    const salaries = await PayrollModel.getPayroll()
    const users = await UserModel.getAllUsersList()

    console.log(salaries)

    res.render('pages/payroll', { salaries, users })
  },
  addPayroll: async (req, res) => {
    console.log(req.body)

    const { userId, amount } = req.body
    const isAddPayroll = await PayrollModel.insertPayroll(userId, amount)

    if (isAddPayroll.affectedRows > 0) {
      res.redirect('/payroll')
    }
  },
  getUpdate: async (req, res) => {
    const { pDetails, pId } = req.body
    const isUpdate = await PayrollModel.updatePayroll(pDetails, pId)

    if (isUpdate.affectedRows) {
      res.redirect('/payroll')
    }
  },
  getDelete: async (req, res) => {
    const userId = Number(req.params.id)

    const isDelete = await PayrollModel.getDelete(userId)
    if (isDelete.errno) {
      res.send('Error')
    } else {
      res.redirect('/payroll')
    }
  },
}

module.exports = Payroll
