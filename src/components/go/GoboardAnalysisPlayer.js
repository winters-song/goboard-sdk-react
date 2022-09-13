
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
export default class GoboardAnalysisPlayer extends GoboardPlayer{

	initEvents () {
		this.cb.onPlay((color, col, row) => {

			//有棋子的地方不能落子，否则步数出问题
			if (!this.go.canPlay(col, row, color)) {
				return;
			}

			let node
			let index = this.getBranchIndex(col, row)
			if(index < 0){

				//创建节点
				node = new SgfMoveNode(col, row, color);
				node.parent = this.currentNode;
				//标记该节点为用户试下，backward时候判断此值，避免重复pop()
				node.isUserBranch = true;

				// 创建分支
				if(!this.currentNode.children){
					this.currentNode.children = [node]
				}else{
					this.currentNode.children.push(node)
				}
			}else{
				node = this.currentNode.children[index]
			}

			this.currentNode = node;

			// this.currentStep += 1;

			this.move(node)

			this.onMove();
		});

		// 课堂标记
		this.cb.onMark(this.onMark)
	}

	/*
	* 下一步是否存在该分支： 存在时返回分支index， 不存在返回index
	* */
	getBranchIndex(col, row){
		const children = this.currentNode.children
		if(children){
			for(let i = 0; i< children.length; i++){
				if(children.col === col && children.row === row){
					return i
				}
			}
		}
		return -1
	}

	// 进入试下
	enterUserBranch () {
		this.cb.setReadonly(false);
		// 第0步时，需要判断第一手颜色
		if(!this.cb.trace.length && this.sgfTree && this.sgfTree.root.children && this.sgfTree.root.children[0].color){
			this.cb.setCurrentColor(this.sgfTree.root.children[0].color);
		}else{
			this.cb.setCurrentColor();
		}
		this.cb.setClientColor(this.cb.currentColor);
		this.cb.updateDummyColor();

		//改变棋盘状态
		this.isUserBranch = true
		this.inBranch = true
		this.cb.branch = true;
		this.saveUserMaster();
		//存储分支起始位置
		this.cb.branchStep = this.master.branchStep;
		this.cb.hideOrder();
	}

	closeUserBranch() {
		this.toStart()
		this.isUserBranch = false
		this.inBranch = false
		this.cb.branch = false;
		this.cb.setReadonly(true)

		this.currentStep = this.master.branchStep
		this.resumeOrder()
	}

	enterAIBranch (index){
		// 进入分支前，先返回上一步
		this.backward(true);

		//改变棋盘状态
		this.cb.branch = true;
		this.inBranch = true

		this.saveAIMaster(index);
		//存储分支起始位置
		this.cb.branchStep = this.master.branchStep;
		this.cb.hideOrder();

		this.currentStep+=1;

		const node = this.currentNode.children[index];
		const lastNode = this.currentNode;

		this.currentNode = node;

		this.move(node);

		this.fastForward(30);

		this.emit('enterBranch', {
			currentNode: this.currentNode,
			lastNode
		})

	}

	closeAIBranch() {
		this.cb.branch = false;
		this.inBranch = false

		//恢复分支原主线序号(saveMaster时候为了保持Order正确，step少1)
		this.onJump(this.master.branchStep);
		this.currentStep = this.master.branchStep
		this.forward()

		this.resumeOrder()
	}

	// 保存进入分支前的主线节点
	saveUserMaster () {
		this.master = {
			branchNode: this.currentNode, //用于判定上一步是否到了分支第一步， 如果是第一步，则不可以退到上一步
			branchStep: this.currentStep, //用于退出分支时，恢复原来位置
		};
	}

	saveAIMaster (index) {
		this.master = {
			branchNode: this.currentNode.children[index], //用于判定上一步是否到了分支第一步， 如果是第一步，则不可以退到上一步
			branchStep: this.currentStep, //用于退出分支时，恢复原来位置
		};
	}

	/*
	* 上一步时，如果是试下，并且不是AI分支，删除当前节点。
	* */
	removeBranchNode(node){
		let index = node.parent.children.indexOf(node)
		node.parent.children.splice(index, 1)
	}

	toStart () {
		this.fastBackward(1000);
		this.cb.setCurrentColor();

		if(!this.isUserBranch){
			this.currentStep = 0;
		}
	}

	forward (silent) {
		let node = this.getNextNode()
		if (!node) {
			return;
		}

		if(!this.isUserBranch){
			this.currentStep += 1;
		}
		this.currentNode = node;

		this.move(node, silent);

		if (!silent) {
			this.onMove();
		}

		return true;
	}

	backward (silent) {

		if(this.isBranchFirst()){
			return;
		}

		if(!this.isUserBranch){
			if(this.currentStep <= 0 ) {
				return false;
			}
			this.currentStep-=1;
		}

		const node = this.currentNode;
		const moveResult = this.go.undo(1);
		this.cb.trace.pop();

		if(node.isUserBranch){
			this.removeBranchNode(node)
		}

		this.cb.removePiece(node.col + "," + node.row);

		if (moveResult && moveResult.eated && moveResult.eated.size > 0) {
			moveResult.eated.forEach(move => {
				this.cb.recoverPiece(move.col, move.row, move.color);
			});
		}

		if (this.cb.options.showOrder === 'last') {
			this.cb.showLastOrder();
		}

		this.cb.clientColor = node.color;
		this.cb.currentColor = node.color;

		this.currentNode = this.getPrevNode() || this.root;

		if (!silent) {

			if (this.currentNode instanceof SgfMoveNode) {
				this.cb.showHead();
			} else {
				this.cb.hideHead();
			}

			this.cb.updateDummyColor();
			this.onMove();
		}

		return true;
	}

	/**
	 *  上一步是否可点（已经到了分支第一步）
	 */
	isBranchFirst (){
		if( this.isUserBranch){
			// return this.currentNode == this.master.branchNode;
			if(this.currentNode === this.master.branchNode){
				return true;
			}else{
				return false;
			}
		}else if(this.inBranch){
			return this.currentNode === this.master.branchNode;
		}else {
			return false;
		}
	}

	/**
	 *  胜率图联动，切换手数
	 */
	onJump (step){
		// if(this.isUserBranch){
		// 	this.closeUserBranch();
		// }

		let offset = step - this.currentStep

		this.goStep(offset)
	}
}
