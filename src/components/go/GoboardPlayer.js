import Goboard from "./Goboard";
import {Go, Color} from "./Go";
import {SgfMoveNode, SgfNode, SgfTree} from "./SgfTree"
import EventEmitter from "events";
import Audio from  '../Audio/Audio'

// 音效
const map = new Map()
const list = [
	'playForbidden',
	'stone1',
	'stone2',
	'stone3',
	'stone4',
	'stone5',
	'eat1',
	'eat2'
]
list.forEach(item => {
	map.set(item, require(`../assets/sound/${item}.mp3`))
})

Audio.init()
Audio.loadEffects(map)

/*
*
* cfg:
*
*
* */
export default class GoboardPlayer extends EventEmitter{
	// 开启音效
	soundEnabled = true
	// 当前手数
	currentStep = 0
	// 主线缓存
	master = {}
	// 打谱历史
	history = []
	// 打谱分支历史
	history_branch = []

	boardOptions = {}

	constructor(cfg) {
		super()

		Object.assign(this, cfg, );

		// 默认19路棋盘
		if (!this.boardSize) {
			this.boardSize = 19;
		}
	}

	// fullSgf: 带有答案的sgf, 用于正确裁剪棋盘（避免答案部分被裁剪掉）
	// sgfTree, whoFirst, boardSize, fullSgf
	init (cfg, boardOptions) {
		if(!cfg.sgfTree){
			console.warn('缺少sgfTree')
			return
		}

		Object.assign(this, {
			currentStep: 0,
			root: cfg.sgfTree.root,
			currentNode: cfg.sgfTree.root
		},cfg)

		// this.fullSgfTree = cfg.fullSgf ? new SgfTree(cfg.fullSgf) : null

		this.el.innerHTML = '';

		this.createBoard(boardOptions);

		//渲染Added Stone
		this.addStones();

		this.setWhoFirst();
		this.initEvents();
		this.initTotalStep();
	}

	setWhoFirst () {
		this.cb.setClientColor(this.whoFirst);
		this.cb.setCurrentColor(this.whoFirst);
		this.cb.whoFirst = this.whoFirst;
		//设置go的先手
		this.go.startColor = this.whoFirst;
	}

	initEvents () {
		this.cb.onPlay((color, col, row) => {
			//创建节点
			const node = new SgfMoveNode(col, row, color);
			node.parent = this.currentNode;

			// 确认落子
			if(this.cb.options.playConfirm && this.cb.currentColor === this.whoFirst){
				this.cb.showHelperLine(col, row)
				this.prePlayData = {node, col, row, color};
				return
			}
			//有棋子的地方不能落子，否则步数出问题
			else if (!this.go.canPlay(col, row, color)) {
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

	onMark(mark, col, row) {
		const cb = this
		const key = col + "," + row

		if (!mark) {
			return
		}

		const current = cb.markers[key]
		if(current >= 'A' && current <='Z'){
			cb.removeMarker(col, row)
			cb.getNextMarker()
			cb.updateMarkerDummy(cb.nextMarker)
			return
		}

		cb.drawMarker(mark, col, row);
		console.log('mark', key, mark)

		cb.currentMarker = mark
		cb.getNextMarker()
		cb.updateMarkerDummy(cb.nextMarker)
	}

	// 确认落子
	onConfirm() {
		if (!this.prePlayData) {
			return
		}

		const {node, col, row, color} = this.prePlayData
		if (!this.go.canPlay(col, row, color)) {
			Audio.play('playForbidden')
			return;
		}
		// 真正落子后，隐藏候选落子
		this.cb.hideHelperLine()
		this.currentNode.children = [node];
		this.currentNode = node;
		this.currentStep += 1;
		this.move(node)
		this.onMove();

		this.prePlayData = null;
	}

	move (node, silent) {
		const eaten = this.go.play(node.col, node.row, node.color);

		if (null !== eaten) {
			this.cb.clientColor = this.cb.oppositeColor(this.cb.clientColor);
			this.cb.currentColor = this.cb.clientColor
			//有silent时 不执行showHead
			this.cb.add(node.color, node.col, node.row, silent);

			if (!silent && this.soundEnabled) {
				let rand = Math.round(1E4 * Math.random()) % 5;
				Audio.playEffect(`stone${rand + 1}`)
			}

			if (eaten.size) {
				const capures = [];
				eaten.forEach(function (vertex) {
					const arr = vertex.split(',');
					const item = {
						col: arr[0] * 1,
						row: arr[1] * 1
					};
					capures.push(item);
				});

				this.cb.eat(capures);

				if(this.soundEnabled){
					if(eaten.size <= 2){
						Audio.playEffect('eat1')
					}else{
						Audio.playEffect('eat2')
					}
				}
			}
		}

		return eaten
	}

	createBoard (boardOptions) {
		if(this.cb){
			this.cb.destroy()
		}

		const cfg = {
			el: this.el,
			boardSize: this.boardSize,
			// 开启调整尺寸，手机端做题坐标会偏移
			// resizable: false,

			readonly: false,
			clientColor: Color.BLACK,
			whoFirst: Color.BLACK,
			showOrder: true,
			showCoordinates: false,
		}
		Object.assign(cfg, this.boardOptions, boardOptions)

		this.cb = new Goboard(cfg);
		this.cb.clearBoard();

		this.go = new Go(this.boardSize);
	}

	toStart () {
		this.fastBackward(this.currentStep);
		this.cb.setCurrentColor();
		this.currentStep = 0;
	}

	toEnd () {
		let node = this.currentNode;
		let step = 0;
		while (node.children && node.children.length) {
			node = node.children[0];
			step++;
		}

		this.fastForward(step);

		this.cb.showHead();
	}

	onMove () {
		this.emit('move', {
			currentStep: this.currentStep,
			currentNode: this.currentNode,
			totalStep: this.totalStep
		});
	}

	/**
	 *  获得上一步树节点（父节点）
	 */
	getPrevNode () {
		let node = this.currentNode;
		while (node) {
			node = node.parent;
			if (!node || node instanceof SgfMoveNode) {
				break;
			}
		}
		return node;
	}

	/**
	 *  获得下一步树节点（子节点）
	 */
	getNextNode () {
		let node = this.currentNode;
		while (node) {
			node = node.children && node.children[0]
			if (!node || node instanceof SgfMoveNode) {
				break;
			}
		}
		return node;
	}

	goStep(step) {
		if(step === -1) {
			this.backward()
		}
		if(step === 1) {
			this.forward()
		}
		if(step < -1) {
			this.fastBackward(-step)
		}
		if(step > 1) {
			this.fastForward(step)
		}
	}

	/**
	 *  下一步
	 */
	forward (silent) {
		let node = this.getNextNode()
		if (!node) {
			return;
		}

		this.currentStep += 1;
		this.currentNode = node;

		this.move(node, silent);

		if (!silent) {
			this.onMove();
		}

		return true;
	}

	backward (silent) {
		if (this.currentStep <= 0) {
			return false;
		}

		this.currentStep -= 1;

		const node = this.currentNode;
		const moveResult = this.go.undo(1);
		this.cb.trace.pop();

		const key = node.col + "," + node.row;
		this.cb.removePiece(key);

		if (moveResult && moveResult.eated && moveResult.eated.size) {
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

	fastForward (step) {
		let counter = 0;

		for (let i = 0; i < step; i += 1) {
			if (this.forward(true)) {
				counter += 1;
			} else {
				break;
			}
		}

		this.cb.showHead();
		this.onMove();
		return counter;
	}

	fastBackward (step) {
		let counter = 0;

		for (let i = 0; i < step; i += 1) {
			if (this.backward(true)) {
				counter += 1;
			} else {
				break;
			}
		}

		this.cb.showHead();
		this.onMove();
		return counter;
	}

	addStones () {
		let stones = this.getTreeStones(this.sgfTree);

		stones.forEach( i => {
			// 暂不判断 pass
			let key = i.col + "," + i.row;

			if (!i.mark && !i.move) {
				this.cb.addPiece(key, i.col, i.row, i.color, -1);
				this.go.add(i.col, i.row, i.color);
			}
		});

		//后渲染字母，保证不被棋子盖住
		stones.forEach( i => {
			if (i.mark) {
				this.cb.drawMarker(i.mark, i.col, i.row);
			}
		});

		// if(this.fullSgfTree){
		// 	stones = this.getTreeStones(this.fullSgfTree);
		// }

		this.afterAddStones(stones)
	}

	// hooks
	afterAddStones() {}

	loadAnswer (cfg) {
		//本地保存解析结果
		if (cfg._traceAnswer) {
			cfg._traceAnswer.forEach(move => {
				let val = move.split(',');
				this.cb.onPlayCb.call(this.cb, val[2] * 1, val[0] * 1, val[1] * 1);
			});

			return !!cfg._traceAnswer.length;

		} else if (cfg.UserQuizAnswerSgf) {
			const sgf = cfg.UserQuizAnswerSgf;
			const tree = new SgfTree(sgf)
			const stones = this.getTreeStones(tree);

			stones.forEach(move => {
				this.cb.onPlayCb.call(this.cb, move.color, move.col, move.row);
			});

			return !!stones.length;
		}

		return false;
	}

	getTreeStones (tree) {
		this.stones = [];

		tree.walkTrunk(node => {
			//落子 或 答案
			if (node instanceof SgfMoveNode) {
				this.addMoveStone(node.col, node.row, node.color);
			}
			//添加多子 或 标记
			else if (node instanceof SgfNode) {
				//循环节点属性
				node.properties.forEach (prop => {

					switch (prop.name) {
						case "AB":
							this.addAddedStones(prop.values, Color.BLACK);
							break;
						case "AW":
							this.addAddedStones(prop.values, Color.WHITE);
							break;
						case "LB":
							this.addMarks(prop.values);
							break;
						case "CR": //circle 圆圈
							this.addSpecialMarks(prop.values, "〇");
							break;
						case "TR": //trangle 三角
							this.addSpecialMarks(prop.values, "▲");
							break;
						case "SQ": //square 方块
							this.addSpecialMarks(prop.values, "▣");
							break;
						case "MA": // 叉子
							this.addSpecialMarks(prop.values, "✕");
							break;
						default:
					}

				});
			}
		});

		return this.stones;
	}

	addMoveStone(col, row, color) {
		this.stones.push({
			col: col,
			row: row,
			color: color,
			move: true
		});
	}

	addAddedStones(values, color) {
		values.forEach(pos => {
			const json = this.getCoordinate(pos);
			json.color = color;
			this.stones.push(json);
		});
	}

	getCoordinate(pos) {
		return {
			col: pos[0].charCodeAt(0) - 97,
			row: pos[1].charCodeAt(0) - 97
		};
	}

		//{col: x, row: y, mark: 'A'}
	addMarks(values) {
		values.forEach(mark => {
			const arr = mark.split(':');
			const json = this.getCoordinate(arr[0]);

			json.mark = arr[1];

			if (arr[1] === "~{!o~}") {
				json.mark = "☆";
			}
			this.stones.push(json);
		});
	}

	addSpecialMarks(values, type) {
		values.forEach(pos => {
			const json = this.getCoordinate(pos);
			json.mark = type;
			this.stones.push(json);
		});
	}

	switchBoardSize (size) {
		this.boardSize = size
		this.el.innerHTML = '';

		// 保留之前棋盘状态（手数、坐标）
		const boardOptions = {}
		if(this.cb){
			boardOptions.showOrder = this.cb.options.showOrder
			boardOptions.showCoordinates = this.cb.options.showCoordinates
		}
		
		this.createBoard(boardOptions)
		this.initEvents()

		this.initSgfTree()
	}

	// 创建SgfTree, 计算totalStep
	initSgfTree (sgf) {
		if (!sgf) {
			sgf = '(;CA[utf-8]AP[MultiGo:4.4.4]SZ[' + this.boardSize + '])'
		}

		this.sgfTree = new SgfTree(sgf)
		this.root = this.sgfTree.root;

		this.initTotalStep()
		this.reset();
	}

	initTotalStep() {
		let step = 0;
		this.sgfTree.walkTrunk(function (node) {

			//落子 或 答案
			if (node instanceof SgfMoveNode) {
				step++;
			}
		});

		this.totalStep = step;
	}

	reset () {
		this.currentStep = 0;
		this.currentNode = this.root;

		this.blackCaptures = 0;
		this.whiteCaptures = 0;
		this.go = new Go(this.boardSize);
		this.cb.clearBoard();
		this.cb.clearMarkers();
		this.cb.setClientColor(Color.BLACK);

		this.setWhoFirst();

		//渲染Added Stone
		this.addStones();
	}

	// 新建棋盘
	newSgf (boardSize) {
		this.changeData(`(;CA[gb2312]AP[MultiGo:4.4.4]SZ[${boardSize||19}])`, Color.BLACK);
	}

	loadSgf (sgf, whoFirst) {
		this.changeData(sgf, whoFirst || Color.BLACK);
	}

	changeData (sgf, whoFirst) {
		const sgfTree = new SgfTree(sgf);

		// 根据SGF,自动切换当前棋盘大小
		let boardSize = sgfTree.root.getProperty('SZ');
		if (boardSize && boardSize.length) {
			boardSize = boardSize[0]*1;
		} else {
			boardSize = 19
		}

		// 保留之前棋盘状态（手数、坐标）
		const boardOptions = {}
		if(this.cb){
			boardOptions.showOrder = this.cb.options.showOrder
			boardOptions.showCoordinates = this.cb.options.showCoordinates
		}

		this.init({sgfTree, whoFirst: whoFirst || Color.BLACK, boardSize}, boardOptions);
	}

	// changeTheme(settings){
	// 	this.boardOptions.sizeSettings = settings
	//
	// 	this.cb && this.cb.changeTheme(settings)
	// }
	changeTheme(settings){
		Object.assign(this.boardOptions, settings)
		this.cb && this.cb.changeTheme(settings)
	}

	// 分屏课堂，教师发标记题，获取当前sgf
	// 标记放在最后一个节点上面（标记放root上后台生成图片不对）
	getSgfString() {
		if(!this.sgfTree){
			console.warn('no sgftree')
			return ''
		}
		let traceSgf =  "("+this.sgfTree.root.toSgf(['LB']);

		for(let i = 0 ;i < this.cb.trace.length;i++) {
			const step = this.cb.trace[i].split(',');
			const color = step[2]*1
	
			if(color !== SgfTree.COLOR_BLACK && color !== SgfTree.COLOR_WHITE){
				continue;
			}
			traceSgf+= ';'+SgfTree.fromInt(color)+'['+SgfTree.toGnuCo(step[0]*1, step[1]*1)+']';
		}

		// 如果有标记，添加标记
		let markerString = ''
		for(let i in this.cb.markers){
			
			const pos = i.split(',')
			markerString+= `[${SgfTree.toGnuCo(pos[0]*1, pos[1]*1)}:${this.cb.markers[i].attrs.text}]`
		}
		if(markerString){
			traceSgf += 'LB'+markerString
		}
		return traceSgf +")"
	}

	// 回到主线时恢复手数展示
	resumeOrder() {
		if (this.cb.options.showOrder === true) {
			this.cb.showOrder();
		}else if(this.cb.options.showOrder === 'last'){
			this.cb.showLastOrder();
		}
	}
}
