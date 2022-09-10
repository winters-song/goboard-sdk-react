
export default class Audio {

  static initialized = false
  static enabled = true

  static audios = {}

  static init() {
    if(this.initialized){
      return
    }
    let WebAudioContext = window.AudioContext || window.webkitAudioContext;

    this.context = new WebAudioContext();

    this.unlock()

    this.initialized = true
  }

  static unlock () {
    const unlockWebAudio =  () => {
      if (this.context.state !== "running") {
        this.context.resume();
      }
      document.body.removeEventListener("click", unlockWebAudio, true);
    };

    // unlock webaudio autoplay policy
    document.body.addEventListener("click", unlockWebAudio, true);
  }

  static loadEffects (map) {
    map.forEach((value, key) => {
      this.loadEffect(key, value)
    })
  }

  static async loadEffect (key, path){
    const effectRes = await fetch(path);
    const effectBuffer = await effectRes.arrayBuffer();

    this.context.decodeAudioData(effectBuffer, data => {
      this.audios[key] = data;
    }, e => {
      // reject(e);
    });
  }

  /**
   *  设置声音可用
   */
  static enable () {
    this.enabled = true
  }

  static disable(){
    this.enabled = false
  }

  /**
   *  播放声音
   * @param {String} name 文件名称
   * @param {Number} currentTime 播放起始位置
   */
  static play (name, when, offset, duration, volume) {
    if (this.enabled && this.audios[name]) {
      this.doPlay({ buffer: this.audios[name], when, offset, duration, volume });
    }
  }

  /**
   *  播放音效（默认音量 0.1）
   */
  static playEffect (name, when, offset, duration, volume) {
    this.play(name, when, offset, duration, volume || 0.2)
  }

  static doPlay ({buffer, when, offset, duration, volume, loop}) {

    // 调整播放音量
    const gainNode = this.context.createGain();
    // 默认为 1/2 的音量
    gainNode.gain.setValueAtTime(volume || 0.5, this.context.currentTime);
    gainNode.connect(this.context.destination);

    // this.gainNode.gain.setValueAtTime(volume || 0.5, this.context.currentTime);
    const sourceNode = this.context.createBufferSource();
    sourceNode.buffer = buffer;
    sourceNode.loop = loop || false;
    sourceNode.connect(gainNode);

    sourceNode.start(when, offset, duration);
    sourceNode.onended = function() {
      // 结束播放，清除
      sourceNode.buffer = null;
      sourceNode.disconnect();
    };
    return sourceNode
  }

  static playAsnyc (cfg, cb) {
    if (this.enabled && this.audios[cfg.name]) {
      const audio = this.doPlay({...cfg, buffer:this.audios[cfg.name]})
      cb && cb(audio)
    }else {
      let counter = 0
      let success = false

      let timer = setInterval(() => {
        if (counter >= 20){
          console.warn('播放音乐失败', cfg.name)
          clearInterval(timer)
          return
        }
        if (this.enabled && this.audios[cfg.name]) {
          const audio = this.doPlay({...cfg, buffer:this.audios[cfg.name]})
          cb && cb(audio)
          clearInterval(timer)
          return
        }
        counter++
      }, 500)
    }
  }

  static stop (sourceNode) {
    if(sourceNode){
      sourceNode.buffer = null;
      sourceNode.disconnect();
    }
  }
}