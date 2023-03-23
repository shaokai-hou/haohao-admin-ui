<template>
  <div :id="id" :style="{width,height}" />
</template>

<script>
export default {
  props: {
    id: { type: String, default: 'chart' },
    width: { type: String, default: '100%' },
    height: { type: String, default: '700px' }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      const chart = this.$echarts.init(document.getElementById(this.id))
      const option = {
        title: {
          text: '用户访问来源',
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      chart.setOption(option)
    }
  }
}
</script>

<style scoped>

</style>
