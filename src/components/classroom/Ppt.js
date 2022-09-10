import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react'
function Ppt (props, ref) {
  const {pptPosition, pptUrl, move} = props
  const [loading, setLoading] = useState(false)
  const iframeRef = useRef()
  const timerRef = useRef()

  useEffect(() => {
    if(pptUrl){
      setLoading(true)

      if(!iframeRef.current) {
        loadIframe(pptUrl)
      }else{
        updateIFrame(pptUrl)
      }
    }

    return () => {
      timerRef.current && clearInterval(timerRef.current)
    }
  }, [pptUrl])

  const updateIFrame = (url) => {
    iframeRef.current.contentWindow.location.href = url
  }

  function loadIframe (pptUrl) {
    const iframe = document.createElement("iframe");

    iframe.frameborder = 0
    iframe.id = 'ppt-iframe'
    iframe.src = pptUrl;
    //本地测试地址
    // iframe.src = 'http://127.0.01:5500/src/assets/mock/ppt1/index.html';
    iframe.setAttribute("frameborder", 0)
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    iframe.style.marginTop = 0
    iframe.onload = function () {
      iframe.contentWindow.document.querySelector('body').style.backgroundColor = '#181818'
      // iframe.contentWindow.document.domain = 'localhost'
      timerRef.current && clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        let $el = document.getElementById('ppt-iframe').contentWindow.document.querySelector('#loading')
        // pptResize()
        if ($el.className !== 'fade') {
          $el.click()
        } else {
          if (pptPosition) {
            window.frames[0].frame.restore(pptPosition)
            // event.send('pptPosition', { pptPosition: JSON.parse(pptPosition) })
            // event.emptyPptPosition()
          }
          // event.getPPTPage()
          pptResizeCss()
          setLoading(false)
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }, 400)

    };
    document.getElementById('ppt').appendChild(iframe);
    iframeRef.current = iframe
  }

  const pptResizeCss = () => {
    let child = window.frames[0]
    if(child && child.document) {
      child.screenWidth = child.document.documentElement.clientWidth
      child.screenHeight = child.document.documentElement.clientHeight
      child.main.style.margin = ""
    }
  }

  useImperativeHandle(ref, () =>({
    resize: pptResizeCss
  }))
  // const pptResize = () => {
  //   let timer
  //   window.addEventListener('resize', function () {
  //     timer && clearTimeout(timer);
  //     timer = setTimeout(function () {
  //       var frame = window.frames[0].frame
  //       if(!frame){
  //         return
  //       }
  //       pptResizeCss()
  //     }, 500)
  //   });
  // }

  return (
    <div id="ppt" >
      {
        loading &&
          <div id="ppt-mask" className="ppt-mask">
            <div className="lds-dual-ring"></div>
          </div>
      }
      <div className="ppt-forbid-click-mask" onClick={move}></div>
    </div>
  )
}

export default React.memo(forwardRef(Ppt))