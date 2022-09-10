
import GoboardPlayer from "./GoboardPlayer";
import {SgfMoveNode} from "./SgfTree"

/*
*
* AI点评用棋盘逻辑：
*
* isUserBranch: 当前在试下中
* inBranch: 当前在AI分支
*
* */
export default class GoboardQuizPlayer extends GoboardPlayer{

	// 玩家是否可操作黑白子：（自动应答题只能操作一方棋子，摆图题操作双方）
	// 主要影响确认落子逻辑
	isBothSides=false

  initEvents () {
		this.cb.onPlay((color, col, row) => {
			//创建节点
			const node = new SgfMoveNode(col, row, color);
			node.parent = this.currentNode;
      
			if(this.cb.options.playConfirm && 
				(this.isBothSides || (!this.isBothSides && this.cb.currentColor === this.whoFirst))){

        const d = this.prePlayData
        // 确认落子
        if(!!d && d.col === col && d.row === row && d.color === color) {
          this.prePlayData = null
          this.cb.hideHelperLine()
        }else{
          this.cb.showHelperLine(col, row)
          this.prePlayData = {node, col, row, color};
					this.emit('prePlay')
					return
        }
        
				// this.cb.showHelperLine(col, row)
				// this.prePlayData = {node, col, row, color};
				// return
			}
			//有棋子的地方不能落子，否则步数出问题
			if (!this.go.canPlay(col, row, color)) {
				return;
			}
			/**
			 *  不在分支上，用户落子，进入分支
			 */
			this.currentNode.children = [node];

			this.currentNode = node;

			this.currentStep += 1;

			this.move(node)

			this.onMove();
		});

		this.cb.onUpdateHelperLine((col, row) => {
			if(this.prePlayData){
				this.prePlayData.node.col = col
				this.prePlayData.node.row = row
				this.prePlayData.col = col
				this.prePlayData.row = row
			}
		})

		// 课堂标记
		this.cb.onMark(this.onMark)
	}

	afterAddStones(stones) {
		if(stones && stones.length){
			// this.clipBoard(stones)
		}
	}

	// 显示局部棋盘（根据sgf棋子分布区域裁剪）
	clipBoard (stones) {
		//计算棋盘显示边界
		let s1 = stones[0];
		let top = s1.row,
			bottom = s1.row,
			left = s1.col,
			right = s1.col;

		// 计算用户答案的棋盘显示边界
		for(let i = 0; i< stones.length; i++){
			const s = stones[i]
			// 暂不判断 pass
			let key = s.col + "," + s.row;

			if (s.row < top) {
				top = s.row;
			}
			if (s.row > bottom) {
				bottom = s.row;
			}
			if (s.col < left) {
				left = s.col;
			}
			if (s.col > right) {
				right = s.col;
			}
		}

		this.setViewBox(top, bottom, left, right);
	}

	setViewBox (top, bottom, left, right) {
		const cb = this.cb;
		// let offset = 4;
		// let width = cb.options.WIDTH;
		//
		// let unitNum = this.boardSize - 1

		//get bound columns & rows
		// top = top - offset < 0 ? 0 : top - offset;
		// bottom = bottom + offset > unitNum ? unitNum : bottom + offset;
		// left = left - offset < 0 ? 0 : left - offset;
		// right = right + offset > unitNum ? unitNum : right + offset;

		// console.log(top, bottom, left, right);

		cb.el.parentNode.classList.add('active')
		cb.el.style.transform = 'scale(1.8) translate(-230px,200px)'

		// let unit = cb.options.UNIT_LENGTH;
		//
		// //get bound positions
		// // originX（文字区 + 棋盘边缘）宽度, offsetX (dom实际宽度到 棋盘预设宽度640的偏移量)
		// let bound_left = left * unit + cb.originX + cb.offsetX;
		// let bound_top = top * unit + cb.originY + cb.offsetY;
		// let bound_right = right * unit + cb.originX + cb.offsetX;
		// let bound_bottom = bottom * unit + cb.originX + cb.offsetX;
		//
		// //是否显示棋盘边缘
		// let corner = 0;
		//
		// if (left === 0) {
		// 	bound_left = 0;
		// 	corner += 1;
		// }
		// if (top === 0) {
		// 	bound_top = 0;
		// }
		// if (right === unitNum) {
		// 	bound_right = width;
		// 	corner += 1;
		// }
		// if (bottom === unitNum) {
		// 	bound_bottom = width;
		// }
		//
		// const targetWidth = bound_right - bound_left;
		// const targetHeight = bound_bottom - bound_top;
		//
		//
		// cb.paper.setViewBox(bound_left, bound_top, targetWidth, targetHeight);
		//
		// console.log(bound_left, bound_top, targetWidth, targetHeight)
		// // 是否是纵向
		// let landscape = bottom - top > right - left;
		// // 局部棋盘放大倍数
		// let scale = cb.options.WIDTH / targetWidth;
		// // 最终局部棋盘纵横比
		// const ratio = targetHeight / targetWidth;
		//
		// this.resetParams(scale, landscape, ratio, left, top, right, bottom);
	}

	resetParams (scale, landscape, ratio, left, top, right, bottom) {
		const cb = this.cb;

		let newWidth = 400, newHeight;
		cb.el.style.width = newWidth + 'px';

		if (!landscape) {
			scale = scale / cb.options.WIDTH * newWidth;
			newHeight = newWidth * ratio;

			cb.el.style.height = newHeight+ 'px';
		} else {
			scale = scale / cb.options.WIDTH * newWidth;
			newHeight = newWidth * ratio;

			cb.el.style.height = newHeight+ 'px';
		}

		let unitNum = this.boardSize - 1
		let halfNum = unitNum / 2

		cb.REAL_UNIT_LENGTH = cb.options.UNIT_LENGTH * scale;
		let borderMargin = (cb.options.WIDTH - unitNum * cb.options.UNIT_LENGTH) / 2 * scale;

		if (left === 0) {
			cb.real_originX = borderMargin;
		} else {
			cb.real_originX = -left * cb.REAL_UNIT_LENGTH;
		}

		if (top === 0) {
			cb.real_originY = borderMargin;
		} else {
			cb.real_originY = -top * cb.REAL_UNIT_LENGTH;
		}

		cb.centerX = cb.real_originX + halfNum * cb.REAL_UNIT_LENGTH;
		cb.centerY = cb.real_originY + halfNum * cb.REAL_UNIT_LENGTH;

		cb.boundX1 = 0;
		cb.boundX2 = newWidth;
		cb.boundY1 = 0;
		cb.boundY2 = newHeight;
	}
}
