import React, {useEffect, useRef} from 'react';
import {loadScript} from "../../utils/utils";

/*
* 保利威视视频播放
* */
function Player (props) {
  const {vid} = props

  const playerRef = useRef()

  useEffect(() => {
    if(vid){
      if(!window.polyvPlayer){
        loadScript('https://player.polyv.net/script/player.js')
          .then(() =>{
            loadPlayer(vid);
          });
      }else{
        loadPlayer(vid);
      }
    }

    return () => {
      playerRef.current && playerRef.current.destroy();
    }
  }, [vid])


  const loadPlayer = (vid) => {
    if (playerRef.current) {
      playerRef.current.destroy();
    }
    playerRef.current = window.polyvPlayer({
      wrap: '.player',
      width: '100%',
      height: '100%',
      vid,
      allowFullscreen: false,
      hideSwitchPlayer: true,
      showHd: false,
      autoPlay: true,
      speed: false
    });

    //进度保存
    // setTimeout(() => {
    //   this.timer = setInterval(() => {
    //     Event.send('videoPosition', {videoPosition: this.player.j2s_getCurrentTime()})
    //   }, 3000)
    //
    //   this.player.j2s_seekVideo(Event.state.videoPosition || 0)
    //
    // },1000)
  }

  return (
    <div className="video-wrap">
      <div className="player"></div>
    </div>
  )
}

export default Player;
