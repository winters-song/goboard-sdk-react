// 摆图题
import React, {useState, useEffect} from "react";
import classnames from "classnames";
import {SgfTree} from '@/components/go/SgfTree'
import { RESULT } from "./Constants";
import ResultBar from "./ResultBar";
import PlayHelper from "./PlayHelper";
import {checkUserAnswer} from "@/utils/go";

function ManualBar(props) {
  const {data, goboardPlayer, onReset, onComplete} = props
  const [showHelper, setShowHelper] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [result, setResult] = useState(RESULT.NONE)

  const backward = () => {
    goboardPlayer.backward();
  }

  const replay = () => {
    goboardPlayer.toStart();
  }

  const onMove = ({currentStep}) => {
    setDisabled(currentStep === 0);
    setShowHelper(false)
  }

  const doSubmit = () => {
    const cb = goboardPlayer.cb
    cb.setReadonly(true);

    // 用户答案：默认未作答
    const result = {
      answer : '',
      isRight : 0
    }

    if(cb.trace.length){
      result.answer = SgfTree.addTrace(data.sgf, cb.trace);
      result.isRight = checkUserAnswer(data.sgf, cb.trace)? 1:0
    }

    setResult(result.isRight ? RESULT.SUCCESS : RESULT.FAILED)
    onComplete(result)
  }


  const moveHelperLine = (x, y) => {
    goboardPlayer && goboardPlayer.cb.moveHelperLine(x, y)
  }
  const onConfirm = () => {
    goboardPlayer && goboardPlayer.onConfirm()
  }

  const onPrePlay = () => setShowHelper(true)

  useEffect(() => {
    if(data && goboardPlayer){
      setResult(RESULT.NONE)
      // reset()
      goboardPlayer.on('move', onMove)
      goboardPlayer.on('prePlay', onPrePlay)

    }

    return () => {
      goboardPlayer.off('move', onMove)
      goboardPlayer.off('prePlay', onPrePlay)
    }
  }, [goboardPlayer, data])


  return (
    <>
      { result === RESULT.NONE && <div className="manual-bar">
        {!showHelper && <>
          <div onClick={() => !disabled && replay()} className={classnames({
            'btn': true,
            disabled
          })}>重摆</div>
          <div onClick={() => !disabled && backward()} className={classnames({
            'btn': true,
            disabled
          })}>上一步</div>
          <div className="buttons">
            <div className="btn btn-primary" onClick={doSubmit}>提交</div>
          </div>
        </>}
        {showHelper && <PlayHelper moveHelperLine={moveHelperLine} onConfirm={onConfirm} /> }
      </div>
      }
      <ResultBar result={result} />
    </>
  )
};

export default React.memo(ManualBar)
