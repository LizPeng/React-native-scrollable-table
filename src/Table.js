import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';

const scrollWidth = 1500
const {width, height} = Dimensions.get('window')
const AniFlat = Animated.createAnimatedComponent(FlatList)


// 定义样式
// 定义基础尺寸
const 
  trheadWidth = 110, // 表格行第一列宽
  thHeight = 40,     // 表格头部 高度
  trHeight = 36,     // 表格行高
  // 数据单元格宽度，小于三列的不滑动
  // minTDWidth = (width - trheadWidth) / 4 ,//定义td最小宽度，占满整个屏幕宽度
  // tdWidth = minTDWidth > 100 ? minTDWidth : 100,     // 表格行宽
  rightWidth =  width
const thCommonStyle={
  lineHeight: thHeight,
  fontWeight: 'bold',
  color: '#7d7d7d',
  backgroundColor: '#ebebeb',
  textAlign: 'center',
}
const tdBorderWidth = 1
const tdBorderColor = '#ddd'
const tdTextColor = '#333'
const tdBGC = '#fff'
const textClassStyle = {
  allClass : {
    color: '#0e6923',
    backgroundColor: '#f7fff0',
    fontWeight: 'bold',
  },
  classA : {
    color: '#9f824b',
    backgroundColor: '#fcf2de',
    fontWeight: 'bold',
  }
}

// 右侧数据的渲染
const RightRow = (props) => {
  const {item = [0,0,0,0,0,0,0,0,0,0], width = 100, type = 'rightItemText'} = props
  // 根据type判断style
  const finalStyle = StyleSheet.flatten([
    newStyle.rightItemText, textClassStyle[type]
  ])
  const viewFinanlStyle = StyleSheet.flatten([
    newStyle.rightItemView, {width: width}
  ])
  return (
    <View style={newStyle.rightRow}>
      {
        item.map( (d,i) => (
        <View style={viewFinanlStyle} key={i}><Text style={finalStyle}>{formatNumber(d)}</Text></View>
        ))
      }
    </View>
  )
}
const LeftRow = (props) => {
  const {item, width = 100, type = 'rightItemText'} = props
  const viewFinalStyle = StyleSheet.flatten([
    newStyle.leftItemView, {width: width}
  ])
  const finalStyle = StyleSheet.flatten([
    newStyle.leftItemText, textClassStyle[type]
  ])
  return (
    <View style={viewFinalStyle}>
      <Text style={finalStyle}>{item}</Text>
    </View>
  )
}
const formatNumber = (str) => {
  const res = str.toString().replace(/\d+/, n => {
      return n.replace(/\d(?=(\d{3})+$)/g, function ($1) {
          return $1 + ',';
      })
  })
  return res;
}
class Table extends Component {
  rowLength = this.props.columnNames.length
  trheadWidth = this.props.rowNameWidth || 110 // 表格行第一列宽
  // 数据单元格宽度Width > 100 ? minTDWidth : 100,     // 表格行宽
  rightWidth =  this.rowLength > 3 ? this.rowLength * 100  :   (width - this.trheadWidth)//
  textWidth = this.rowLength > 3 ? 100 : (width - this.trheadWidth) / this.rowLength
  constructor(props) {
    super(props);
    this.state = {
      xValue:  new Animated.Value(0),
      leftY: new Animated.Value(0),
      rightY: new Animated.Value(0),
      currentIndex: 0,
      isDescent: false,
      data: props.data //保存到state，排序使用
    }
  }
  
  componentWillReceiveProps = (nextProps) => {
    if(this.state.data !== nextProps.data){
      this.setState({
        data: nextProps.data
      })
    }
  };

  _renderDataItem = ({item, index})=>  {
    // 根据index判断类型->显示不同样式 
    // 合计、湖北小计-> allClass
    // 汽油、柴油、自有库、租赁库 -> classA
    if(index === 0 && this.props.rowClassIndex.length !== 0){
      return  <RightRow width={this.textWidth} item={item} type={'allClass'}/>
    } else if (this.props.rowClassIndex.includes(index)){
      return  <RightRow width={this.textWidth} item={item} type={'classA'}/>
    }else {
      return  <RightRow width={this.textWidth} item={item} />
    }
  }
  _keyExtractor = (item, index) => index.toString();

  _renderLeftItem = ({item, index}) => {
    // 参考_renderDataItem
    if(index === 0 && this.props.rowClassIndex.length !== 0){
      return  <LeftRow width={this.trheadWidth} item={item} type={'allClass'}/>
    } else if (this.props.rowClassIndex.includes(index)){
      return  <LeftRow width={this.trheadWidth} item={item} type={'classA'}/>
    }else {
      return  <LeftRow width={this.trheadWidth} item={item} />
    }
  }
  render() {
    // 定义动画效果
    let scrollX = this.state.xValue.interpolate({
      inputRange: [0,scrollWidth],
      outputRange: [0,scrollWidth],
    })
    let leftY = this.state.leftY.interpolate({
      inputRange: [0,1000],
      outputRange: [0,-1000],
      extrapolate: 'clamp'
    })
    let rightY = this.state.rightY.interpolate({
      inputRange: [0,1000],
      outputRange: [0,-1000],
      extrapolate: 'clamp'
    })
    const renderStyle = StyleSheet.create({
      tableRight: {
        width: this.rightWidth,
      },
      rightHead: {
        width: this.rightWidth,
        height: thHeight,
        flexDirection: 'row',
        zIndex: 10,
      },
      rightHeadView: {
        height: thHeight,
        borderRightWidth: tdBorderWidth,
        borderRightColor: tdBorderColor,
        borderTopWidth: tdBorderWidth,
        borderTopColor: tdBorderColor,
      },
      leftHead: {
        width: this.trheadWidth,
        height: thHeight,
        zIndex: 100,
        borderRightWidth: tdBorderWidth,
        borderRightColor: tdBorderColor,
        borderTopWidth: tdBorderWidth,
        borderTopColor: tdBorderColor,
      },
    })
    // 定义左右两侧标题
    LeftTitle = () => (
      <View style={renderStyle.leftHead}><Text style={{...thCommonStyle}}> {this.props.leftTitleName}</Text></View>
    )
    RightTitle = () => (
      <View style={renderStyle.rightHead}>
        {
          this.props.columnNames.map( (item, index) => 
            <View style={[renderStyle.rightHeadView, {width: this.textWidth}]} key={index}>
              <Text style={{...thCommonStyle}}>{item}</Text>
            </View>
        )
      }
      </View>
    )
    return (
      <View style={{ flexDirection: 'row'}}>
        <View style={renderStyle.tableLeft}>
          {LeftTitle()}
          <View style={{flex:1}}>
            <Animated.ScrollView
              contentContainerStyle={{minHeight: 400}}
              showsVerticalScrollIndicator={false}              
              scrollEventThrottle={1}
              bounces={false}
              scrollEnabled={false}
            >
              <AniFlat
                style={{transform: [{translateY: leftY}]}}                  
                showsVerticalScrollIndicator={false}
                bounces={false}
                data={this.props.rowNames}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderLeftItem}
              />
            </Animated.ScrollView>                
          </View>
        </View>
        <Animated.ScrollView 
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: this.state.xValue}}}],
            {useNativeDriver: true}
          )}
          scrollEventThrottle={16}
          bounces={false}
          >
          <View style={renderStyle.tableRight}>
            {RightTitle()}
            {/* 右侧list */}
              <Animated.ScrollView
                contentContainerStyle={{minHeight: 400}}
                showsVerticalScrollIndicator={false}              
                onScroll={Animated.event(
                  [{nativeEvent: {contentOffset: {y: this.state.leftY}}}],
                  {useNativeDriver: true}
                )}
                scrollEventThrottle={16}
                bounces={false} 
                scrollEnabled={this.state.scrollEnable}
              >
                <AniFlat
                  bounces={false}
                  data={this.state.data}
                  keyExtractor={this._keyExtractor}
                  renderItem={this._renderDataItem}
                  />
              </Animated.ScrollView>
          </View>
        </Animated.ScrollView>
      </View>
    );
  }
}

const newStyle = StyleSheet.create({
  titleText: {
    ...thCommonStyle, 
  },
  rightRow: {
    flex:1,
    flexDirection: 'row',
  },
  tableLeft: {
    width: trheadWidth,
  },
  leftItemView: {
    width: trheadWidth,
    height: trHeight,
    borderRightWidth: tdBorderWidth,
    borderRightColor: tdBorderColor,
    borderBottomWidth: tdBorderWidth,
    borderBottomColor: tdBorderColor,
  },
  leftItemText: {
    fontSize: 16,
    paddingLeft: 10,    
    lineHeight: trHeight,
    backgroundColor: tdBGC,
  },
  rightItemView: {
    height: trHeight,
    borderBottomWidth: tdBorderWidth,
    borderBottomColor: tdBorderColor,
    borderRightWidth: tdBorderWidth,
    borderRightColor: tdBorderColor,
  },
  rightItemText: {
    fontSize: 14,
    paddingRight: 10,
    lineHeight: trHeight,
    backgroundColor: tdBGC,
    textAlign: 'right',
  },
})

export default Table