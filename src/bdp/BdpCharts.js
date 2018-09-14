import React from 'react';

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';


class BdpCharts extends React.PureComponent {
  constructor(props) {
    super(props);
    this.drawLine = this.drawLine.bind(this);
    this.drawPie = this.drawPie.bind(this);
    this.state = {
      myCharts: '',
    };
  }
  /* eslint-disable react/no-did-mount-set-state */
  /* eslint-disable */
  async componentDidMount() {
    const myCharts = echarts.init(this.refs.charts);
    const { change } = this.props;
    // console.log(change);
    await this.setState({ myCharts });
    if(change) {
      myCharts.on('click',(params)=>{
        // console.log(params)
        change(params);
      })
    }
  }
  componentDidUpdate() {
    if (this.props.type && this.props.type === 'pie') {
      this.drawPie();
      // console.log('hello')
    } else if (this.props.type && this.props.type === 'bar') {
      this.drawBar();
    } else {
      this.drawLine();
    }
  }
  drawBar() {
    const { echartsData, type, color, title } = this.props;
    const option = {
      title: {
        text: title ? title : '',
        top: '0',
        left: '12%',
        textStyle: {
          color: '#999',
          fontSize: 16,
        }
      },
      tooltip: {
        trigger: this.props.type === 'bar' ? 'axis' : 'axis',
        // trigger: "item",
        textStyle: {
          fontSize: 14
        },
        // formatter: this.props.type === 'bar' ? '{b0}:{c0}' : '{b0}: {c0}<br />{b1}: {c1}',
      },
      legend: {
        show: true,
        // textStyle:{
        //   color: color ? color:'#fff'
        // },
        top: 'top',
        data: echartsData.legend,
        // data:['最新成交价', '预购队列']
      },
      grid: {
        top: "15%",
        left: '4%',
        right: '4%',
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [{
        type: 'category',
        boundrayGap: true,
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#A0B1CD'
          },
        },
        data: echartsData.xData,
      }],
      yAxis: [{
        type: 'value',
        scale: true,
        splitLine: {
          show: this.props.type === 'bar' ? false : true,
          lineStyle: {
            type: 'dotted',
            color: '#A0B1CD',
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#A0B1CD'
          },
        },
      }],
      series: [
        {
          name: echartsData.legend[0],
          type: 'bar',
          color: ['#3BA1FF'],
          data: echartsData.yData[0],
        },
        {
          name: echartsData.legend[1],
          type: 'line',
          color: ['#74D691'],
          data: echartsData.yData[1],
        },
      ],
      barWidth: (function barWidth() {
        return `${50 / echartsData.legend.length}%`;
      }()),
    };
    this.state.myCharts.setOption(option, true);
  }
  drawLine() {
    const { echartsData, type, color, title } = this.props;
    const option = {
      title: {
        text: title ? title : '',
        top: '0',
        left: '12%',
        textStyle: {
          color: '#999',
          fontSize: 16,
        }
      },
      tooltip: {
        trigger: this.props.type === 'bar' ? 'item' : 'axis',
        textStyle: {
          fontSize: 14
        },
      },
      legend: {
        show:false,
        // textStyle: {
        //   color: color ? color : '#fff'
        // },
        // top: 'top',
        // data: echartsData.legend,
      },
      grid: {
        top: "5%",
        left: '4%',
        right: '4%',
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        data: echartsData.xData,
      }],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [],
    };
    echartsData.yData.forEach((v, i) => {
      const obj = {
        name: echartsData.legend[i],
        type: 'line',
        smooth:true,
        barWidth: (function barWidth() {
          return `${50 / echartsData.legend.length}%`;
        }()),
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(189, 164, 140, 0.3)'
            }, {
              offset: 0.8,
              color: 'rgba(189, 164, 140, 0.8)'
            }], false),
            shadowColor: 'rgba(228, 139, 76, 0.1)',
            shadowBlur: 10
          }
        },
        symbolSize: 5,
        color: '#BDA48C',
        data: v,
      };
      option.series.push(obj);
    });
    this.state.myCharts.setOption(option, true);
  }
  drawPie() {
    const { echartsData } = this.props;
    const pieData = [];
    echartsData.yData.forEach((v, i) => {
      let value = 0;
      v.forEach((vv) => {
        value += vv;
      });
      pieData.push({
        name: echartsData.legend[i],
        value,
      });
    });
    const series = [
      {
        type: 'pie',
        name:'接待量',
        center:['70%','50%'],
        radius: ['45%', '80%'],
        color: ['#BDA48C', '#AC7667','#9A948D'],
        label: {
          normal: {
            show: false,
            textStyle: {
              fontSize: 14,
            },
            formatter(param) {
              return `${param.name}:\n${Math.round(param.percent)}%`;
            },
          },
        },
        data: pieData
      }
    ]
    const option = {
      // tooltip: {
      //   trigger: 'item',
      //   formatter: '{a} <br/>{b} : {c} ({d}%)',
      // },
      legend: {
        orient: 'vertical',
        // top: 'bottom',
        x:'left',
        y:'center',
        data: echartsData.legend,
      },
      series,
    };
    this.state.myCharts.setOption(option, true);
  }
  render() {
    const {col} = this.props;
    return (
      <div>
        <div ref="charts" className={col ? 'charts col':'charts'}></div>
      </div>
    );
  }
}

export default BdpCharts;
