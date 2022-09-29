// 选择题
import React, {useState, useEffect, useRef} from "react";
import classNames from "classnames";
import {message} from "antd";
import { RESULT } from "./Constants";
import ResultBar from "./ResultBar";

/*
* 通用选择题选项卡
*
* params:
*
* - needConfirm: 是否需要确认按钮（分屏课堂标记题：需要确认按钮， 互动答题、站立课堂均不要确认）
* - hasAnswer: data中是否包含答案（标记题不带答案，互动课件带答案）
*
* 选项1列或2列class样式： one-column (4个选项及以下时有该样式)
*
* 用户交卷字段：{answer, answerIndex}
*
* */

// 选项按钮
function Option(props) {
  const {text, index, answer, onSelect, selected, confirmed, finished, hasAnswer} = props
  const elRef = useRef()
  const doSelect = () => {
    if(selected || confirmed || finished){
      return
    }

    onSelect(index)
  }

  return <div onClick={doSelect} ref={elRef} className={classNames({
    button: true,
    selected: selected && !confirmed,
    confirmed: confirmed,
    success: hasAnswer && confirmed && answer,
    danger: hasAnswer && confirmed && !answer
  })}>{text}</div>

}


function SelectBar(props) {

  const {data, onComplete, needConfirm, hasAnswer} = props
  const [list, setList] = useState([])
  const [result, setResult] = useState(RESULT.NONE)


  // 确认按钮状态
  const [disabled, setDisabled] = useState(true)
  // 完成答题，即将跳转
  const [finished, setFinished] = useState(false)

  const selectedRef = useRef()
  const finishedRef = useRef(false)

  const onSelect = (index) => {

    if(index === selectedRef.current){
      return
    }

    if(!finishedRef.current){
      setDisabled(false)
    }else{
      return
    }

    if(selectedRef.current !== undefined){
      list[selectedRef.current].selected = false
    }
    list[index].selected = true
    selectedRef.current = index

    setList(list.slice())
  }

  const onConfirm = () => {
    if(disabled || selectedRef.current === undefined){
      return
    }
    const item = list[selectedRef.current]
    if(!item.confirmed){
      list[selectedRef.current].confirmed = true
      setList(list.slice())

      let result = {
        answer: item.index
        // answer: item.text
      }
      // 后台用
      // if(item.index){
      //   res.answerIndex = item.index
      // }
      if(hasAnswer){
        result.isRight = item.answer ? 1 : 0
      }
      setResult(result.isRight ? RESULT.SUCCESS : RESULT.FAILED)
      onComplete(result)

      //清空当前选择
      selectedRef.current = undefined
      finishedRef.current = true
      setFinished(true)
      setDisabled(true)
    }

  }

  // 没有确认按钮时，onSelect后立即onConfirm
  useEffect(() => {
    if(!disabled && !needConfirm){
      onConfirm()
    }
  }, [disabled])

  useEffect(() => {

    if(data) {
      setResult(RESULT.NONE)
      finishedRef.current = false
      setFinished(false)
      let options = data.options

      try{
        if(typeof options === 'string'){
          options = JSON.parse(data.options)
        }

        if(options && options.length){
          setList(options)
        }else{
          message.error({
            content: '题目解析错误'
          })
        }
      }catch(e){
        message.error({
          content: 'JSON解析错误'
        })
      }
    }
  }, [data])

  return (
    <>
      {result === RESULT.NONE && <div className="select-bar">
        <div className={classNames({
          options : true,
          //'one-column': list.length < 5
        })}>
          {list.map((item, index) =>
            <Option key={index} {...item} index={index} hasAnswer={hasAnswer} finished={finished} onSelect={onSelect}/>)}
        </div>

        {!!needConfirm && <div className="buttons">
          {!finished &&
            <div className={classNames({
              'btn': true,
              'btn-primary': true,
              disabled
            })} onClick={onConfirm}>提交</div>
          }
        </div>}
      </div>}
      <ResultBar result={result} />
    </>
  )
}

export default React.memo(SelectBar)
