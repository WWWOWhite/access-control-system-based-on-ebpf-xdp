const Mock = require('mockjs')

const MODULE_BASE_URL = '/softwaremanage'

const data = Mock.mock({
  'items|100': [{
    software_id: '@string("lower", 8)',
    software_version: '@integer(1, 9).@integer(0, 9).@integer(0, 9)',
    user_id: '@string("lower", 8)',
    software_name: '@ctitle(4, 6)',
    software_hash: '@string("lower", 32)',
    'software_desc|1': '@cparagraph(20, 50)',
    create_time: '@datetime',
    update_time: '@datetime'
  }]
})

module.exports = [
  {
    url: `${MODULE_BASE_URL}/software-query-all`,
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
