/* eslint-disable max-len */
const { pageNumbers } = require('./pagination')

module.exports = function paginationPageCount(req, data) {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || process.env.PAGINATION_ROW
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const sliceData = data.slice(startIndex, endIndex)
  const pageLength = data.length / limit
  const numberOfPage = Number.isInteger(pageLength) ? Math.floor(pageLength) : Math.floor(pageLength) + 1
  const pageNumber = pageNumbers(numberOfPage, 2, page)
  const result = [sliceData, numberOfPage, page, pageNumber, limit]
  return result
}
