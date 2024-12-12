<template>
  <div>
    <div class="app-container">
      <div class="select-software" />
      <span class="demonstration">软 件 名 称</span>
      <el-autocomplete
        v-model="state"
        :fetch-suggestions="querySearchAsync"
        placeholder="搜索"
        class="software-search"
        @select="handleSelect"
      >
        <i
          slot="suffix"
          class="el-icon-search el-input__icon"
        />
      </el-autocomplete>

      <div class="select-location">
        <span class="demonstration">部 署 位 置</span>
        <el-cascader
          :options="options"
          :props="props"
          clearable
          class="location-cascader"
        />
      </div>

      <div class="start-distribution">
        <el-button icon="el-icon-sort" type="primary" @click="handleDistribute">下 发</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      softwareList: [],
      state: '',
      timeout: null,
      props: { multiple: true },
      options: [{
        value: 1,
        label: '华东',
        children: [{
          value: 2,
          label: '上海',
          children: [
            { value: 3, label: '普陀' },
            { value: 4, label: '黄埔' },
            { value: 5, label: '徐汇' }
          ]
        }, {
          value: 7,
          label: '江苏',
          children: [
            { value: 8, label: '南京' },
            { value: 9, label: '苏州' },
            { value: 10, label: '无锡' }
          ]
        }, {
          value: 12,
          label: '浙江',
          children: [
            { value: 13, label: '杭州' },
            { value: 14, label: '宁波' },
            { value: 15, label: '嘉兴' }
          ]
        }]
      }, {
        value: 17,
        label: '西北',
        children: [{
          value: 18,
          label: '陕西',
          children: [
            { value: 19, label: '西安' },
            { value: 20, label: '延安' }
          ]
        }, {
          value: 21,
          label: '新疆维吾尔族自治区',
          children: [
            { value: 22, label: '乌鲁木齐' },
            { value: 23, label: '克拉玛依' }
          ]
        }]
      }]
    }
  },
  created() {

  },
  mounted() {
    this.softwareList = this.loadAll()
  },
  methods: {
    loadAll() {
      return [
        { 'value': 'mock软件1', 'software_id': 'mock_id1' },
        { 'value': 'mock软件2', 'software_id': 'mock_id2' },
        { 'value': 'mock软件3', 'software_id': 'mock_id3' }
      ]
    },
    querySearchAsync(queryString, cb) {
      var softwareList = this.softwareList
      var results = queryString ? softwareList.filter(this.createStateFilter(queryString)) : softwareList

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 1000 * Math.random())
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      console.log(item)
    },
    handleDistribute() {
      // TO-DO 给定的软件对应ID，对n个实体，给后端进程PID和IP地址，按照数目依次发n次
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  font-size: 14px;
  color: #606266;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
}

.select-location {
  margin-top: 1%;
  margin-bottom: 1%;
}

.software-search {
  margin-left: 2%;
}

.location-cascader {
  margin-left: 2%;
}
</style>
