import React, {useRef, useState, useEffect, useImperativeHandle, forwardRef} from "react";
import GoboardPlayer from 'components/go/GoboardQuizPlayer'
import classNames from "classnames";

function GoboardPanel (props, ref){
  const {coordinatesVisible, order, soundEnabled, playConfirmEnabled, onRendered} = props
  const goboardRef = useRef()
  const playerRef = useRef()

  // 图片选择题
  const [imageMode, setImageMode] = useState(false)
  const [imageUrl, setImageUrl] = useState('')


  const initGoboardPlayer = () => {
    if(playerRef.current) {
      return
    }
    const player = new GoboardPlayer({
      el: goboardRef.current,
      boardOptions:{
        showCoordinates: coordinatesVisible,
        readonly: true, // AI棋谱默认不可试下
        playConfirm: playConfirmEnabled,
        showHelperLines: true,
        useBoardImg: false,
      }
    });
    player.newSgf()

    playerRef.current = player
    onRendered(player)
  }

  const getGoboardPlayer = () => {
    return playerRef.current
  }

  // 显示隐藏坐标
  useEffect(() => {
    const player = playerRef.current
    if(player && player.cb){
      if(coordinatesVisible){
        player.cb.showCoordinates()
      }else{
        player.cb.hideCoordinates()
      }
    }
  }, [coordinatesVisible])


  // 手数
  useEffect(() => {
    const player = playerRef.current
    if(player && player.cb){
      if(order === 0){
        player.cb.options.showOrder = false
        player.cb.hideOrder()
      }else if(order === 1){
        player.cb.options.showOrder = true
        player.cb.showOrder()
      }else if(order === 2){
        player.cb.options.showOrder = 'last'
        player.cb.showLastOrder();
      }
    }
  }, [order])

  // 落子音效
  useEffect(() => {
    const player = playerRef.current
    if(player && player.cb){
      player.soundEnabled = soundEnabled
    }
  }, [soundEnabled])

  useEffect(() => {
    const player = playerRef.current
    if(player && player.cb){
      if(playConfirmEnabled){
        player.cb.options.playConfirm = true
      }else{
        player.cb.options.playConfirm = false
        player.prePlayData = null
        player.cb.hideHelperLine()
      }
    }
    
  }, [playConfirmEnabled])
  

  // 创建Player
  useEffect(() => {
    if(goboardRef) {
      initGoboardPlayer()
    }
  }, [goboardRef])


  useImperativeHandle(ref, () => {
    const functions = {
      getGoboardPlayer,
      getOrder: () => order,
      getCoordinates: () => coordinatesVisible,
      setImageMode,
      setImageUrl
    }
    // 全局调用
    window.GoboardPanel = functions

    return functions
  })

  return (
    <div className="goboard-box">
      <div className="goboard-quiz ">
        <div className={classNames({
          goboard: true,
          hidden: imageMode
        })} ref={goboardRef}></div>
      </div>
      { imageMode && <div className="imgboard" >
        <div className="inner">
          <img src={imageUrl}  alt={"img"}/>
        </div>
      </div>}
    </div>
  )
}

export default React.memo(forwardRef(GoboardPanel))
