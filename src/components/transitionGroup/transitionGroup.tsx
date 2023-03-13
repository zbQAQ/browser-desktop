import React from "react"

import "./transitionGroup.less"

// 未开始 进行中 已结束
type AnimationStatus = 'notStart' | 'pendding' | 'finish'
const enum ANIMATION_STATUS {
  NOT_START = 'notStart',
  PENDDING = 'pendding',
  FINISH = 'finish'
}

interface IProps {
  // 显示 / 隐藏
  visible: boolean;

  //进入动画 的名称
  //动画效果参考 https://digital-flowers.github.io/react-animated-css.html
  enterAnimation?: string;
  
  //离开动画 的名称
  leaveAnimation?: string;

  // 离开动画结束后是否删除节点
  leaveDeleteDom?: boolean

  //动画执行周期 单位ms
  delay?: number;

  // 离开动画结束时 执行的钩子函数
  leaveAnimationTrigger?: () => any

  className?: string;
}

interface IState {
  // 实际控制 动画节点 或者 children节点 的显示隐藏
  display: boolean
}

export default class TransitionGroup extends React.Component<IProps, IState> {
  _id: string = "0"
  // status: AnimationStatus = 'notStart'
  tranDom: React.ReactNode | null = null
  constructor(props: IProps) {
    super(props)
    this._id = Date.now() + ""
    // this.status = 'notStart'
    this.tranDom = React.createRef<HTMLDivElement>()
    this.state = {
      display: true
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: IProps) {
    if(nextProps.visible) {
      this.setState({ display: nextProps.visible })
    }
  }

  componentDidMount() {
    const el = this.tranDom as Element
    if(el) {
      el.addEventListener('animationend', this.leaveAnimationEnd)
    }
  }

  // 离开动画结束事件
  leaveAnimationEnd = () => {
    const { visible, leaveAnimationTrigger } = this.props
    // 监听离开动画结束
    if(!visible) {
      this.setState({ display: false })
      leaveAnimationTrigger && leaveAnimationTrigger()
    }
  }
  
  render() {
    const { 
      children,
      visible,
      delay = 500, 
      enterAnimation = "fadeIn", 
      leaveAnimation = "fadeOut", 
      leaveDeleteDom = false, 
      className = '' 
    } = this.props
    
    const { display } = this.state
    const initStyle = {
      animationDuration: `${delay}ms`,
      animationName: visible ? enterAnimation : leaveAnimation,
    }

    const classs = `transitionGroupV2 ${className} ${visible ? 'pointerEventsAll' : 'pointerEventsNone'}`
    
    if(leaveDeleteDom) {
      return (
        <div className={classs} id={this._id} ref={el => this.tranDom = el} style={initStyle}>
          {display ? children : null}
        </div>
      )
    } else {
      return (
        <div className={classs} id={this._id} ref={el => this.tranDom = el} style={initStyle}>
          {children}
        </div>
      )
    }
  }
}