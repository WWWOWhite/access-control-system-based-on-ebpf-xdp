const Mock = require('mockjs')

const MODULE_BASE_URL = '/entitymanage'

const data = Mock.mock({
  'items|100': [{
    entity_index: '@string("lower", 8)',
    'entity_pid|1-32768': 0,
    user_id: '@string("lower", 8)',
    software_id: '@string("lower", 8)',
    node_id: '@string("lower", 8)',
    'is_alive|1': ['运行中', '未运行'],
    create_time: '@datetime',
    update_time: '@datetime'
  }]
})

module.exports = [
  {
    url: `${MODULE_BASE_URL}/entity-query-all`,
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
