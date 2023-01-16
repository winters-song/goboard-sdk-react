import {ClassroomSitTeacher} from "../application";
import React, {useRef, useState} from "react";
import './classroom.less'

// const testSgf = '(;CA[utf-8]AB[cf][eg][ee]AW[ef][de][dd]AP[MultiGo:4.4.4]SZ[9]AB[df]MULTIGOGM[1];W[ff];B[fe];W[gf];B[hf];W[ge];B[fd];W[gd];B[fc];W[ec];B[gc];W[dc];B[hd];W[gg];B[eb];W[ed];B[db];W[fb];B[cc];W[cd];B[bd];W[be];B[ce])'
const testSgf = '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.51.1]KM[7.5]SZ[13]DT[2023-01-16]AB[gg][hh]AW[hg][gh];B[ih];W[hf];B[fg];W[gi];B[];W[ij];B[ji];W[hj];B[jh];W[jf];B[if];W[ie];B[jg];W[ig];B[gj];W[fj];B[kf];W[gk];B[je];W[jj];B[if];W[jd];B[eh];W[jf];B[ej];W[ek];B[if])'
const activeStyle ={
  backgroundColor: '#f80',
  color: 'white'
}

export default function Classroom() {
  const [markerActive, setMarkerActive] = useState(false)
  const [brushActive, setBrushActive] = useState(false)
  const [coordinatesVisible, setCoordinatesVisible] = useState(true)
  const [order, setOrder] = useState(1)
  const [theme, setTheme] = useState('forest')

  const boardRef = useRef()

  const onReady = () => {
    // setTheme("forest")

    setTimeout(() => {

      boardRef.current.loadSgf({ sgf: testSgf, whoPlay: 2})
      boardRef.current.goToEnd()
    }, 10)
  }



  return <div className="page-classroom">
    <div className="left-part">
      <button onClick={() => boardRef.current.showVideo("3aabb46692df87c3bbc5c165d014eb5d_3")}>播放视频</button>
      <button onClick={() => boardRef.current.hideVideo()}>关闭视频</button>
      <hr/>
      <button onClick={() => boardRef.current.showPpt("https://alidev-iqidao.com/ppt/b39087c3-392a-4219-8ce4-f8f2ca8d6746/ZBtNnvM6/index.html")}>播放PPT</button>
      <button onClick={() => boardRef.current.hidePpt()} >关闭PPT</button>
      <hr/>
      <button onClick={() => boardRef.current.showPhoto('https://oss-dev.iqidao.com/child/teacher/sgf/1643270017/bbcf9361d043679b35ed31103494356c.png')}>播放图片</button>
      <button onClick={() => boardRef.current.hidePhoto()} >关闭图片</button>
      <hr/>
      <label htmlFor="">切换路数</label>
      <div className="group">
        <button onClick={() => boardRef.current.switchBoardSize(9)}>9路</button>
        <button onClick={() => boardRef.current.switchBoardSize(13)}>13路</button>
        <button onClick={() => boardRef.current.switchBoardSize(19)}>19路</button>
      </div>
      <button onClick={() => boardRef.current.newSgf()}>空棋盘</button>
      <button onClick={() => {
        boardRef.current.loadSgf({ sgf: testSgf, whoPlay: 2})
        boardRef.current.goToEnd()
      }}>加载棋谱</button>

      <hr/>
      <label htmlFor="">坐标</label>
      <div className="group">
        <label htmlFor="hideCoor">
          <input type={"radio"} name="coordinates" id={"hideCoor"} checked={!coordinatesVisible} onChange={() => {
            setCoordinatesVisible(false)
          }} />隐藏
        </label>
        <label htmlFor="showCoor">
          <input type={"radio"} name="coordinates" id={"showCoor"} checked={coordinatesVisible} onChange={() => {
            setCoordinatesVisible(true)
          }} />显示
        </label>
      </div>

      <hr/>
      <label htmlFor="">手数</label>
      <div className="group">
        <label htmlFor="hideOrder">
          <input type={"radio"} name="order" id={"hideOrder"} checked={order ===0} onChange={() => {
            setOrder(0)
          }} />隐藏
        </label>
        <label htmlFor="showOrder">
          <input type={"radio"} name="order" id={"showOrder"} checked={order ===1} onChange={() => {
            setOrder(1)
          }} />显示
        </label>
        <label htmlFor="showLast">
          <input type={"radio"} name="order" id={"showLast"} checked={order ===2} onChange={() => {
            setOrder(2)
          }} />最后一手
        </label>
      </div>

      <hr/>
      <label htmlFor="">皮肤</label>
      <div className="group">
        <button onClick={() => setTheme("black")}>酷黑</button>
        <button onClick={() => setTheme("forest")}>森林</button>
        <button onClick={() => setTheme("cosmos")}>宇宙</button>
      </div>
      <div className="group">
        <button onClick={() => setTheme("grade")}>复盘</button>
        <button onClick={() => setTheme("kid")}>棋灵</button>
      </div>
    </div>
    <div className="center-part">
      <div className="board">
        <ClassroomSitTeacher
          ref={boardRef}
          markerActive={markerActive}
          brushActive = {brushActive}
          coordinatesVisible={coordinatesVisible}
          order={order}
          theme={theme}
          onReady={onReady}
        />
      </div>

      <div className="controlbar">
        <div className="btn-group">
          <button  onClick={() => boardRef.current.goToStart()} >|&lt;&lt;</button>
          <button  onClick={() => boardRef.current.goStep(-5) } >&lt;&lt;</button>
          <button  onClick={() => boardRef.current.goStep(-1) } >&lt;</button>
          <button  onClick={() => boardRef.current.goStep(1)  } >&gt;</button>
          <button  onClick={() => boardRef.current.goStep(5)  } >&gt;&gt;</button>
          <button  onClick={() => boardRef.current.goToEnd() } >&gt;&gt;|</button>
        </div>
        <div className="btn-group">
          <button style={markerActive ? activeStyle:{}} onClick={() => setMarkerActive(!markerActive)} >标记</button>
          <button style={brushActive? activeStyle:{}} onClick={() => setBrushActive(!brushActive)} >画笔</button>
          <button onClick={() => boardRef.current.clear() }>清除</button>
        </div>

      </div>
    </div>
    <div className="right-part"></div>
  </div>



}