const Mock = require('mockjs')

const MODULE_BASE_URL = '/usermanage'

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const data = Mock.mock({
  'items|100': [{
    user_id: '@string("lower", 8)',
    'user_name|1': [
      '@cname',
      '@first @last'
    ],
    'user_role|1': [
      'A公司开发人员',
      'B公司开发人员',
      'C公司开发人员'
    ],
    'user_email': function() {
      const username = this.user_name.split(' ').join('_').toLowerCase()
      return `${username}@example.com`
    },
    'user_phone': /^1[3456789]\d{9}$/,
    create_time: '@datetime',
    update_time: '@datetime'
  }]
})

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://upload.shejihz.com/2019/03/fe2ec2e7ed7f6795b46b793d93c99b7e.jpg',
    name: '管理员'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://upload.shejihz.com/2019/03/fe2ec2e7ed7f6795b46b793d93c99b7e.jpg',
    name: '软件开发人员'
  }
}

module.exports = [
  {
    url: `${MODULE_BASE_URL}/user-query-all`,
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
  },
  {
    url: `${MODULE_BASE_URL}/registered-user-query-all`,
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
  },

  // user login
  {
    url: `${MODULE_BASE_URL}/user-login`,
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: `${MODULE_BASE_URL}/user-info\.*`,
    type: 'post',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: `${MODULE_BASE_URL}/user-logout`,
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
