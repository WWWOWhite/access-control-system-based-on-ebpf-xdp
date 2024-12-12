const Mock = require('mockjs')

const MODULE_BASE_URL = '/softwaremanage'

const data = Mock.mock({
  'items|100': [{
    rsoftware_id: '@string("lower", 8)',
    rsoftware_version: '@integer(1, 9).@integer(0, 9).@integer(0, 9)',
    user_id: '@string("lower", 8)',
    rsoftware_name: '@ctitle(4, 6)',
    rsoftware_path: '/mock/path',
    'rsoftware_desc|1': '@cparagraph(20, 50)',
    create_time: '@datetime',
    update_time: '@datetime'
  }]
})

module.exports = [
  {
    url: `${MODULE_BASE_URL}/registered-software-query-all`,
    type: 'post',
    response: config => {
      const { page, limit } = config.body
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const items = data.items.slice(startIndex, endIndex)
      const total = data.items.length
      return {
        code: 20000,
        data: {
          total: total,
          items: items
        }
      }
    }
  }
]
