
import GoboardPlayer from "./GoboardPlayer";
import Audio from "../Audio/Audio";
import {Color} from "./Go";

/*
*
* AI点评用棋盘逻辑：
*
* isUserBranch: 当前在试下中
* inBranch: 当前在AI分支
*
* */
export default class GoboardGamePlayer extends GoboardPlayer{

  // 不同于打谱工具，这里不改变clientColor
  move (node, silent) {
    const eaten = this.go.play(node.col, node.row, node.color);

    if (null !== eaten) {
      this.cb.currentColor = this.cb.oppositeColor(node.color)
      //有silent时 不执行showHead
      this.cb.add(node.color, node.col, node.row, silent);

      if (!silent && this.soundEnabled) {
        let rand = Math.round(1E4 * Math.random()) % 5;
        Audio.playEffect(`stone${rand + 1}`)
      }

      if (eaten.size) {
        const captures = [];
        eaten.forEach(function (vertex) {
          const arr = vertex.split(',');
          const item = {
            col: arr[0] * 1,
            row: arr[1] * 1
          };
          captures.push(item);
        });

        this.cb.eat(captures);

        if(this.soundEnabled){
          if(eaten.size <= 2){
            Audio.playEffect('eat1')
          }else{
            Audio.playEffect('eat2')
          }
        }

        if(node.color === Color.BLACK){
          this.blackCaptures += eaten.size
        }else{
          this.whiteCaptures += eaten.size
        }
      }
    }

    return eaten
  }

	initEvents () {
		this.cb.onPlay((color, col, row) => {

      // 确认落子，第二次落在相同位置，视为确认
      if(this.cb.options.playConfirm && this.cb.clientColor === color){
        const d = this.prePlayData
        if(!!d && d.col === col && d.row === row && d.color === color) {
          this.prePlayData = null
          this.cb.hideHelperLine()
        }else{
          this.cb.showHelperLine(col, row)
          this.prePlayData = {col, row, color};
          return
        }
			}
      
      this.emit('play', {color, col, row})
		});
    this.cb.onMarkDead((col, row) => {
      this.emit('markdead', {col, row})
    })
	}
}
