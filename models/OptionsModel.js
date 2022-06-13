const dbConnect = require('../config/database')

const OptionsModel = {
  options: async () => {
    const optionsSql = 'SELECT * FROM `options`'
    const [rows] = await dbConnect.promise().execute(optionsSql)
    return rows
  },
  getProjects: async () => {
    const getProjectSql = "SELECT id, project_name, project_details, DATE_FORMAT(create_at, '%d/%m/%Y') AS date FROM `projects`"
    const [rows] = await dbConnect.promise().execute(getProjectSql)
    return rows
  },
  createProject: async (projectName, projectDetails) => {
    const insertProjectSql = 'INSERT INTO `projects`(`project_name`, `project_details`) VALUES (?,?)'
    const values = [projectName, projectDetails]
    const [rows] = await dbConnect.promise().execute(insertProjectSql, values)
    return rows
  },
  updateOptionValue: async (optionValue, optionId) => {
    const query = `UPDATE options SET option_value = '${optionValue}' WHERE id = ${optionId}`
    const [rows] = await dbConnect.promise().execute(query)
    return rows
  },
  updateProjectValue: async (projectName, projectDetails, projectId) => {
    console.log('hellow')
    console.log(projectName, projectDetails, projectId);
    const query = `UPDATE projects SET project_name = '${projectName}', project_details = '${projectDetails}' WHERE id = ${projectId}`;
    const [rows] = await dbConnect.promise().execute(query)
    return rows.affectedRows;
  },

  deleteProject: async (projectId) => {
    console.log('from model', projectId);

    const query = `DELETE FROM projects WHERE id = ${projectId}`
    const [rows] = await dbConnect.promise().execute(query)
    return rows.affectedRows
  },
  getOffDaysValue: async () => {
    const query = 'SELECT option_value AS offDayValues FROM options WHERE option_title = \'off-day\''
    const [rows] = await dbConnect.promise().execute(query)
    return rows
  },
  getTotalLeaveDay: async () => {
    const query = 'SELECT option_value AS totalLeaveDay FROM options WHERE option_title = \'leave-limit\''
    const [rows] = await dbConnect.promise().execute(query)
    return rows
  },

}

module.exports = OptionsModel
