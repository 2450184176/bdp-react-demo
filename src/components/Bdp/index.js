import React, { Component } from 'react';
import { Layout, Tabs, Icon, Modal, Row, Col } from 'antd';
import { connect } from 'dva';
// import LeftMenu from '../LeltMenu';
import styles from '../index.less';
import BdpCharts from '../BdpCharts';
import BdpList from '../BdpList';

const { TabPane } = Tabs;

// const operationTabList = [{
//   key: 'base',
//   tab: '基础数据',
// }, {
//   key: 'source',
//   tab: '资源数据',
// }, {
//   key: 'other',
//   tab: '其他数据',
// }];
const baseKey = {
  collection: '收件',
  delivery: '派件',
  rate: '环比',
};
function formateData(key, list) {
  const obj = {
    legend: [],
    xData: [],
    yData: [],
  };
  obj.legend = Object.values(key);
  list.forEach((v) => {
    obj.xData.push(v.time);
    Object.keys(key).forEach((y, yi) => {
      if (!Array.isArray(obj.yData[yi])) obj.yData[yi] = [];
      obj.yData[yi].push(v[y]);
    });
  });
  return obj;
}
@connect(({ bdp, loading }) => ({
  bdp,
  loading: loading.effects['bdp/getList'],
}))
export default class BDPLayers extends Component {
  // constructor(props) {
  //   super(props);
  // this.handleShow = this.handleShow.bind(this);
  state = {
    visible: false,
    collection: 'collection',
    type: 'line',
    show: true,
    echartsData: {
      legend: ['event1', 'event2', 'event3'],
      xData: ['2017-09-27', '2017-09-28', '2017-09-29', '2017-09-30'],
      yData: [
        [12759, 12859, 12959, 13059],
        [22759, 22859, 22959, 23059],
        [32759, 32859, 32959, 33059],
      ],
    },
    echartsDymic: {
      legend: [],
      xData: [],
      yData: [
      ],
    },
    lists: [
      { name: 1 },
      { name: 2 },
      { name: 3 },
      { name: 4 },
      { name: 5 },
      { name: 6 },
      { name: 7 },
    ],
    qData: [],
    columns: [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      // render: text => <a href="#">{text}</a>,
    }, {
      title: 'number',
      dataIndex: 'number',
      key: 'number',
      render: (text, recode) => (
        recode.number
      ),
    }, {
      title: 'percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (text, recode) => (
        <span style={{ color: recode.percentage > 0 ? 'white' : 'red' }}>{`${recode.percentage}%`}</span>
      ),
    }],
  };
  // permission to check
  // checkPermissionItem = (authority, ItemDom) => {
  //   if (this.props.Authorized && this.props.Authorized.check) {
  //     const { check } = this.props.Authorized;
  //     return check(
  //       authority,
  //       ItemDom
  //     );
  //   }
  //   return ItemDom;
  // }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'bdp/getList',
    });
    dispatch({
      type: 'bdp/getBase',
      payload: {
        type: 'line',
      },
    });
  }
  componentWillReceiveProps() {
    const { bdp } = this.props;
    const dymic = {
      legend: ['动态数据'],
      xData: [],
      yData: [
        [],
      ],
    };
    let type = 'line';
    if (this.state.collection === 'rate') type = 'bar';
    const keyName = baseKey[this.state.collection];
    const key = {
      today: `今日${keyName}`,
      yesterday: `昨日${keyName}`,
    };
    bdp.dynamicList.forEach((v) => {
      dymic.xData.push(v.name);
      dymic.yData[0].push(v.value);
    });
    const bcd = formateData(key, bdp.baseList);
    this.setState({ echartsData: bcd, type });
    this.setState({ echartsDymic: dymic });
    this.setState({ qData: bdp.qData });
  }
  componentDidUpdate() {

    // this.setState({ echartsData: bcd });
  }
  handleShow = () => {
    this.setState({ show: !this.state.show });
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  tabsChange = (key) => {
    const { dispatch } = this.props;
    if (key === 'collection' || key === 'delivery') {
      this.setState({ collection: key });
      dispatch({
        type: 'bdp/getBase',
        payload: {
          type: key,
        },
      });
    } else {
      this.setState({ collection: key });
      dispatch({
        type: 'bdp/getBase',
        payload: {
          type: key,
        },
      });
    }
  }
  render() {
    return (
      <Layout className={`${styles.layout}`}>
        <div className={styles.top}><p>基础数据</p></div>
        <div className={`basicLayout ${this.state.show ? '' : 'display'}`}>
          <div className={styles.titleDiv}>
            <div className="left">
              <div className="titleDiv">
                <div className="bdpDiv">
                  <Icon type="area-chart" />
                  <span>业务数据 趋势</span>
                </div>
              </div>
            </div>
            <div className="right">
              <button className="bdpDiv" onClick={this.showModal}><Icon type="global" />华东大区<Icon type="right" /></button>
            </div>
          </div>
          <Tabs className="cTabs" onChange={this.tabsChange}>
            <TabPane tab="收件" key="collection" />
            <TabPane tab="派件" key="delivery" />
            <TabPane tab="环比" key="rate" />
          </Tabs>
          <BdpCharts echartsData={this.state.echartsData} type={this.state.type} reverse />
          <div className={styles.titleDiv}>
            <div className="left">
              <div className="titleDiv">
                <div className="bdpDiv">
                  <Icon type="bar-chart" />
                  <span>业务数据 动态</span>
                </div>
              </div>
            </div>
            <div className="right">
              <button className="bdpDiv" onClick={this.showModal}><Icon type="global" />华东大区<Icon type="right" /></button>
            </div>
          </div>
          <BdpCharts echartsData={this.state.echartsDymic} type="bar" reverse />
          <div className={styles.titleDiv}>
            <div className="left">
              <div className="titleDiv">
                <div className="bdpDiv">
                  <Icon type="bars" />
                  <span>质量数据</span>
                </div>
              </div>
            </div>
            <div className="right">
              <button className="bdpDiv" onClick={this.showModal}><Icon type="global" />华东大区<Icon type="right" /></button>
            </div>
          </div>
          <BdpList data={this.state.qData} columns={this.state.columns} />
          {/* <LeftMenu /> */}
        </div>
        <div className="after" onClick={this.handleShow}><Icon type={`${this.state.show ? 'caret-left' : 'caret-right'}`} /></div>
        <Modal
          // title="Basic Modal"
          visible={this.state.visible}
          footer={false}
          onCancel={this.handleCancel}
          className={styles.bdpModal}
        >
          <Row>
            { this.state.lists.map(v => (
              <Col span={6} key={v.name}>
                <div>hello world!</div>
                <BdpCharts echartsData={this.state.echartsData} type="line" color="#999" height="calc((100vh - 53px - 48px - 42px)/2)" />
              </Col>
            ))}
          </Row>
        </Modal>
      </Layout>
    );
  }
}
