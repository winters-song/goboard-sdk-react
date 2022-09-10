import React, {useRef, useState} from "react"
import classNames from 'classnames'

import { Button } from 'antd';

import backwardOutlined from '../assets/img/icon_backward_outlined.png'
import forwardOutlined from '../assets/img/icon_forward_outlined.png'
import fastBackwardOutlined from '../assets/img/icon_fast_backward_outlined.png'
import fastForwardOutlined from '../assets/img/icon_fast_forward_outlined.png'
import toBeginningOutlined from '../assets/img/icon_to_beginning_outlined.png'
import toEndingOutlined from '../assets/img/icon_to_ending_outlined.png'

import alphaOutlined from '../assets/img/icon_alpha_outlined.png'
import brushOutlined from '../assets/img/icon_brush_outlined.png'
import closeOutlined from '../assets/img/icon_close_outlined.png'
import fullscreenIcon from '../assets/img/icon_fullscreen.svg'
import {QUIZ_TYPE} from "../../application/classroom/common/Constants";

const activeStyle = {
  backgroundColor: '#fa0'
}

function ControlBar(props) {
  const {visible, on} = props
  const [markActive, setMarkActive] = useState(false)
  const [brushActive, setBrushActive] = useState(false)

  const markRef = useRef(false)
  const brushRef = useRef(false)

  const toggleMarker = () => {
    markRef.current = !markRef.current
    setMarkActive(markRef.current)
    on('toggleMarker', markRef.current)
  }

  const toggleBrush = () => {
    brushRef.current = !brushRef.current
    setBrushActive(brushRef.current)
    on('toggleBrush', brushRef.current)
  }

  return (
    <>
      <header className={classNames({
        bottomBar: true,
        visible
      })}>
        <div className="btn-group">
          <Button type="primary" title="开局" size="large" icon={<img src={toBeginningOutlined} alt="" />} onClick={() => on('goToStart')}/>
          <Button type="primary" title="快退" size="large" icon={<img src={fastBackwardOutlined} alt="" />} onClick={() => on('goStep', -5) } />
          <Button type="primary" title="后退" size="large" icon={<img src={backwardOutlined} alt="" />} onClick={() => on('goStep', -1) } />
          <Button type="primary" title="前进" size="large" icon={<img src={forwardOutlined} alt="" />} onClick={() => on('goStep', 1) } />
          <Button type="primary" title="快进" size="large" icon={<img src={fastForwardOutlined} alt="" />} onClick={() => on('goStep', 5) } />
          <Button type="primary" title="终局" size="large" icon={<img src={toEndingOutlined} alt="" />} onClick={() => on('goToEnd') } />
        </div>

        <div className="btn-group">
          <Button type="primary" title="标记" size="large"  icon={<img src={alphaOutlined} alt="" />}
                  style={markActive ? activeStyle:{}}
                  onClick={toggleMarker} />
          <Button type="primary" title="画笔" size="large" icon={<img src={brushOutlined} alt="" />}
                  style={brushActive? activeStyle:{}}
                  onClick={toggleBrush} />
          <Button type="primary" title="清除" size="large" icon={<img src={closeOutlined} alt="" />} onClick={() => on('clear')}/>
        </div>

        <div className="btn-group">
          <Button type="primary" title="全屏" size="large" icon={<img src={fullscreenIcon} alt="" />} onClick={() => on('fullscreen')} />
        </div>

      </header>

      <div className="sidebar" style={{position: 'fixed', left: 15, top: 15, zIndex: 20}}>

        <div className="btn-group" >
          <Button type="primary" size="large" onClick={() => on('switchBoardSize', 9)}>9</Button>
          <Button type="primary" size="large" onClick={() => on('switchBoardSize', 13)}>13</Button>
          <Button type="primary" size="large" onClick={() => on('switchBoardSize', 19)}>19</Button>
        </div>

        <div className="btn-group" >
          <Button type="primary" size="large" onClick={() => on('showCoordinates', 1)}>显示手数</Button>
          <Button type="primary" size="large" onClick={() => on('hideCoordinates', '')}>隐藏手数</Button>
        </div>

        <div className="btn-group" >
          <Button type="primary" size="large" onClick={() => on('setOrder', 1)}>显示手数</Button>
          <Button type="primary" size="large" onClick={() => on('setOrder', 2)}>最后一手</Button>
          <Button type="primary" size="large" onClick={() => on('setOrder', 0)}>隐藏手数</Button>
        </div>

        <div className="btn-group" >
          <Button type="primary" size="large" onClick={() => on('playVideo')}>播放视频</Button>
          <Button type="primary" size="large" onClick={() => on('hideVideo', '')}>隐藏视频</Button>
        </div>

        <div className="btn-group" >
          <Button type="primary" size="large" onClick={() => on('playPpt')}>播放Ppt</Button>
          <Button type="primary" size="large" onClick={() => on('hidePpt', '')}>隐藏Ppt</Button>
        </div>

        <div className="btn-group" >
          <Button type="primary" size="large" onClick={() => on('showPhoto')}>显示图片</Button>
          <Button type="primary" size="large" onClick={() => on('hidePhoto')}>隐藏图片</Button>
        </div>

        <div className="btn-group" >
          <Button type="primary" size="large" onClick={() => on('quiz', QUIZ_TYPE.RESPONSIVE)}>自动应答</Button>
          <Button type="primary" size="large" onClick={() => on('quiz', QUIZ_TYPE.SINGLE_MARK)}>标记题</Button>
        </div>

        <div className="btn-group" >
          <Button type="primary" size="large" onClick={() => on('getMarkers')}>获取当前标记</Button>
        </div>
      </div>
    </>
  )
}

export default React.memo(ControlBar)