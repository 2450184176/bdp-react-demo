import React from 'react';

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';

// const colorList = ['rgba(255,170,0,1)', 'rgba(32,255,205,1)', 'rgba(255,108,0,1)', 'rgba(2,192,239,1'];

class BdpCharts extends React.Component {
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
    await this.setState({ myCharts });
    // console.log(myCharts);
  }
  componentDidUpdate() {
    // console.log(this.props);
    if (this.props.type && this.props.type === 'pie') {
      this.drawPie();
    } else if (this.props.type && this.props.type === 'bar') {
      this.drawBar();
    } else {
      this.drawLine();
    }
  }
  drawBar(){
    const { echartsData, type ,color,title} = this.props;
    const option = {
      title:{
        text: title ? title:'',
        top:'0',
        left:'12%',
        textStyle:{
          color:'#999',
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
            color:'#A0B1CD'
          },
        },
        data: echartsData.xData,
      }],
      yAxis: [{
        type: 'value',
        scale: true,
        splitLine: {
          show: this.props.type === 'bar'?false : true,
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
    const { echartsData, type ,color,title} = this.props;
    const option = {
      title:{
        text: title ? title:'',
        top:'0',
        left:'12%',
        textStyle:{
          color:'#999',
          fontSize: 16,
        }
      },
      tooltip: {
        trigger: this.props.type === 'bar' ? 'item' : 'axis',
        // trigger: "item",
        textStyle: {
          fontSize: 14
        },
        // formatter: this.props.type === 'bar' ? '{b0}:{c0}' : '{b0}: {c0}<br />{b1}: {c1}',
      },
      legend: {
        show: this.props.type === 'bar'?false : true,
        textStyle:{
          color: color ? color:'#fff'
        },
        top: 'top',
        data: echartsData.legend,
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
            // color: color ? color : '#fff',
            color:echartsData.xData.length === 0 || echartsData.xData[0].length === 0 ? '#fff':'#A0B1CD'
            // opacity: 0,
          },
        },
        data: echartsData.xData,
      }],
      yAxis: [
        {
          type: 'value',
          name: echartsData.double === true?'超时件量':'',
          scale: true,
          splitLine: {
            show: this.props.type === 'bar'?false : true,
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
              color: echartsData.xData.length === 0 || echartsData.xData[0].length === 0 ? '#fff':'#A0B1CD'
            },
          },
          axisLabel: {
            show: true,
            interval: 'auto',
            formatter: echartsData.percentage === true ?`{value} %` :`{value}`
          },
        },
      ],
      series: [],
    };
    if(echartsData.double === true){
      option.yAxis.push(
        {
          type: 'value',
          name: '平均时效(H)',
          scale: true,
          splitLine: {
            show: this.props.type === 'bar'?false : true,
            lineStyle: {
              type: 'dotted',
              color: '#fff',
            },
          },
          axisTick: {
            show: true,
            lineStyle:{
              type: 'solid',
              color: '#A0B1CD',
            }
          },
          axisLine: {
            lineStyle: {
              color: echartsData.xData.length === 0 || echartsData.xData[0].length === 0 ? '#fff':'#A0B1CD'
            },
          },
          // min: 0,
          // max: 100,
          // interval: 'auto',
          axisLabel: {
            show: true,
            interval: 'auto',
            formatter: `{value}`
          },
        }
      );
    };
    if (this.props.reverse  && this.props.type === 'bar') {
      option.xAxis[0].type = "value";
      const data = option.xAxis[0].data
      option.yAxis[0].type = "category";
      option.yAxis[0].data = data;
      delete option.xAxis[0].data;
    }
    echartsData.yData.forEach((v, i) => {
      const obj = {
        name: echartsData.legend[i],
        type: 'line',
        symbol: 'emptyCircle',
        showAllSymbol: true,
        type,
        showSymbol: true,
        barWidth: (function barWidth() {
          return `${50 / echartsData.legend.length}%`;
        }()),
        symbolSize:5,
        label: {
          normal: {
            show: true,
            position: this.props.type === 'bar' ? 'insideRight' : 'top',
            color: 'transparent',
          },
        },
        color: i ===0 ?'#74D691':'#3BA1FF',
        yAxisIndex: echartsData.double === true  ? i : 0,
        data: v,
      };
      option.series.push(obj);
      // this.option.showLoading();
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
        radius: [0, '85%'],
        center: ['50%', '50%'],
        roseType: 'radius',
        color: ['#FF6D00', '#FF6E72', '#FFC751', '#16C2AF', '#6546B1', '#214E9F', '#6FE621', '4FCCFF', '#EF463C', '#785549'],
        data: [10,50,90,80,70,30],
        label: {
          normal: {
            textStyle: {
              fontSize: 14,
            },
            formatter(param) {
              return `${param.name}:\n${Math.round(param.percent)}%`;
            },
          },
        },
        labelLine: {
          normal: {
            smooth: true,
            lineStyle: {
              width: 2,
            },
          },
        },
        itemStyle: {
          normal: {
            shadowBlur: 50,
            shadowColor: 'rgba(0, 0, 0, 0.4)',
          },
        },
      },
      {
        type: 'line',
        radius: [0, '85%'],
        center: ['50%', '50%'],
        roseType: 'radius',
        color: ['#FF6D00', '#FF6E72', '#FFC751', '#16C2AF', '#6546B1', '#214E9F', '#6FE621', '4FCCFF', '#EF463C', '#785549'],
        data: [100,50,20,50,60,80],
        label: {
          normal: {
            textStyle: {
              fontSize: 14,
            },
            formatter(param) {
              return `${param.name}:\n${Math.round(param.percent)}%`;
            },
          },
        },
        labelLine: {
          normal: {
            smooth: true,
            lineStyle: {
              width: 2,
            },
          },
        },
        itemStyle: {
          normal: {
            shadowBlur: 50,
            shadowColor: 'rgba(0, 0, 0, 0.4)',
          },
        },
      }
    ]
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        top: 'bottom',
        data: echartsData.legend,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        containLabel: true,
      },
      series,
    };
    this.state.myCharts.setOption(option, true);
    // return option;
  }
  render() {
    return (
      <div>
        <div ref="charts" style={{ height: this.props.height ? this.props.height : '350px',width:"85%" }}></div>
      </div>
    );
  }
}

export default BdpCharts;
