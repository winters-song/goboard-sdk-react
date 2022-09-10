import React, {useRef, useState, useEffect, useImperativeHandle, forwardRef} from "react";
import GoboardPlayer from '../../../components/go/GoboardBranchPlayer'

import blackImg from '../../../components/assets/img/black.png'
import whiteImg from '../../../components/assets/img/white.png'
import classNames from "classnames";

const orderMap = {
  0: false,
  1: true,
  2: 'last'
}

function GoboardPanel (props, ref){
  const {coordinatesVisible, order} = props
  const [goboardPlayer, setGoboardPlayer] = useState()

  const orderRef = useRef(order)
  const coordinatesRef = useRef(coordinatesVisible)

  // 图片选择题
  const [imageMode, setImageMode] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const goboardRef = useRef()
  const playerRef = useRef()

  const initGoboardPlayer = () => {
    if(playerRef.current) {
      return
    }
    const player = new GoboardPlayer({
      el: goboardRef.current,
      boardOptions:{
        showOrder: orderMap[orderRef.current],
        showCoordinates: coordinatesRef.current,
        blackImg,
        whiteImg,
        useBoardImg: false,
        svgBoardImg: require('../theme/black/board_t.png'),
        style: {
          borderColor: "#333",
          bgColor: "transparent"
        },
        sizeSettings: {
          9: {
            PIECE_RADIUS: 30,
            UNIT_LENGTH: 65,
            fontSize: 20,
            markerSize: 30,
          },
          13: {
            PIECE_RADIUS: 20,
            UNIT_LENGTH: 46.4,
            fontSize: 16,
            markerSize: 26,
          },
          19: {
            PIECE_RADIUS: 15,
            UNIT_LENGTH: 31,
            fontSize: 14,
            markerSize: 22,
          }
        }
      }
    });
    setGoboardPlayer(player)
    playerRef.current = player
  }

  const getGoboardPlayer = () => {
    return playerRef.current
  }

  const showPhoto = (img) => {
    setImageMode(true)
    setImageUrl(img)
  }
  const hidePhoto = () => {
    setImageMode(false)
  }

  // 显示隐藏坐标
  useEffect(() => {
    const player = playerRef.current;
    coordinatesRef.current = coordinatesVisible

    if(player && player.cb){
      if(coordinatesVisible){
        player.cb.showCoordinates()
      }else{
        player.cb.hideCoordinates()
      }
    }
  }, [coordinatesVisible])

  useEffect(() => {
    const player = playerRef.current;
    orderRef.current = order

    if(player && player.cb){
      if(order === 0){
        player.cb.options.showOrder = false
        player.cb.hideOrder()
      }else if(order === 1){
        player.cb.options.showOrder = true
        player.cb.showOrder()
      }else if(order === 2){
        player.cb.options.showOrder = 'last'
        player.cb.hideOrder()
        player.cb.showLastOrder();
      }
    }
  }, [order])


  // 创建Player
  useEffect(() => {
    if(goboardRef) {
      initGoboardPlayer()
    }
  }, [goboardRef])

  useEffect(() => {
    if(goboardPlayer){
      goboardPlayer.newSgf()
    }

  }, [goboardPlayer])

  useImperativeHandle(ref, () => {
    const functions = {
      getGoboardPlayer,
      showPhoto,
      hidePhoto,
      getOrder: () => order,
      getCoordinates: () => coordinatesVisible
    }
    // 全局调用
    window.GoboardPanel = functions

    return functions
  })

  return (
    <div className="goboard-box">
      <div className={classNames({
        goboard: true,
        hidden: imageMode
      })} ref={goboardRef} />
      { imageMode && <div className="imgboard" style={{ backgroundImage: `url(${imageUrl})`}} />}
    </div>
  )
}

export default React.memo(forwardRef(GoboardPanel))
