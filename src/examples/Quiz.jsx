/*
* 计算力工厂试卷
* http://localhost:3000/web/gospirit_webview/computation?paperId=2
*
* 是否展示宝箱奖励： data.switchReward
*
* 教师后台试做：url添加参数：isTeacher=1, 读取teacher后台localStorage: auth-token
* http://localhost:3000/web/gospirit_webview/computation?paperId=2&isTeacher=1
*
* */
import React, {useRef, useState, useEffect} from "react";

import PuzzleInfo from "components/quiz/PuzzleInfo";

import {message} from "antd";
import useScale from "components/common/hooks";
import GoboardPanel from "components/quiz/GoboardPanel";
import {paperInfoData} from 'mock/paper'
import './quiz.less'

function Quiz () {
  const [goboardPlayer, setGoboardPlayer] = useState()
  const [data, setData] = useState()
  const [order, setOrder] = useState()
  const [quizData, setQuizData] = useState()

  const goboardPanelRef = useRef()

  // 页面dom，用于自适应
  const pageRef = useRef()
  const dataRef = useRef()
  const orderRef = useRef()
  const scale = useScale(pageRef)


  // 展示题目
  const showPuzzle = (index) => {
    const quizData = dataRef.current.questions[index]
    if (quizData) {
      setQuizData(quizData);
    }
  }

  const doSubmit = (needQuit) => {

  }


  // 完成棋盘渲染，请求试卷信息
  const onRendered = (player) => {
    setGoboardPlayer(player)

    setData(paperInfoData)
  }


  // 保存题目
  const submitQuiz = (userData) => {
    const quizData = dataRef.current.questions[orderRef.current]
    console.log(userData, orderRef.current, dataRef.current[orderRef.current])

    const values = Object.assign({
      id: quizData.id,
      createTime: quizData.createTime,
      gameQuizId: quizData.gameQuizId,
    }, userData)

    showSuccessAnim(userData.isRight, () => {
      if(orderRef.current >= dataRef.current.questions.length - 1 ){
        doSubmit()
      }else{
        setOrder(orderRef.current + 1)
      }
    })
  }

  const showSuccessAnim = (isRight, cb) => {

    console.log(isRight)

    setTimeout(() => {
      cb && cb()
    }, 1000)
  }

  // 界面渲染
  useEffect(() => {
    if(!data){
      return
    }

    dataRef.current = data
    if(data.questions && data.questions.length){
      const len = data.answerData.length

      if(len < data.questions.length){
        setOrder(Math.max(0, len))

        // 只有一道题时重置当前状态
        if(data.questions.length === 1){
          setQuizData(null)
          showPuzzle(0)
        }
      }else{
        doSubmit()
      }

    }else{
      message.error('试卷还没有配置好，请稍后重试~')
      return
    }
  }, [data])

  // order改变，翻页
  useEffect(() => {
    if(order !== undefined){
      orderRef.current = order
      showPuzzle(order)
    }
  }, [order])


  window.Computation = {
    showPuzzle,
  }

  return (
    <div className="page-computation" ref={pageRef}>
      <div className="main" style={{'transform': `translate(-50%, -50%) scale(${scale})`}}>
        <div className="bg"></div>

        <GoboardPanel ref={goboardPanelRef}
            coordinatesVisible={false}
            order={1}
            soundEnabled={true}
            playConfirmEnabled={true}
            onRendered={onRendered}
        />

        <div className="sidebar-right" >
          {!!quizData && <PuzzleInfo
            paperInfo={data}
            data={quizData}
            order={order}
            onSubmit={data => submitQuiz(data)}
            goboardPlayer={goboardPlayer}
            goboardPanelRef={goboardPanelRef}
          />}
        </div>
      </div>
    </div>
  )
}

export default React.memo(Quiz)
