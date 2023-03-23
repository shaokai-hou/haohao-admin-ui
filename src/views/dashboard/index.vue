<template>
  <BaseContainer>
    <el-row :gutter="20" style="margin-bottom: 30px">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>访问量</span>
            <el-button style="float: right; padding: 3px 0;width: 25px" type="primary">年</el-button>
          </div>
          <div>
            1
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>访问人数</span>
            <el-button style="float: right; padding: 3px 0;width: 25px" type="success">月</el-button>
          </div>
          <div>
            1
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>注册人数</span>
            <el-button style="float: right; padding: 3px 0;width: 25px" type="warning">周</el-button>
          </div>
          <div>
            1
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>登录人数</span>
            <el-button style="float: right; padding: 3px 0;width: 25px" type="danger">日</el-button>
          </div>
          <div>
            1
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 30px">
      <el-card class="box-card">
        <el-tabs v-model="activeName">
          <el-tab-pane label="折线" name="first" style="height: 400px;overflow-y: auto">
            <echartsLine :id="'id4'" :width="'100%'" :height="'100%'"/>
          </el-tab-pane>
          <el-tab-pane label="图表" name="second" style="height: 400px;overflow-y: auto">
            <span>表格</span>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>饼图</span>
          </div>
          <div style="height: 400px;">
            <echartsPie id="id1" height="400px"/>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>条形图</span>
          </div>
          <div>
            <echartsBar id="id2" height="400px"/>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>雷达图</span>
          </div>
          <div>
            <echartsRadar id="id3" height="400px"/>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </BaseContainer>
</template>

<script>
import { mapGetters } from 'vuex'
import echartsBar from '@/views/echarts/bar'
import echartsPie from '@/views/echarts/pie'
import echartsLine from '@/views/echarts/line'
import echartsRadar from '@/views/echarts/radar'

export default {
  name: 'Dashboard',
  components: { echartsBar, echartsPie, echartsLine, echartsRadar },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
