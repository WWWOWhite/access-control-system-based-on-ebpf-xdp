<template>
  <div class="app-container">
    <el-form ref="softwareForm" :model="formData" label-width="120px">
      <!-- 第一行 -->
      <el-form-item>
        <el-row>
          <el-col :span="11">
            <span class="form-label">软件名称：</span>
            <el-input v-model="formData.rsoftware_name" placeholder="软件名称" style="width: 200px;" />
          </el-col>
          <el-col :span="11" :offset="1">
            <span class="form-label">软件版本号：</span>
            <el-input v-model="formData.rsoftware_version" placeholder="软件版本号" style="width: 200px;" />
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 第二行 -->
      <el-form-item>
        <el-row>
          <el-col :span="11">
            <span class="form-label">软件描述：</span>
            <el-input v-model="formData.rsoftware_desc" placeholder="软件描述" style="width: 200px;" />
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 表格 -->
      <el-form-item label="部署信息">
        <el-table :data="formData.location_data" style="width: 100%">
        <!--
          <el-table-column label="部署节点">
            <template slot-scope="scope">
               <el-select v-model="scope.row.node" placeholder="请选择" style="width: 100%;" class="form-select">
               <el-option label="节点1" value="节点1" />
                <el-option label="节点2" value="节点2" />
                <el-option label="节点3" value="节点3" /> 
                <el-input v-model="scope.row.node_ip" placeholder="部署节点" />
              </el-select> 
            </template>
          </el-table-column>
        --> 
          <el-table-column label="部署实体">
            <template slot-scope="scope">
              <el-input v-model="scope.row.entity_ip" placeholder="部署实体IP" style="width: 400px;" />
            </template>
          </el-table-column>
          <template slot="append">
            <el-button type="primary" icon="el-icon-plus" @click="addRow" />
            <el-button type="danger" icon="el-icon-minus" @click="removeRow" />
          </template>
        </el-table>
        <el-form-item style="display: flex; justify-content: center; margin-top: 20px;">
          <el-button type="primary" @click="handleSoftwareRegister">提交</el-button>
          <el-button @click="cancelForm">取消</el-button>
        </el-form-item>
      </el-form-item>

      <!-- 注册成功弹窗 -->
      <!-- <el-dialog :visible.sync="successDialogVisible" title="注册成功" @close="successDialogVisible = false">
        <p>软件名称: {{ formData.softwareName }}</p>
        <p>软件版本号: {{ formData.softwareVersion }}</p>
        <p>部署信息:</p>
        <ul>
          <li v-for="(item, index) in formData.deploymentEntities" :key="index">
            <p>部署节点: {{ item.node }}</p>
            <p>部署实体: {{ item.entity }}</p>
          </li>
        </ul>
      </el-dialog> -->
    </el-form>
  </div>
</template>

<script>
import { softwareRegister } from '@/api/software'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      formData: {
        rsoftware_name: '',
        rsoftware_version: '',
        rsoftware_desc: '',
        user_id: '',
        location_data: [{ node_ip: '', entity_ip: '' }]
      },
      successDialogVisible: false
    }
  },
  methods: {
    addRow() {
      this.formData.location_data.push({ node_ip: '', entity_ip: '' })
    },
    removeRow() {
      if (this.formData.location_data.length > 1) {
        this.formData.location_data.pop()
      }
    },
    // submitForm() {
    //   // 提交表单逻辑在此处
    //   // 提交成功后，显示成功对话框
    //   this.successDialogVisible = true
    // },
    cancelForm() {
      // 取消表单逻辑在此处
      this.$refs['softwareForm'].resetFields()
    },
    handleSoftwareRegister() {
      const user_id = getToken()
      if (user_id === '') {
        this.$message.error('用户id获取失败！')
        return
      }
      this.formData.user_id = user_id
      softwareRegister(this.formData)
        .then(response => {
          if (response.status === 'success') {
            this.$message.success(`软件${this.formData.rsoftware_name}的注册成功！`)
            // 后端计算软件哈希并存入数据库SoftwareTable
          } else {
            this.$message.error('软件注册失败！')
          }
        })
        .catch(() => {
          this.$message.error('软件注册失败，请稍后再试！')
        })
    }
  }
}
</script>

<style scoped>
.softwareForm {

}

.form-label {
  font-weight: 500;
}

.form-select {
  width: 100%;
}

.button-row {
  margin-top: 20px;
}

.button-col {
  margin-right: 20px;
}
</style>
