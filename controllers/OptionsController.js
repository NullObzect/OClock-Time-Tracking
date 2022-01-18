const OptionsModel = require('../models/OptionsModel')
const userModel = require('../models/UserModel')

const OptionsController = {

  getOptionsList: async (req, res) => {
    // const optionList = await OptionsModel.options()
    res.render('pages/options')
  },
  getProjects: async (req, res) => {
    try {
      const projects = await OptionsModel.getProjects()
      res.render('pages/projects', { projects })
    } catch (error) {
      console.log(error)
    }
  },
  createProject: async (req, res) => {
    const { name, details } = req.body
    try {
      await OptionsModel.createProject(name, details)
      req.flash('success', 'Project Create Successfully')
      res.redirect('/options/projects')
    } catch (error) {
      console.log('', error);
    }
  },

  getNotice: async (req, res) => {
    const { user } = req
    if (user.user_role === 'admin') {
      const users = await userModel.getAllUsersList()
      const notices = await OptionsModel.getAllNotice()
      res.render('pages/notice', { users, notices, user })
    } else {
      const notices = await OptionsModel.userNotice(user.id)
      res.render('pages/notice', { notices, user })
    }
  },
  sendNotice: async (req, res) => {
    const { userId, noticeDetails } = req.body
    try {
      const result = await OptionsModel.sendNotice(userId, noticeDetails)
      console.log(result)
      res.redirect('/options/notice')
    } catch (error) {
      console.log(error)
    }
  },
  contactAdmin: async (req, res) => {
    const { userId, noticeDetails } = req.body
    const { user } = req
    const senderId = user.id
    const result = await OptionsModel.contactAdmin(userId, senderId, noticeDetails)
    res.redirect('/options/notice')
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
