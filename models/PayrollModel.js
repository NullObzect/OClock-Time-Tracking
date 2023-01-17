const dbConnect = require('../config/database')

const PayrollModel = {

  getPayroll: async () => {
    const query = 'SELECT U.user_name name , P.amount amount , P.payroll_id payrollId FROM payroll AS P JOIN users AS U ON U.id = P.user_id'
    const [rows] = await dbConnect.promise().execute(query)
    return rows
  },
  insertPayroll: async (userId, amount) => {
    const query = 'INSERT INTO  payroll (user_id, amount) VALUES(?,?)';
    const values = [userId, amount]
    const [rows] = await dbConnect.promise().execute(query, values)
    return rows
  },
  updatePayroll: async (amount, id) => {
    const query = `UPDATE payroll SET amount = ${amount} WHERE payroll_id = ${id}`;

    const [rows] = await dbConnect.promise().execute(query)
    return rows.affectedRows;
  },
  getDelete: async (id) => {
    console.log({ id });

    const query = `DELETE FROM payroll WHERE payroll_id = ${id}`

    const [row] = await dbConnect.promise().execute(query)
    return row.affectedRows
  },
  sumPayroll: async () => {
    const query = 'SELECT SUM(amount) as sumPayroll FROM payroll'
    const [rows] = await dbConnect.promise().execute(query)
    return rows[0]
  },
}

module.exports = PayrollModel
