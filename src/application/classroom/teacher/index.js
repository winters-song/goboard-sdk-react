import React, {useEffect, useRef, useState} from "react";
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

import classNames from "classnames";
import GoboardPanel from "./GoboardPanel";
import Video from "../../../components/classroom/Video";
import ControlBar from "../../../components/classroom/ControlBar";
import useScale from "../../../components/common/hooks";
import Ppt from "../../../components/classroom/Ppt";
import {SgfTree} from "../../../components"
import Canvas from "../../../components/Canvas/Canvas";

// 测试用开关
const controlBarEnabled = 0

/*
* 可用课程：
*
* 用户：13800000001
* Uid: 321
*
* 课堂链接：
* http://localhost:3000/classroom_stand?classroomId=333&stepId=1173
* 
* 棋灵webview测试
* ViewUtil.showWebView('/web/gospirit_webview/classroom_stand?classroomId=333&stepId=1173')
*
* 课堂视频：
* ClassroomSit.showVideo("3aabb46692df87c3bbc5c165d014eb5d_3")
*
*
* */
function ClassroomSitTeacher() {

  const [themeCls, setThemeCls] = useState('theme-black')

  const [canvasVisible, setCanvasVisible] = useState(false)

  const [videoVisible, setVideoVisible] = useState(false)
  const [vid, setVid] = useState()

  // 默认展示坐标
  const [coordinatesVisible, setCoordinatesVisible] = useState(true)
  // 默认展示手数
  const [order, setOrder] = useState(1)

  const [pptVisible, setPptVisible] = useState(false)
  const [pptUrl, setPptUrl] = useState()
  const [pptPosition, setPptPosition] = useState()

  const [showCountDown,setShowCountDown] = useState(false)
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


  const controlBarListener = (cmd, val) => {

    const player = goboardPanelRef.current && goboardPanelRef.current.getGoboardPlayer()
    if(!player) {
      return
    }
    switch(cmd){
      // 棋谱回到开头
      case 'goToStart':
        player.toStart()
        break;
      // 棋谱快进、快退（ -5, -1, 1, 5 ）
      case 'goStep':
        player.goStep(val)
        break;
      // 棋谱回到末尾
      case 'goToEnd':
        player.toEnd()
        break;
      // 标记ABCD开关
      case 'toggleMarker':
        if(val){
          player.cb.startDrawMarker()
        }else{
          player.cb.endDrawMarker()
          player.cb.clearMarkers()
        }
        break;
      // 划线开关
      case 'toggleBrush':
        setCanvasVisible(val)
        canvasRef.current.clear()
        break;
      // 清除划线或标记
      case 'clear':
        if(canvasVisible){
          canvasRef.current.clear()
        }else{
          player.cb.clearMarkers();
        }
        break;
      // 全屏
      case 'fullscreen':
        break;

      // +============================\
      case 'newSgf':
        let size = (player.cb && player.cb.options.boardSize) || 19
        player.newSgf(size)
        break;
      // 切换棋盘尺寸（9, 13, 19）
      case 'switchBoardSize':
        player.switchBoardSize(val)
        break;
      // 显示坐标
      case 'showCoordinates':
        setCoordinatesVisible(true)
        break;
      // 隐藏坐标
      case 'hideCoordinates':
        setCoordinatesVisible(false)
        break;
      //  手数开关： [0-关闭，1-显示所有手数，2-显示最后一手]
      case 'setOrder':
        setOrder(val)
        break;
      //  播放视频（保利威视）
      case 'playVideo':
        // showVideo('3aabb46692df87c3bbc5c165d014eb5d_3')
        showVideo(val)
        break;
      //  关闭视频
      case 'hideVideo':
        hideVideo()
        break;
      //  播放ppt
      case 'playPpt':
        // showPpt('/ppt/b39087c3-392a-4219-8ce4-f8f2ca8d6746/ZBtNnvM6/index.html')
        showPpt(val)
        break;
      //  关闭ppt
      case 'hidePpt':
        hidePpt()
        break;
      //  显示图片（讲解图片选择题时）
      case 'showPhoto':
        // showPhoto('https://oss-dev.iqidao.com/child/teacher/sgf/1643270017/bbcf9361d043679b35ed31103494356c.png')
        showPhoto(val)
        break;
      //  隐藏图片
      case 'hidePhoto':
        hidePhoto()
        break;
      case 'loadSgf':
        try{
          const json = JSON.parse(val)
          let whoPlay = json.whoPlay
          // 课件没有whoPlay，手动解析
          if(!whoPlay){
            const sgfTree = new SgfTree(json.sgf);
            const firstNode = sgfTree.root.children && sgfTree.root.children[0]
            if(firstNode){
              whoPlay = firstNode.color
            }
          }
          player.loadSgf(json.sgf, whoPlay || 1)
        }catch (e){
          message.error('棋谱解析失败')
        }
        break;
      //  红包、题目发放或收题
      case 'quiz':

        if(val === QUIZ_TYPE.RESPONSIVE){
          player.loadSgf(responsive1.data.sgf, responsive1.whoPlay)
        }
        else if(val === QUIZ_TYPE.SINGLE_MARK){
          let sgf = removeSgfMarker(singlemark.data.sgf)
          player.loadSgf(sgf, singlemark.whoPlay)
        }
        break;
      //  获取当前ABCD标记列表
      case 'getMarkers':
        console.info(player.cb.getMarkers().join(','))
        break;
      case 'pptNextMove':
        pptNextMove()
        break;
      case 'pptNextPage':
        pptNextPage()
        break;
      case 'pptPrePage':
        pptPrePage()
        break;
      case 'pptPreMove':
        pptPreMove()
        break;
      case 'loadTheme':
        loadTheme(val)
        break;
      default:
        break;
    }
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
    goboardPanelRef.current.getGoboardPlayer().changeTheme(themeConfigTeacher)
    setThemeCls(clsName)

    const player = goboardPanelRef.current && goboardPanelRef.current.getGoboardPlayer()
    player.newSgf(player.cb.options.boardSize)
  }

  // 请求直播token
  useEffect(() => {
    document.title = 'ClassroomMain'

    setTimeout(() => {
    //   const player = goboardPanelRef.current && goboardPanelRef.current.getGoboardPlayer()
    //
    //   // player.loadSgf(responsive1.data.sgf, responsive1.whoPlay)
    //   // player.loadSgf('(;CA[utf-8]SZ[13]AP[MultiGo:4.4.4]MULTIGOGM[1]\n' +
    //   //   ';B[gg];W[hg];B[hh];W[gh];B[fh];W[gi];B[ig];W[hf];B[gf];W[ih];B[hi];W[fi];B[ei];W[gj]\n' +
    //   //   ';B[hj];W[jh];B[jg];W[he];B[ge])', 1)
    //
    //   // player.loadSgf("(;CA[utf-8]AB[dg][cf][bd][be][cc][dc][fc][gc][hd][he][gf][eh]AW[bc][cd][fd][ff][cb][ge][ec][hc][gb][gg][cg][ef][ce][ee][dd][df][eg][de][fe][gd]TR[gg]C[]AP[MultiGo:4.4.4]SZ[9]AB[fg]MULTIGOGM[1];B[ed])", 1)
    // loadTheme('black')
    //
    },1000)
  }, [])

  const loadSgf = (sgf) => {
    const player = goboardPanelRef.current && goboardPanelRef.current.getGoboardPlayer()
    player && player.loadSgf(sgf, 1)
  }
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

  window.ClassroomSit = {
    showVideo,
    hideVideo,
    showPpt,
    hidePpt,
    showPhoto,
    hidePhoto,
    controlBarListener,
    getPptPageInfo,
    getBoardSettings,
    getMarkers,
    getSgfString,
    getMarkersQuizInfo,
    loadSgf,
    showCount,
    loadTheme
  }

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
      { controlBarEnabled && <ControlBar visible={true} on={controlBarListener} />}
    </div>
    <Canvas ref={canvasRef} style={{zIndex:12}} visible={canvasVisible} onShow={resizeCanvas2d}/>
    { videoVisible && <Video vid={vid} />}
  </div>
}


export default React.memo(ClassroomSitTeacher)