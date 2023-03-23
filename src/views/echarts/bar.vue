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
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar'
        }]
      }
      chart.setOption(option)
    }
  }
}
</script>

<style scoped>

</style>
