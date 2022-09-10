

//options:page:
/*
* name: 埋点名称
* res: axios抛出的Error或接口返回值
* - message: Error报错信息或接口返回Message
* - stack: 如果是Error，会有错误堆栈信息
* - status: 如果是接口返回值，接口返回的Status
*
* options: 自定义字段
* - page: 所在页面
* - func: 当前方法名
* - params: 参数名+参数值
*
*
* */
export function trackError(name, res, options) {
  const cfg = {}

  const resType = Object.prototype.toString.call(res)
  // Error报错
  if(resType === '[object Error]'){
    cfg.message = res.message
    cfg.stack = res.stack
  }else if(res && res.Status){
    cfg.message = res.Message || res.message
    cfg.status = res.Status || res.code
  }else if(resType === '[object Object]'){
    try{
      cfg.message = JSON.stringify(res)
    }catch(e){
      return
    }
  }
  if(options){
    Object.assign(cfg, options)
  }

  window.zhuge.track(name, cfg);
}

// 加载脚本（用于加载保利威视js）
export function loadScript(src) {
  const headElement = document.head || document.getElementsByTagName('head')[0];
  const _importedScript = {};

  return new Promise((resolve, reject) => {
    if (src in _importedScript) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.onerror = err => {
      headElement.removeChild(script);
      reject(new URIError(`The Script ${src} is no accessible.`));
    }
    script.onload = () => {
      _importedScript[src] = true;
      resolve();
    }
    headElement.appendChild(script);
    script.src = src;
  })
}

export function getRandom(min, max) {
  return min + Math.random() * (max - min)
}

/*
* 不包含最大值
* getRandomInt(1, 100) => [1,99]
* */
export function getRandomInt(min, max) {
  return Math.floor(getRandom(min, max))
}
