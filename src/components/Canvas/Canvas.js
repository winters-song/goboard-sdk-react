import React, {useRef, useImperativeHandle, useEffect, forwardRef} from "react";
import Draw from "./Draw";

/* props: visible, style, onShow, onHide */
function Canvas(props, ref) {
  const imgRef = useRef();
  const wrapRef = useRef();

  useEffect(() => {
    Draw.init(wrapRef.current);
  }, [wrapRef])

  useEffect(() => {
    if(!props.visible){
      clear()
      console.log("自动清除划线")
      props.onHide && props.onHide()
    }else{
      props.onShow && props.onShow()
    }
  }, [props.visible, wrapRef])

  /* 重置功能 */
  function clear() {
    Draw.clear();
  }

  function resize(options) {
    Draw.resize(options);
  }

  /* 导出 */
  function exp() {
    let exportImg = Draw.exportImg();
    console.log('exportImg: ', exportImg);
    if (exportImg === -1) {
      return console.log('please draw!');
    }
    imgRef.current.src = exportImg;
  }

  function getContainerSize() {
    if(wrapRef.current){
      return {
        width: wrapRef.current.clientWidth,
        height: wrapRef.current.clientHeight
      }
    }
    return null
  }


  useImperativeHandle(ref, () => {
    return {
      clear,
      resize,
      getContainerSize,
      exp
    }
  })

  return (
    <div className="canvas-wrap" ref={wrapRef} style={Object.assign({
      position: 'absolute',
      left: 0,
      right :0,
      top: 0,
      bottom: 0,
      display : props.visible ? 'block': 'none'
    }, props.style || {})} />
  );
}

export default React.memo(forwardRef(Canvas))