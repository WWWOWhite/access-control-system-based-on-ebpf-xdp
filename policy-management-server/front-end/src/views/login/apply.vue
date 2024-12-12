<template>
  <div>
    <el-drawer
      class="info-drawer"
      title="正在为您申请用户资质..."
      :before-close="handleDrawerClose"
      :visible.sync="drawerVisible"
      direction="rtl"
      custom-class="info-drawer"
    >
      <div class="info-drawer__content">
        <el-form :model="editedUser" label-position="left">
          <el-form-item label="用户名" :label-width="formLabelWidth" required>
            <el-input v-model="editedUser.user_name" placeholder="请输入您想使用的用户名..." />
          </el-form-item>
          <el-form-item label="用户密码" :label-width="formLabelWidth" required>
            <el-input v-model="editedUser.user_pwd" placeholder="请输入您的密码..." show-password />
          </el-form-item>
          <el-form-item label="重复密码" :label-width="formLabelWidth" required>
            <el-input v-model="editedUser.user_pwd_repeat" placeholder="请再次输入您的密码..." show-password />
          </el-form-item>
          <!-- <el-form-item label="所属组织" :label-width="formLabelWidth" required>
            <el-input v-model="editedUser.user_role" placeholder="请再次输入您所在的公司或组织..." />
          </el-form-item> -->
          <el-form-item label="用户邮箱" :label-width="formLabelWidth">
            <el-input v-model="editedUser.user_email" placeholder="请输入您想使用的邮箱..." />
          </el-form-item>
          <el-form-item label="用户手机号" :label-width="formLabelWidth">
            <el-input v-model="editedUser.user_phone" placeholder="请输入您的手机号..." />
          </el-form-item>
        </el-form>
        <div class="info-drawer__footer">
          <el-button @click="handleDrawerClose">取 消</el-button>
          <el-button
            type="primary"
            :loading="drawerLoading"
            @click="handleDrawerSubmit"
          >
            {{ drawerLoading ? '提交中 ...' : '提 交' }}
          </el-button>
        </div>
      </div></el-drawer>
  </div>
</template>

<script>
import { userApply } from '@/api/user'

export default {
  name: 'Apply',
  data() {
    return {
      formLabelWidth: '100px',
      drawerLoading: false,
      drawerVisible: false,
      drawerTitle: '',
      editedUser: {}
    }
  },
  methods: {
    handleApply() {
      this.editedUser = {}
      this.drawerVisible = true
    },
    drawerReset() {
      this.drawerLoading = false
      this.drawerTitle = ''
      clearTimeout(this.drawerTimer)
      this.drawerVisible = false
    },
    handleDrawerClose(done) {
      this.$confirm('', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        message:
        `<div style="white-space: pre-wrap">确认关闭表单吗？<br><span style="color: red;">注意：</span>此操作将放弃当前所有更改！</div>`,
        dangerouslyUseHTMLString: true
      })
        .then(_ => {
          this.drawerReset()
          done()
        })
        .catch(_ => {})
    },
    handleDrawerSubmit() {
      if (this.drawerLoading) {
        return
      }
      this.$confirm('确定要提交表单吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.drawerLoading = true
          this.drawerTimer = setTimeout(() => {
            // eslint-disable-next-line no-unused-vars
            const { user_pwd_repeat, ...updateForm } = this.editedUser
            if (user_pwd_repeat !== this.editedUser.user_pwd) {
              return
            }
            userApply(updateForm)
              .then(response => {
                this.$message.success('用户资质申请成功！')
                setTimeout(() => {
                  this.drawerReset()
                }, 200)
              })
              .catch(() => {
                this.$message.error('用户资质申请失败，请稍后再试！')
                this.drawerReset()
              })
          }, 1000)
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.info-drawer__content {
    padding: 20px;
    height: 90%;
    overflow-y: auto;
  }

  .info-drawer__footer {
    padding: 20px;
    display: flex;
    justify-content: space-between, flex-end;
  }

  .info-drawer__footer .el-button:first-child {
    margin-left: auto;
    margin-right: 2%;
  }
</style>
