import {useState, useEffect, useRef} from 'react';

/*
* 屏幕比例适配, 用于Cocos内嵌webview页面
* 页面按1920x1080切图，等比例缩放
* */
export default function useScale(pageRef, width, height) {
  const [scale, setScale] = useState(1)
  const resizeTimer = useRef()

  width = width || 1920
  height = height || 1080
  const ratio = width / height

  // 自适应
  const doResize =() => {
    if(!pageRef.current){
      return
    }

    const {clientWidth, clientHeight} = pageRef.current

    if(clientWidth / clientHeight > ratio){
      setScale(clientHeight / height)
    }else{
      setScale(clientWidth / width)
    }
  }
  const resize = () => {
    resizeTimer.current && clearTimeout(resizeTimer.current)
    resizeTimer.current = setTimeout(() => {
      doResize()
    }, 300)
  }

  useEffect(() => {
    window.addEventListener('resize', resize)
    doResize()
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [pageRef])

  return scale
}