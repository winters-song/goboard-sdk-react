// 自动应答题
import React, {useState, useEffect} from "react";
import {AutoPlayStatus, SgfTree} from "components/go/SgfTree"
import { RESULT } from "./Constants";
import ResultBar from "./ResultBar";
import PlayHelper from "./PlayHelper";

const STATE = {
  READY: 1,
  WAITING: 2,
  DONE: 3
}

const STATE_TEXT = {
  1: '请落子...',
  2: '等待对方落子...',
  3: ''
}

function ResponsiveBar(props) {
  const {data, goboardPlayer, onComplete} = props
  const [showHelper, setShowHelper] = useState(false)
  const [status, setStatus] = useState(STATE.READY)
  const [result, setResult] = useState(RESULT.NONE)

  // 是否是错误分支
  const check = (comment) => {
    return comment && /^1/.test(comment);
  }

  // 是否是正确分支
  const isResponseRight = () => {
    return data.comment !== 1
  }

  //应答结束
  const responseOver = (right) => {
    const cb = goboardPlayer.cb;

    // data.over = true
    // data.isRight = right
    setStatus(STATE.DONE)

    cb.setReadonly(true);
    setResult(right ? RESULT.SUCCESS : RESULT.FAILED)

    const answer = SgfTree.addTrace(data.sgf, cb.trace);
    onComplete({ isRight: right?1:0, answer })
  }

  // 交替落子
  const onMove = (d) => {
    const node = d.currentNode;
    const whoPlay = goboardPlayer.whoFirst;

    setShowHelper(false)

    //忽略电脑落子
    if (node.color !== whoPlay) {
      return;
    }

    const result = data.tree.autoPlay(node.col, node.row, node.color);
    // 不存在该分支，后退一步
    if (result.status === AutoPlayStatus.NO_MATCH) {
      responseOver(false);
      return;
    }

    const comment = result.playNode.getComment();
    // 如果进入了错误分支，标记当前题目data的comment = 1
    if (comment && /^1/.test(comment)) {
      data.comment = 1;
    }

    if (result.status === AutoPlayStatus.OK) {
      //存在应答结果
      if (result.next) {
        responseNext(result.next)
      }
    }
    if (result.status === AutoPlayStatus.OVER) {
      const right = isResponseRight();
      //叶子节点，显示对错
      //如果有响应，响应完再显示结果
      if (result.next) {
        responseNext(result.next, responseOver)
      } else {
        responseOver(right);
      }
    }
  }

  // 电脑落子
  const responseNext = (node, callback) => {
    const cb = goboardPlayer.cb;

    cb.setReadonly(true);
    setStatus(STATE.WAITING)

    //电脑落子错误分支
    const comment = node.getComment();
    if (check(comment)) {
      data.comment = 1;
    }
    const right = isResponseRight();

    setTimeout( () => {
      cb.setReadonly(false);
      setStatus(STATE.READY)
      cb.onPlayCb.call(cb, node.color, node.col, node.row);

      // 最后一步响应，回调保存方法
      if(callback){
        callback(right)
        return;
      }
    }, 500);
  }

  const reset = () => {
    setStatus(STATE.READY)
    setResult(RESULT.NONE)
    data.tree = new SgfTree(data.sgf);
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
      reset()
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
      {result === RESULT.NONE && <div className="responsive-bar">
        {!showHelper && <div className="result doing">{STATE_TEXT[status]}</div>}
        {showHelper && <PlayHelper moveHelperLine={moveHelperLine} onConfirm={onConfirm} /> }
      </div>}
      <ResultBar result={result} />
    </>
  )
};

export default React.memo(ResponsiveBar)
