const OptionsModel = require('../models/OptionsModel')
const userModel = require('../models/UserModel')

const OptionsController = {

  getOptionsList: async (req, res) => {
    res.render('pages/options')
  },
  getOptionValues: async (req, res) => {
    const optionList = await OptionsModel.options()
    res.render('pages/option-values', { optionList })
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
  getUpdateOptionValues: async (req, res) => {
    try {
      console.log(req.body);

      const { optionId, optionValue } = req.body;
      console.log(optionId, optionValue);
      const isUpdate = await OptionsModel.updateOptionValue(optionValue, optionId)
      if (isUpdate.errno) {
        res.send('Error')
      } else {
        res.redirect('/options')
      }
    } catch (err) {
      console.log('====>Error form OptionsController updateOptionValues', err);
    }
  },
  getUpdateProject: async (req, res) => {
    try {
      console.log('adsfasdf', req.body);

      const { pName, pDetails, pId } = req.body
      const isUpdate = await OptionsModel.updateProjectValue(pName, pDetails, pId)
      if (isUpdate.errno) {
        res.send('Error')
      } else {
        res.redirect('/options/projects')
      }
    } catch (err) {
      console.log('====>Error form', err);
    }
  },
  getDeleteProject: async (req, res) => {
    try {
      const { pId } = req.body
      const isDelete = await OptionsModel.deleteProject(pId)
      if (isDelete.errno) {
        res.send('Error')
      } else {
        res.redirect('/options/projects')
      }
    } catch (err) {
      console.log('====>Error form', err);
    }
  },

}

module.exports = OptionsController
