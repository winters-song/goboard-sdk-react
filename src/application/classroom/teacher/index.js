import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import './index.less'
import {responsive1, singlemark} from "./mock";
import {QUIZ_TYPE} from "../common/Constants";
import {message} from 'antd'

import COUNT1 from './assets/1.png'
import COUNT2 from './assets/2.png'
import COUNT3 from './assets/3.png'

// 主题样式
import {getThemeByName} from "../theme/theme";
import '../theme/black/theme_t.css'
import '../theme/cosmos/theme_t.css'
import '../theme/forest/theme_t.css'
import '../theme/grade/theme_t.css'
import '../theme/kid/theme_t.css'

import classNames from "classnames";
import GoboardPanel from "./GoboardPanel";
import Video from "../../../components/classroom/Video";
import useScale from "../../../components/common/hooks";
import Ppt from "../../../components/classroom/Ppt";
import {SgfTree} from "../../../components/go/SgfTree";
import Canvas from "../../../components/Canvas/Canvas";

let initialized = false
/*
* 课堂视频：
*
* props:
* - markerActive: bool 标记字母状态
* - brushActive: bool 划线状态
* - coordinatesVisible: bool 棋盘坐标是否展示
* - order: number [0-关闭，1-显示所有手数，2-显示最后一手]
* - theme: 主题 ['black', 'cosmos', 'forest', 'grade', 'kid']
* - onReady 初始化完毕回调
*
*
* ref方法：
* goToStart: 棋谱回到开头
* goStep: 前进、后退， 正数前进负数后退， value:[ -5, -1, 1, 5 ]
* goToEnd: 棋谱跳到结尾
* toggleMarker: 切换标记状态
* clear: 清除划线和标记
* newSgf: 新建空棋盘
* switchBoardSize: 切换棋盘路数， value:[9, 13, 19]
* showVideo: 播放保利威视视频，value: 视频id (example: "3aabb46692df87c3bbc5c165d014eb5d_3")
* hideVideo: 隐藏视频
* showPpt: 播放PPT，value: ppt地址 (example: "/ppt/b39087c3-392a-4219-8ce4-f8f2ca8d6746/ZBtNnvM6/index.html")
* hidePpt: 隐藏PPT
* showPhoto 播放图片（图片选择题时），value: 图片地址 (example: 'https://oss-dev.iqidao.com/child/teacher/sgf/1643270017/bbcf9361d043679b35ed31103494356c.png')
* hidePhoto 隐藏图片
* loadSgf: 加载棋谱 ， value: {sgf, whoPlay}
* pptNextMove: ppt下一步
* pptNextPage: ppt下一页
* pptPrePage: ppt下一页
* pptPreMove: ppt上一步
* getPptPageInfo: 获得ppt分页信息
* getBoardSettings: 获得棋盘设置信息
* getSgfString:  获得当前棋谱
* getMarkersQuizInfo: {markers, sgf} 获得当前标记题信息
* loadTheme: 更换皮肤
* showCount: 显示倒计时
*
*
*
* */
function ClassroomSitTeacher(props, ref) {

  const {markerActive, brushActive, coordinatesVisible, order=1, theme='black', onReady} = props
  const [themeCls, setThemeCls] = useState(`theme-${theme}`)

  const [canvasVisible, setCanvasVisible] = useState(false)

  const [videoVisible, setVideoVisible] = useState(false)
  const [vid, setVid] = useState()

  const [pptVisible, setPptVisible] = useState(false)
  const [pptUrl, setPptUrl] = useState()
  const [pptPosition, setPptPosition] = useState()

  const [showCountDown, setShowCountDown] = useState(false)
  const [countImg,setCountImg] = useState(COUNT3)

  const pageRef = useRef()
  const scale = useScale(pageRef, 1440, 1080)
  const canvasRef = useRef(false)
  const goboardPanelRef = useRef()


  const resizeCanvas2d = () => {
    if(!canvasRef.current){
      return
    }
    const size = canvasRef.current.getContainerSize()
    if(size){
      canvasRef.current.resize(size)
      canvasRef.current.clear()
    }
  }

  useEffect(() => {
    resizeCanvas2d()
  }, [scale])

  const getPlayer = (cb) => {
    const player = goboardPanelRef.current && goboardPanelRef.current.getGoboardPlayer()
    if(player) {
      cb && cb(player)
    }
  }

  const goToStart = () => {
    getPlayer(player => player.toStart())
  }

  const goToEnd = () => {
    getPlayer(player => player.toEnd())
  }
  const goStep = (val) => {
    getPlayer(player => player.goStep(val))
  }
  const clear = () => {
    getPlayer(player => {
      if(canvasVisible){
        canvasRef.current.clear()
      }else{
        player.cb.clearMarkers();
      }
    })
  }
  const newSgf = () => {
    getPlayer(player => {
      let size = (player.cb && player.cb.options.boardSize) || 19
      player.newSgf(size)
    })
  }
  const switchBoardSize = (val) => {
    getPlayer(player => player.switchBoardSize(val))
  }
  const loadSgf = (val) => {
    getPlayer(player => {
      let whoPlay = val.whoPlay
      // 课件没有whoPlay，手动解析
      if(!whoPlay){
        const sgfTree = new SgfTree(val.sgf);
        const firstNode = sgfTree.root.children && sgfTree.root.children[0]
        if(firstNode){
          whoPlay = firstNode.color
        }
      }
      player.loadSgf(val.sgf, whoPlay || 1)
    })
  }

  // 一解过关题，去掉答案标识
  const removeSgfMarker = (sgf) => {
    return sgf.replace(/CR(\[\w+\])+/, '')
  }

  // 视频
  const showVideo = (vid) => {
    setVideoVisible(true)
    setVid(vid)
  }
  const hideVideo = () => {
    setVideoVisible(false)
  }
  // ppt
  const showPpt = (url) => {
    setPptVisible(true)
    setPptUrl(url)
  }
  const hidePpt = () => {
    setPptVisible(false)
  }
  const showPhoto = (img) => {
    goboardPanelRef.current && goboardPanelRef.current.showPhoto(img)
  }
  const hidePhoto = () => {
    goboardPanelRef.current && goboardPanelRef.current.hidePhoto()
  }

  const pptNextMove = () => {
    window.frames[0].frame.forward2()
    // this.send('pptPosition', {pptPosition:JSON.parse(window.frames[0].frame.snapshot())})
    // this.getPPTPage()
  }
  const pptNextPage = () => {
    window.frames[0].frame.nextSlide()
    // this.send('pptPosition', {pptPosition:JSON.parse(window.frames[0].frame.snapshot())})
    // this.getPPTPage()
  }
  const pptPrePage = () => {
    window.frames[0].frame.prevSlide()
    // this.send('pptPosition', {pptPosition:JSON.parse(window.frames[0].frame.snapshot())})
    // this.getPPTPage()
  }
  const pptPreMove = () => {
    window.frames[0].frame.backward2()
    // this.send('pptPosition', {pptPosition:JSON.parse(window.frames[0].frame.snapshot())})
    // this.getPPTPage()
  }

  const getPptPageInfo = () => {
    const frame = window.frames[0].frame
    return [ frame.getIndex() + 1, frame.getTotalSlides()].join(',')
  }

  const getBoardSettings = () => {
    const player = goboardPanelRef.current && goboardPanelRef.current.getGoboardPlayer()
    if(!player) {
      return
    }

    return JSON.stringify({
      boardSize: player.cb.options.boardSize,
      showCoordinates: goboardPanelRef.current.getCoordinates(),
      showOrder: goboardPanelRef.current.getOrder()
    })
  }

  const getMarkers = () => {
    const player = goboardPanelRef.current && goboardPanelRef.current.getGoboardPlayer()
    if(!player) {
      return
    }
    return player.cb.getMarkers().join(',')
  }

  const getSgfString = () => {
    const player = goboardPanelRef.current && goboardPanelRef.current.getGoboardPlayer()
    if(!player) {
      return
    }
    return player.getSgfString()
  }
  const getMarkersQuizInfo = () => {
    return {
      markers:getMarkers(),
      sgf:getSgfString()
    }
  }


  // 加载主题
  const loadTheme = (name) => {
    const {clsName, themeConfigTeacher} = getThemeByName(name)

    getPlayer(player => {
      setThemeCls(clsName)
      player.changeTheme(themeConfigTeacher)
      player.newSgf(player.cb.options.boardSize)
      // onThemeReady && onThemeReady()
    })
  }

  // 请求直播token
  useEffect(() => {
    setTimeout(() => {
      initialized = true
      loadTheme(theme)

    //
    //   // player.loadSgf(responsive1.data.sgf, responsive1.whoPlay)
    //   // player.loadSgf('(;CA[utf-8]SZ[13]AP[MultiGo:4.4.4]MULTIGOGM[1]\n' +
    //   //   ';B[gg];W[hg];B[hh];W[gh];B[fh];W[gi];B[ig];W[hf];B[gf];W[ih];B[hi];W[fi];B[ei];W[gj]\n' +
    //   //   ';B[hj];W[jh];B[jg];W[he];B[ge])', 1)
    //
    //   // player.loadSgf("(;CA[utf-8]AB[dg][cf][bd][be][cc][dc][fc][gc][hd][he][gf][eh]AW[bc][cd][fd][ff][cb][ge][ec][hc][gb][gg][cg][ef][ce][ee][dd][df][eg][de][fe][gd]TR[gg]C[]AP[MultiGo:4.4.4]SZ[9]AB[fg]MULTIGOGM[1];B[ed])", 1)

      setTimeout(() => {
        onReady && onReady()
      }, 10)
    },10)
  }, [])


  const showCount = () => {
    setShowCountDown(true)
  }
  useEffect(() => {
    let timer
    if(showCountDown){
      let count = 3
      timer = setInterval(() => {
        count = count - 1
        let img = null
        if(count === 2){
          img = COUNT2
        }
        if(count === 1){
          img = COUNT1
        }
        if(count === 0){
          setShowCountDown(false)
          setCountImg(COUNT3)
          clearInterval(timer)
          return
        }
        setCountImg(img)
      },1000)
    }
    return (()=>{
      clearInterval(timer)
    })
  },[showCountDown])


  useEffect(() => {
    getPlayer(player => {
      if(!player.cb){
        return
      }
      if(markerActive){
        player.cb.startDrawMarker()
      }else{
        player.cb.endDrawMarker()
        player.cb.clearMarkers()
      }
    })
  }, [markerActive])

  useEffect(() => {
    if(canvasRef.current){
      setCanvasVisible(brushActive)
      canvasRef.current.clear()
    }
  }, [brushActive])


  useEffect(() => {
    if(theme && initialized){
      loadTheme(theme)
    }
  }, [theme])


  window.ClassroomSit = {
    goToStart,
    goToEnd,
    goStep,
    newSgf,
    switchBoardSize,
    loadSgf,
    clear,
    showVideo,
    hideVideo,
    showPpt,
    hidePpt,
    pptNextMove,
    pptNextPage,
    pptPreMove,
    pptPrePage,

    showPhoto,
    hidePhoto,
    getPptPageInfo,
    getBoardSettings,
    getMarkers,
    getSgfString,
    getMarkersQuizInfo,
    showCount,
    loadTheme
  }

  useImperativeHandle(ref, () => window.ClassroomSit)

  return <div className={classNames({
    "classroom-sit-teacher": true,
    [themeCls]: true
  })} ref={pageRef}>
    {
      showCountDown &&
      <div className="count-mask">
        <img src={countImg}  alt={""}/>
      </div>
    }
    <div className="main" style={{'transform': `translate(-50%, -50%) scale(${scale})`}}>
      <div className="bg" />
      <GoboardPanel ref={goboardPanelRef}
                    coordinatesVisible={coordinatesVisible}
                    order={order} />
      { pptVisible && <Ppt pptUrl={pptUrl} pptPosition={pptPosition} move={pptNextMove} />}
    </div>
    <Canvas ref={canvasRef} style={{zIndex:12}} visible={canvasVisible} onShow={resizeCanvas2d}/>
    { videoVisible && <Video vid={vid} />}
  </div>
}


export default React.memo(forwardRef(ClassroomSitTeacher))