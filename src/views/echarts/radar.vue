<template>
  <div :id="id" :style="{width,height}"/>
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
          text: ''
        },
        legend: {
          data: ['Allocated Budget', 'Actual Spending']
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: 'Sales', max: 6500 },
            { name: 'Administration', max: 16000 },
            { name: 'Information Technology', max: 30000 },
            { name: 'Customer Support', max: 38000 },
            { name: 'Development', max: 52000 },
            { name: 'Marketing', max: 25000 }
          ]
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [4200, 8000, 20000, 35000, 50000, 18000],
                name: 'Allocated Budget'
              }
            ]
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
