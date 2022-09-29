import React, {useEffect} from "react";
import {SgfTree} from "components/go/SgfTree"
import ManualBar from './ManualBar'
import SelectBar from "./SelectBar";
import ResponsiveBar from "./ResponsiveBar";

import {
  QUIZ_TYPE,
  TYPE_NAME,
} from "./Constants";
import classNames from "classnames";


/**
 * answer: null
  gameQuizId: 167
  id: 2
  name: "5997-此时如何应对二间高夹最佳？.sgf"
  options: "[]"
  paperId: 2
  question: "5997-此时如何应对二间高夹最佳？.sgf"
  sgf: "(;CA[gb2312]AB[oc][pq][pl]AW[dd][dp][qo]AP[MultiGo:4.4.4]SZ[19]AB[qd]MULTIGOGM[1]\r\n;W[op];B[oq];W[np];B[mq]\r\n(;W[mp];B[lq];W[lp];B[kq];W[kp];B[jq];W[qj])\r\n(;W[qj]))"
  thumbnail: "https://oss-dev.iqidao.com/child/quiz/1644995126/2ead991e5343aa3edb731424be11baef.png"
  type: "AUTO_ANSWER"
  whoPlay: 1  
 */
function PuzzleInfo (props){
  const {data, order, paperInfo, goboardPlayer, goboardPanelRef, onSubmit} = props

  useEffect(() => {
    if(data){
      renderPuzzle(data)
    }
  }, [data])

  const onComplete = (data) => {
    // console.log(data)
    onSubmit(data)
  }

  const renderPuzzle = (data) => {

    if(data.type === QUIZ_TYPE.SELECT_IMG){
      goboardPanelRef.current.setImageMode(true)
      goboardPanelRef.current.setImageUrl(data.sgf)
      return
    }
    goboardPanelRef.current.setImageMode(false)

    changeData(data)

    // 选择题不可操作棋盘
    if(data.type === QUIZ_TYPE.SELECT_SGF ){
      goboardPlayer.cb.setReadonly(true);
    }else{
      goboardPlayer.cb.setReadonly(false);
    }

    if(data.type === QUIZ_TYPE.MANUAL){
      goboardPlayer.isBothSides = true
    }else{
      goboardPlayer.isBothSides = false
    }
  }

  const changeData = (data) => {
    const {sgf, whoPlay} = data
    let sgfTree = new SgfTree(sgf);
    // 根据SGF,自动切换当前棋盘大小
    let boardSize = sgfTree.root.getProperty('SZ');
    if (boardSize && boardSize.length) {
      boardSize = boardSize[0]*1;
    } else {
      boardSize = 19
    }
    if(data.type === QUIZ_TYPE.RESPONSIVE) {
      goboardPlayer.init({sgfTree, whoFirst: whoPlay, boardSize}, {
        playConfirm: true,
        showHelperLines: true,
      });
    }else{
      goboardPlayer.init({sgfTree, whoFirst: whoPlay, boardSize});

    }
  }

  return <div className="inner" >
    <h2 className="title">{TYPE_NAME[data.type]}</h2>

    <div className="header">
      <div className="page-info">
        {order + 1}/{paperInfo.questions.length}
      </div>
      <div className="extra-info">
        <div className="text">题目ID：{data.gameQuizId}</div>
        <div className={classNames({
          'who-play': true,
          black: data.whoPlay === 1,
          white: data.whoPlay === 2,
          none: !data.whoPlay
        })}>
          {data.whoPlay === 1 && '黑先'}
          {data.whoPlay === 2 && '白先'}
        </div>
      </div>
    </div>

    <div className="details">
      <div className="description">{data.name} </div>
      <div className="action-bar">
        { data.type === QUIZ_TYPE.MANUAL && <ManualBar
          data={data}
          goboardPlayer={goboardPlayer}
          onComplete={onComplete}
        /> }
        { (data.type === QUIZ_TYPE.SINGLE_MARK || data.type === QUIZ_TYPE.MULTI_MARK) && <ManualBar
          data={data}
          goboardPlayer={goboardPlayer}
          onComplete={onComplete}
        /> }
        { (data.type === QUIZ_TYPE.SELECT_IMG || data.type === QUIZ_TYPE.SELECT_SGF) && <SelectBar
          data={data}
          onComplete={onComplete}
          needConfirm={true}
          hasAnswer={true}
        /> }
        { data.type === QUIZ_TYPE.RESPONSIVE && <ResponsiveBar
          data={data}
          showAnswer={false}
          goboardPlayer={goboardPlayer}
          onComplete={onComplete}
        /> }
      </div>
    </div>
  </div>
}

export default React.memo(PuzzleInfo);