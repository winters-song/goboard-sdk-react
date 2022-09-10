import Raphael from 'raphael'
// import $ from 'jquery'
import blackImg from '../assets/img/black.png'
import whiteImg from '../assets/img/white.png'

// import board9Img from './assets/goboard-9.png'
// import board13Img from './assets/goboard-13.png'
// import board19Img from './assets/goboard-19.png'
// import './assets/goboard.less'

// 棋子绘制
Raphael.fn.ball = function ({x, y, r, color, shadow, blackImg, whiteImg }) {
	let img = color === 1 ? blackImg : whiteImg;

	if(shadow){
		// return this.set(
		// 	this.circle(x, y + r / 6, r).attr({fill: "#000", stroke: "none", opacity: 0.2}),
		// 	this.image(img, x - r, y - r, 2*r, 2*r)
		// )
		const el = this.image(img, x - r, y - r, 2*r, 2*r)
		el.node.setAttribute('class', 'goboard-stone');
		return el;

	}else{
		return this.image(img, x - r, y - r, 2*r, 2*r)
	}

};


const shadow = "<svg width=\"100%\" height=\"100%\">\n" +
	"        <defs>\n" +
	"          <filter id=\"shadow\" x=\"-40%\" y=\"-40%\" width=\"180%\" height=\"180%\" filterUnits=\"userSpaceOnUse\">\n" +
	"            <feGaussianBlur in=\"SourceAlpha\" stdDeviation=\"1.5\"/>\n" +
	"            <feOffset dx=\"0\" dy=\"2\" result=\"offsetblur\"/>\n" +
	"            <feComponentTransfer>" +
	"            	<feFuncA type=\"linear\" slope=\"0.4\"/>" +
	"            </feComponentTransfer>" +
	"            <feMerge>\n" +
	"              <feMergeNode/>\n" +
	"              <feMergeNode in=\"SourceGraphic\"/>\n" +
	"            </feMerge>\n" +
	"          </filter>\n" +
	"        </defs>\n" +
	"      </svg>"

const BoardEvents = [
	{ key: 'mousedown', name: 'onMouseDown', handler: 'mouseDownHandler'},
	{ key: 'mouseup', name: 'onMouseUp', handler: 'mouseUpHandler'},
	{ key: 'mousemove', name: 'onMouseMove', handler: 'mouseMoveHandler'},
	{ key: 'touchstart', name: 'onTouchStart', handler: 'touchStartHandler'},
	{ key: 'touchend', name: 'onTouchEnd', handler: 'touchEndHandler'},
	{ key: 'touchmove', name: 'onTouchMove', handler: 'touchMoveHandler'}]


const STATES = {
	DEFAULT: 0,
	MARKER: 1,
	MARK_DEAD: 2,
}

// 星位坐标
const HOSHI = {
	9: [
		[2,2], [2,6], 
		[6,2], [6,6],
	],
	13: [
		[3,3], [3,9],
			 [6,6], 
		[9,3], [9,9],
	],
	19: [
		[3,3], [3,9], [3,15],
		[9,3], [9,9], [9,15],
		[15,3], [15,9], [15,15],
	]
}

const markerColor = '#ef4136'

export default class Goboard {

	initialized = false

	//是否在分支变化图上
	branch = false
	//分支起始步数
	branchStep = 0
	//变化图步数
	branchOrders = {}
	//sgf中默认添加的棋子数
	addedStoneNum = 0
	//当前棋子 key：col,row value:Piece
	pieces = {}
	//步数
	orders = {}
	//坐标
	coordinates = {}
	//目
	places = {}
	//字母标记
	markers = {}
	//投票
	votes = {}
	//历史踪迹 ，数据模型。"列行色"用逗号分隔，eg."4,3,0"
	trace = []

	currentColor = 1

	whoFirst = 1

	// 落子，标记 [null, 'marker']
	clickStatus = null

	currentMarker = null

	// 课堂移动端键盘输入，会导致布局重新计算
	resizeLock = false

	// 当前可落子，展示虚影
	myTurn = true

	options = {
		// aigame, class, history
		type: '',

		WIDTH : 640,
		BOARD_WIDTH: 598,
		PLACE_WIDTH: 10,
		//棋子半径
		// PIECE_RADIUS: 15,
		// UNIT_LENGTH: 20,
		stoneOpacity: 0.5,
		boardSize: 19,
		fontSize: 14,
		fontFamily: "'PingHei', 'PingFang SC', 'Helvetica Neue', 'Helvetica', 'STHeitiSC-Light', 'Arial', sans-serif",

		readonly: false,
		// 显示手数
		showOrder: false,
		// 显示坐标
		showCoordinates: false,
		//落子辅助线
		showHelperLines: false,
		// 落子确认
		playConfirm: false,
		// 音效
		sound: true,

		resizable: true,
		// 是否是启蒙课堂（启蒙默认不展示手数，分支也不展示）
		isKid: false,

		zoom: 1,

		position: 'c', //['t', 'c'] t: top, c: center

		// boardImg: board19Img,

		// 使用图片棋盘样式（false时为svg绘制）
		useBoardImg: true,
		// svg绘制棋盘时的棋盘背景图片
		svgBoardImg: null,
		// svg绘制棋盘时的样式
		style: {
			borderColor: "#C6732F",
			lineColor: "#C6732F",
			bgColor: "#F9dd98"
		},

		stoneShadow: true,

		coordinateColor: '#fff',

		sizeSettings: {
			9: {
				PIECE_RADIUS: 30,
				UNIT_LENGTH: 65,
				fontSize: 20,
				markerSize: 30,
				// boardImg: board9Img
			},
			13: {
				PIECE_RADIUS: 20,
				UNIT_LENGTH: 46.4,
				fontSize: 16,
				markerSize: 26,
				// boardImg: board13Img
			},
			19: {
				PIECE_RADIUS: 14,
				UNIT_LENGTH: 31,
				fontSize: 14,
				markerSize: 22,
				// boardImg: board19Img
			}
		}
	}

	constructor(cfg) {
		this.el = cfg.el;

		window.Goboard = this

		Object.assign(this.options, cfg);

		this.blackImg = cfg.blackImg || blackImg;
		this.whiteImg = cfg.whiteImg || whiteImg;

		this.clientColor = this.options.clientColor || 1;
		this.whoFirst = this.options.whoFirst;

		this.init();
	}

	init () {
		this.initPaper();
		// 棋盘比例、位置初始化
		this.initPosition();
		// 创建棋盘辅助中心点
		this.initHelper();
		// 初始化单元格宽度、偏移量
		this.initParams();

		this.initChessBoard();

		this.initPieces();

		this.initCoordinates();

		if(this.options.showHelperLines){
			this.createHelperLines();
		}
		this.initEvents();

		this.setReadonly(this.options.readonly);
	}

	initPaper(){
		// 配置棋盘路数相关设置
		const size = this.options.boardSize;
		Object.assign(this.options, this.options.sizeSettings[size]);
		// 设置宽高
		this.height = this.width = this.options.WIDTH;

		this.el.style.width = this.width;
		this.el.style.height = this.height;

		this.paper = Raphael(this.el, this.width, this.height);
		this.paper.setViewBox(0, 0, this.options.WIDTH, this.options.WIDTH);
		this.paper.setSize('100%', '100%');
		// $(this.paper.canvas).append($(shadow))

	}

	initPosition (){
		this.width = this.el.parentNode.clientWidth
		this.height = this.el.parentNode.clientHeight

		// 中心到边界格数
		const grids = (this.options.boardSize - 1) / 2;
		//（文字区 + 棋盘边缘）宽度
		this.originX = this.options.WIDTH / 2 - grids * this.options.UNIT_LENGTH;
		this.originY = this.options.WIDTH / 2 - grids * this.options.UNIT_LENGTH;

		const width = this.options.WIDTH;
		let ratio;

		//fit height
		if(this.width >= this.height){

			this.width = this.height;
			ratio = width / this.height;
			this.offsetX = (this.width - width)/ 2 - (this.width - this.height)/ 2 * ratio;
			this.offsetY = -(width - this.height) / 2;
		}else{
			this.height = this.width;
			ratio = width / this.width;
			this.offsetX = -(width - this.width) / 2;
			this.offsetY = (this.height - width)/ 2 - (this.width - this.height)/2 * ratio;
		}

		this.el.style.width = this.width +'px'
		this.el.style.height = this.height +'px'

		const dw = this.width * ratio;
		const dh = this.height * ratio;
		this.paper.setViewBox(this.offsetX, this.offsetY, dw, dh);

		// if(me.options.position === 'c'){
		// 	var screen_width = me.$el.parent().width();
		// 	// var screen_height = $(window).height();

		// 	var offsetX = (screen_width - me.width) / 2;
		// 	me.el.style.marginLeft =  offsetX
		// }

	}

	initHelper () {
		const x = this.width / 2;
		this.pivot = this.paper.circle(x, x, 0);
		this.pivot.attr('id', 'pivot');
	}

	initParams () {
		const ratio = this.width / this.options.WIDTH;
		// 中心到边界格数
		const grids = (this.options.boardSize - 1) / 2;
		const half = this.options.BOARD_WIDTH * ratio / 2;

		this.REAL_UNIT_LENGTH = this.options.UNIT_LENGTH * ratio;
		this.centerX = this.width / 2;
		this.centerY = this.height / 2;
		//real_origin: 实际(0,0)点坐标
		this.real_originX = this.centerX - grids * this.REAL_UNIT_LENGTH;
		this.real_originY = this.centerY - grids * this.REAL_UNIT_LENGTH;

		this.boundX1 = this.centerX - half;
		this.boundX2 = this.centerX + half;
		this.boundY1 = this.centerY - half;
		this.boundY2 = this.centerY + half;
	}

	// 使用棋盘图片或绘制棋盘
	initChessBoard () {
		const width = this.options.BOARD_WIDTH;
		const x = this.centerX - width / 2;
		const y = this.centerY - width / 2;

		// 带线棋盘图
		if(this.options.useBoardImg){
			this.boardMesh = this.paper.image(this.options.boardImg, x, y, width, width);
		}else{
			const {lineColor, borderColor, bgColor, kid} = this.options.style

			if(this.drawCache){
				this.clearDrawCache()
			}
			this.drawCache = this.paper.set();


			// 背景图
			if(this.options.svgBoardImg) {
				this.boardMesh = this.paper.image(this.options.svgBoardImg, x, y, width, width);
			}else{
				// 背景色
				this.boardMesh = this.paper.rect(x, y, width, width, width / 20)
				this.boardMesh.attr({
					fill: kid ? lineColor: bgColor,
					stroke: borderColor,
					'stroke-width': '5px'
				})
			}
			this.drawCache.push(this.boardMesh)



			// 1线
			const x0 = this.originX + this.offsetX
			const y0 = this.originY + this.offsetY
			const innerWidth = this.options.UNIT_LENGTH * (this.options.boardSize - 1)
			const border = this.paper.rect(x0, y0, innerWidth, innerWidth)
			.attr({
				stroke: lineColor || borderColor,
				'stroke-width': 2,
				fill: kid ? bgColor: 'none'
			})

			this.drawCache.push(border)

			for(let i=1; i< this.options.boardSize - 1; i++ ){
				const pos = this.getHelperLinePos(i,i);
				const lineX = this.paper.path(pos[0]).attr({
					stroke: lineColor || borderColor,
					'stroke-width': 2
				});
				const lineY = this.paper.path(pos[1]).attr({
					stroke: lineColor || borderColor,
					'stroke-width': 2
				});
				this.drawCache.push(lineX)
				this.drawCache.push(lineY)
			}

			// 星位
			const hoshi = HOSHI[this.options.boardSize]
			if(hoshi){
				for(let i=0; i< hoshi.length; i++ ){
					const x = hoshi[i][0] * this.options.UNIT_LENGTH + this.offsetX + this.originX
					const y = hoshi[i][1] * this.options.UNIT_LENGTH + this.offsetY + this.originY
					const dot = this.paper.circle(x, y, 6).attr({
						fill: lineColor || borderColor,
						'stroke-width': 0
					});
					this.drawCache.push(dot)
				}
			}

			this.drawCache.toBack();
			border.toBack();
			this.boardMesh.toBack();
		}
	}

	clearDrawCache() {
		if(this.drawCache){
			this.drawCache.remove()
		}
		// if(this.drawCache && this.drawCache.length){
		//
		// 	for(let i = 0; i< this.drawCache.length; i++) {
		// 		this.drawCache[i].remove()
		// 	}
		// }
	}


	initPieces () {
		this.dummy = this.paper.circle(0, 0, this.options.PIECE_RADIUS *0.95).attr({
			fill: 'black',
			stroke: "none",
			opacity: this.options.stoneOpacity
		});

		const path = this.getHeadPath()
		this.head = this.paper.path(path).attr({fill: "white", stroke: "none"}).hide();
	}

	getHeadPath (){
		const r = this.options.PIECE_RADIUS
		//"M0 0L90 0L0 90Z"
		const path = [
			"M" + r + " " + r,
			"L" + r *2 + " " + r,
			"L" + r + " " + r *2,
			"Z"
		].join('')

		return path
	}

	/**
	 *  坐标省略I(容易歧义), 纵坐标从下至上
	 */
	initCoordinates () {

		let alpha;
		if(this.options.boardSize === 9){
			alpha = 'ABCDEFGHJ';
		}else if(this.options.boardSize === 13){
			alpha = 'ABCDEFGHJKLMN';
		}else{
			alpha = 'ABCDEFGHJKLMNOPQRST';
		}

		//坐标文本上下左右基线坐标
		// 坐标到棋盘距离
		const distance = 13
		const colYT = this.centerY - (this.options.BOARD_WIDTH / 2) - distance;
		const colYB = this.centerY + (this.options.BOARD_WIDTH / 2) + distance;
		const colXL = this.centerX - (this.options.BOARD_WIDTH / 2) - distance;
		const colXR = this.centerX + (this.options.BOARD_WIDTH / 2) + distance;

		let cfg = {
			'font-size': this.options.fontSize,
			'font-weight': 200,
			'font-family': 'Arial',
			'fill': this.options.coordinateColor
		};

		let text;

		for(let i = 0; i < this.options.boardSize; i++){
			let x = (i - Math.floor(this.options.boardSize/2)) * this.options.UNIT_LENGTH + this.centerX;

			text = this.createText(x, colYT, alpha[i], cfg);
			this.coordinates['ct'+i] = text;

			text.node.setAttribute('class', 'coordinate-text top');

			text = this.createText(x, colYB, alpha[i], cfg);
			this.coordinates['cb'+i] = text;
			text.node.setAttribute('class', 'coordinate-text bottom');

			let y = (i - Math.floor(this.options.boardSize/2)) * this.options.UNIT_LENGTH + this.centerY;

			text = this.createText( colXL, y, this.options.boardSize - i, cfg);
			this.coordinates['rl'+i] = text;
			text.node.setAttribute('class', 'coordinate-text left');

			text = this.createText( colXR, y, this.options.boardSize - i, cfg);
			this.coordinates['rr'+i] = text;
			text.node.setAttribute('class', 'coordinate-text right');
		}
	}

	/*
	* 创建辅助线
	* */
	createHelperLines () {
		let col, row, pos;
		col = row = Math.floor(this.options.boardSize / 2)

		this.helperLinePos = [col, row]
		pos = this.getHelperLinePos(col, row)

		const color = '#FF6827'

		this.helperLineX = this.paper.path(pos[0]).attr({
			stroke: color,
			'stroke-width': 3
		}).hide();
		this.helperLineY = this.paper.path(pos[1]).attr({
			stroke: color,
			'stroke-width': 3
		}).hide();

		let r = this.options.PIECE_RADIUS
		const x = this.originX - r
		const y = this.originY - r

		this.helperLineCircle = this.paper.circle(0, 0, this.options.PIECE_RADIUS).attr({
			stroke: color,
			'stroke-width': 4
		}).hide()
		this.helperLineDummy = this.paper.image(this.blackImg, x, y, 2*r, 2*r ).hide().attr({
			opacity: 0.85
		})
		// window.helperLineDummy = this.helperLineDummy
	}

	updateHelperLines (col, row) {
		this.helperLinePos = [col, row]
		let pos = this.getHelperLinePos(col, row)

		const x = col * this.options.UNIT_LENGTH + this.originX + this.offsetX;
		const y = row * this.options.UNIT_LENGTH + this.originY + this.offsetY;
		this.helperLineCircle.attr({ cx : x , cy: y });
		this.helperLineDummy.attr({x : x - this.options.PIECE_RADIUS, y: y - this.options.PIECE_RADIUS});

		this.helperLineX.attr("path", pos[0])
		this.helperLineY.attr("path", pos[1])
	}

	getHelperLinePos (col, row) {
		let x0 = this.originX + this.offsetX
		let y0 = this.originY + this.offsetY
		let len = (this.options.boardSize - 1) * this.options.UNIT_LENGTH
		let w = x0 + len
		let h = y0 + len

		let x = col * this.options.UNIT_LENGTH + x0;
		let y = row * this.options.UNIT_LENGTH + y0;

		let StrX = [
			"M" + x + " " + y0,
			"L" + x + " " + h
		].join('');

		let StrY = [
			"M" + x0 + " " + y,
			"L" + w + " " + y
		].join('');

		return [StrX, StrY]
	}

	moveHelperLine(x, y) {
		const col = this.helperLinePos[0] + x
		const row = this.helperLinePos[1] + y
		const size = this.options.boardSize
		if(col >= 0 && col < size && row >=0 && row < size){
			this.updateHelperLines(col, row)
			this.onUpdateHelperLineCb.call(this, col, row);
		}
	}

	createText (x, y, text, cfg){
		const node = this.paper.text( x, y, text).attr(cfg);

		if(!this.options.showCoordinates){
			node.hide();
		}
		return node;
	}

	setCoordinateColor (color) {
		for(let i = 0; i < this.options.boardSize; i++){
			this.coordinates['c'+i].attr('fill', color);
			this.coordinates['r'+i].attr('fill', color);
		}
	}

	// 获取棋子颜色
	getStoneColor (color) {
		return color === 2 ? "white" : "black"
	}

	setImageByColor(el, color) {
		el.attr({
			src: color === 1 ? this.blackImg: this.whiteImg
		})
	}

	updateDummyColor () {
		this.myTurn = this.currentColor === this.clientColor;

		if(this.myTurn){
			this.setDummyColor(this.currentColor)
		}
	}

		/**
		 * 落黑子，白子，交替落子切换时，手动改变虚影颜色
		 */
	setDummyColor (color){
		let c = this.getStoneColor(color);

		this.dummy.attr({
			fill: c
		});

		if(this.options.showHelperLines) {
			this.setImageByColor(this.helperLineDummy, color)
		}
	}

	initEvents () {
		if(this.initialized){
			return
		}
		this.initialized = true;

		this.intersects = false;
		this.mouse = {
			x: 0,
			y: 0
		};
		this.mouse_co = {
			col: 0,
			row: 0
		};

		BoardEvents.forEach(item => {
			this[item.handler] = this[item.name].bind(this)
			this.paper.canvas.addEventListener(item.key, this[item.handler])
		})

		this.paper.canvas.addEventListener('mouseleave', () => {
			if(this.dummy && !this.helperShowed) {
				this.dummy.hide()
			}
		})

		if(this.options.resizable){
			this.resizeHandler = this.onResize.bind(this)
			window.addEventListener('resize', this.resizeHandler)
		}

		this.onPlay((color, col, row) => {
			if(col>=0 && col< this.options.boardSize && row>=0 && row < this.options.boardSize){
				this.add(1, col, row, false);
				this.setCurrentColor(1)
			}
		});
	}

	onResize () {
		if(this.resizeLock){
			return
		}

		this.resizeTimer && clearTimeout(this.resizeTimer)

		this.resizeTimer = setTimeout(() => {
			this.width = this.el.parentNode.clientWidth * this.options.zoom;
			this.height = this.el.parentNode.clientHeight * this.options.zoom;

			if(this.width > this.height){
				this.width = this.height;
			}else{
				this.height = this.width;
			}
			this.el.style.width = this.width + 'px'
			this.el.style.height = this.width + 'px'

			this.initParams();
		}, 200)
	}

	checkIntersection (e) {

		this.mouse.x = e.offsetX
		this.mouse.y = e.offsetY
		// this.mouse.x = e.offsetX - this.el.offsetLeft + window.pageXOffset;
		// this.mouse.y = e.offsetY - this.el.offsetTop + window.pageYOffset;

		let dummy

		switch (this.clickStatus){
		case 'marker':
			dummy = this.markerDummy;
			break;
		default:
			dummy = this.dummy;
			break;
		}

		if (this.mouse.x > this.boundX1 && this.mouse.x < this.boundX2 && this.mouse.y > this.boundY1 && this.mouse.y < this.boundY2 ) {

			const col = Math.round((this.mouse.x - this.real_originX) / this.REAL_UNIT_LENGTH);
			const row = Math.round((this.mouse.y - this.real_originY) / this.REAL_UNIT_LENGTH);

			// console.log(col, row);
			if(col >=0 && col < this.options.boardSize && row >=0 && row < this.options.boardSize){
				const x = col * this.options.UNIT_LENGTH + this.originX + this.offsetX;
				const y = row * this.options.UNIT_LENGTH + this.originY + this.offsetY;
				this.mouse_co.col = col;
				this.mouse_co.row = row;

				switch (this.clickStatus){
				case 'marker':
					dummy.attr({x, y});
					break;
				default:
					dummy.attr({cx: x, cy: y});
				}

				this.intersects = true;
			}

			if(this.myTurn && STATES.MARK_DEAD !== this.boardStatus){
				dummy.show();
			} else {
				dummy.hide();
			}

		} else{

			this.intersects = false;
			if(!this.helperShowed){
				dummy.hide();
			}
		}
	}

	shoot () {
		const {col, row} = this.mouse_co;

		if(this.clickStatus === 'marker'){
			this.onMarkCb.call(this, this.currentMarker, col, row);
		}else if(this.clickStatus === 'markdead'){
			this.onMarkDeadCb.call(this, col, row);
		}else{
			this.onPlayCb.call(this, this.currentColor, col, row);
		}
	}

	markDead () {
		this.onMarkDeadCb.call(this, this.mouse_co.col, this.mouse_co.row);
	}

	onMark (cb) {
		this.onMarkCb = cb;
		return this;
	}

	onPlay (cb) {
		this.onPlayCb = cb;
		return this;
	}

	onMarkDead (cb) {
		this.onMarkDeadCb = cb;
		return this;
	}

	onUpdateHelperLine (cb) {
		this.onUpdateHelperLineCb = cb;
		return this;
	}

	/**
	坐标 to 围棋列行
	*/
	ph2go (x, y) {
		const col = x / this.options.UNIT_LENGTH + 9;
		const row = y / this.options.UNIT_LENGTH + 9;

		return [col, row];
	}
	/**
	围棋列行 to 坐标
	*/
	go2ph (col, row) {
		const x = col * this.options.UNIT_LENGTH + this.originX + this.offsetX;
		const y = row * this.options.UNIT_LENGTH + this.originY + this.offsetY;

		return [x, y];
	}

	/*** GO Logics ***/
	parsePlay (p) {
		return {
			vertex : p.substring(0,p.lastIndexOf(',')) ,
			color : 1*p.substring(p.lastIndexOf(',')+1)
		};
	}

	parseVertex (vertex) {
		let c = vertex.split(',');
		return {col:c[0]*1 , row:c[1]*1};
	}

	makeVertex (col , row) {
		return col+","+row;
	}

	oppositeColor (color) {
		if(1 === color){
			return 2;
		}
		return 1;
	}

	isReadonly (){
		return this.options.readonly;
	}

	/*
	* 自动应答题，辅助线
	* */
	showHelperLine(col, row) {
		if(this.options.readonly){
			return
		}
		if(this.options.showHelperLines){
			this.updateHelperLines(col, row)
			this.helperLineX.show()
			this.helperLineY.show()
			this.helperLineCircle.show()
			this.helperLineDummy.show()

			this.helperShowed = true;
			//将Head标识放于图层最上方
			// this.paper.canvas.appendChild(this.dummy.node);
		}
	}

	hideHelperLine() {
		this.helperLineX.hide()
		this.helperLineY.hide()
		this.helperLineDummy.hide()
		this.helperLineCircle.hide()
	}

	onMouseDown (e){
		// this.onStartHelperLine(e)
	}

	onTouchStart (e){
		// this.onStartHelperLine(e)
	}


	onMouseUp (e) {
		// if(this.helperShowed && this.options.showHelperLines){
		// 	this.helperLineX.hide()
		// 	this.helperLineY.hide()
		// 	this.helperShowed = false;
		// }
		if(this.options.readonly){
			return
		}
		this.onPlayStone(e)
	}

	onTouchEnd (e) {
		e.preventDefault();
		if(this.options.readonly){
			return
		}
		// if(this.helperShowed && this.options.showHelperLines){
		// 	this.helperLineX.hide()
		// 	this.helperLineY.hide()
		// 	this.helperShowed = false;
		// }
    // touch事件不提供offset，需要自行计算
		const touch = e.changedTouches[0]
    const rect = this.paper.canvas.getBoundingClientRect()
		const scale = this.getScale(this.paper.canvas, 1)
    touch.offsetX = (touch.clientX - rect.left)/ scale
    touch.offsetY = (touch.clientY - rect.top)/ scale

		this.onPlayStone(touch)
	}

	// 手机端，棋盘存在transform缩放
	getScale(node, current) {
		
		if(node && node.style && node.style.transform){
			let reg = node.style.transform.match(/scale\((\S+)\)/)
			if(reg.length >=2){
				return this.getScale(node.parentNode, (reg[1]*1) * current) 
			}
		}else if(node.parentNode){
			return this.getScale(node.parentNode, current)
		}else {
			return current
		}
	}

	onMouseMove (e){
		if(this.options.readonly){
			return
		}
		// 减少触发次数
		if(!this.moveCounter){
			this.moveCounter = 0
			this.checkIntersection(e);
		}else{
			this.moveCounter++;
			if(this.moveCounter >10){
				this.moveCounter = 0
			}
		}
	}

	onTouchMove (e){
		// if(this.options.readonly){
		// 	return
		// }
		// var touch = e.changedTouches[0]
		// this.checkIntersection(touch);
	}

	setReadonly (b){
		this.options.readonly = b;

		if(b){
			this.dummy.hide();
		}else{
			this.helperShowed = false;
		}
	}

	onPlayStone (e) {
		this.checkIntersection(e);

		//@字母、数字标记 drawMarker blablabla
		if(typeof this.clientColor === 'number' && this.clientColor!== this.currentColor) {
			return;
		}

		if(this.intersects){
			this.shoot();
		}
	}


	setMarkDead (b) {
		if(!b){
			this.clearTerritoryMarkers();
		}
	}

	add (color, col, row, silent) {
		let key = col + "," + row;

		//push to history
		this.trace.push( key + "," + color);

		if( col > this.options.boardSize || row > this.options.boardSize){
			return false;
		}
		if(this.pieces[key]) {
			return false;
		}
		if(-1 !== col && -1 !== row) {

			this.addPiece(key, col, row, color);

			if(!silent){
				// 最后一手棋标志
				this.showHead();
			}
		}

		this.currentColor = this.oppositeColor(color);

		if(!this.isReadonly()){
			this.updateDummyColor();
		}
		return true;
	}

	addPiece (key, col, row, color, order, isRecover) {
		let co = this.go2ph(col,row);

		this.pieces[key] = this.paper.ball({
			x: co[0],
			y: co[1],
			r: this.options.PIECE_RADIUS,
			color,
			shadow: this.options.stoneShadow,
			blackImg: this.blackImg,
			whiteImg: this.whiteImg
		});

		//puzzle
		if(order && order< 0){
			return;
		}
		//主线手数
		let stepText;
		let orderMain = order ? order : this.trace.length - this.addedStoneNum;

		if(orderMain <= 0){
			return;
		}

		stepText = this.paper.text(co[0], co[1], orderMain).attr({
			'font-size': this.options.fontSize,
			'font-family': this.options.fontFamily,
			overflow: 'hidden',
			fill: color === 1 ? '#fff' : '#000'
		});
		this.orders[key] = stepText;

		//分支或者不显示手数时，隐藏手数
		if(!this.options.showOrder || this.branch){
			stepText.hide();
		}
		//显示最后一手，隐藏上一个手数
		if(this.options.showOrder === 'last' && !this.branch){
			this.lastStepText && this.lastStepText.hide();
			//上一步时，添加吃掉的子，这些子不展示手数
			if(isRecover){
				stepText.hide();
			}else{
				this.lastStepText = stepText.show();
			}

		}

		//分支手数
		if(this.branch){

			if(order){
				order -= this.branchStep;
			}else{
				order = this.trace.length - this.branchStep;
			}

			if(order<1){
				return;
			}

			stepText = this.paper.text(co[0], co[1], order).attr({
				'font-size': this.options.fontSize,
				'font-family': this.options.fontFamily,
				overflow: 'hidden',
					fill: color === 1 ? '#fff' : '#000'
			});
			this.branchOrders[key] = stepText;

			if(this.options.isKid){
				//分支或者不显示手数时，隐藏手数
				if(!this.options.showOrder){
					stepText.hide();
				}
			}
		}
	}

	removePiece (key) {
		if(this.pieces[key]) {
			this.pieces[key].remove();
			delete this.pieces[key];
		}

		if(this.orders[key]){
			this.orders[key].remove();
			delete this.orders[key];
		}

		if(this.branchOrders[key]){
			this.branchOrders[key].remove();
			delete this.branchOrders[key];
		}
	}

	//puzzle: add color
	recoverPiece (col, row, color){
		//校验，复原的棋子是否在历史中存在，通过倒序查找获得被吃子的序号
		let m, key,i;

		for(i = this.trace.length-1;i>=0 ;i--){
			// indexOf '15,1' -> '15,18','15,17'...
			// indexOf '15,1,' -> '15,1,'
			if(0 === this.trace[i].indexOf(col+','+row + ',')) {
				m = this.trace[i];
				break;
			}
		}

		if(!m){
			//puzzle
			key = col + ',' + row;
			this.removePiece(key);
			this.addPiece(key, col, row, color, -1);
		} else{
			let parts = m.split(',');
			color = parts[2]*1;
			key = parts[0]+','+parts[1];

			this.removePiece(key);
			this.addPiece(key, col, row, color, i+1 - this.addedStoneNum, true);
		}

	}

	showHead () {
		let lastMove = this.getLastMove();

		if(lastMove){
			let goCo = this.parseVertex(lastMove.vertex);
			let phCo = this.go2ph(goCo.col , goCo.row);

			//将Head标识放于图层最上方
			this.paper.canvas.appendChild(this.head.node);

			let color = lastMove.color;
			let headColor, x, y;

			//显示手数时
			// console.log(this.options.showOrder)
			if(this.options.showOrder || this.branch){
				//黑-红，白-蓝
				if(color === 1){
					headColor = markerColor
				}else{
					headColor = 'blue'
				}

				x = phCo[0] - this.options.PIECE_RADIUS * 2.1;
				y = phCo[1] - this.options.PIECE_RADIUS * 2.1;
				this.head.transform("t" + x + "," + y + 's0.7,0.7');
			}else{
				headColor = this.getStoneColor(this.oppositeColor(color))

				x = phCo[0] - this.options.PIECE_RADIUS;
				y = phCo[1] - this.options.PIECE_RADIUS;
				this.head.transform("t" + x + "," + y);
			}

			this.head.attr('fill', headColor);
			this.head.show();
		}else{
			this.head.hide();
		}
	}

	hideHead (){
		this.head.hide();
	}

	/**
	-1:no piece
	0:black
	1:white
	load go data

	history : ['0,3,0','13,3,1']
	stones :  exists stones ,{"col,row":color}, eg. {"9,3":0,"9,9":0,"15,9":0}
	*/
	load ( history, stones) {
		if(!history ){
			return;
		}
		this.hideHead();
		this.trace = history;
		this.removeAllPieces();
		this.rebuildPieces(stones);

		this.setCurrentColor();
	}

	// iqidao 1.0
	loadFromGo (history , stones) {
		let h = [];
		let i
		for(i =0 ;i < history.length ;i++) {
			h.push(history[i].col+","+history[i].row+","+history[i].color+","+(history[i].isAdded?1:0));
		}
		let s = {};
		let cols = stones.split(',');
		for(i = 0 ;i < cols.length;i++) {
			for(let j=0 ;j<cols[i].length;j++){
				if(0 === cols[i][j]*1) {
					continue;
				}
				s[i+","+j] = cols[i][j]*1;
			}
		}

		this.history = history;
		this.stones = s;

		this.load(h , s);
	}

	showOrder () {
		if(this.boardStatus === STATES.MARK_DEAD){
			return
		}
		//分支变化图时不显示手数
		if(this.branch){
			for(let k in this.branchOrders) {
				this.branchOrders[k].show();
			}
			return;
		}

		for(let k in this.orders) {
			this.orders[k].show();
		}
		//更新Head展示
		this.showHead();
	}

	//获取最后落子(用于最后手数展示、棋子标记)
	getLastMove () {
		//获取最后一个棋子
		if(!this.trace || this.trace.length<=0){
			return;
		}
		let last = this.trace.length-1;
		if(last < 0){
			return
		}

		let lastMove = this.parsePlay(this.trace[last]);

		if(lastMove.vertex === '-1,-1'){
			if(last < 1){
				return;
			}

			// lastMove = me.parsePlay(me.trace[last - 1]);
		}
		return lastMove;
	}

	showLastOrder () {
		if(this.boardStatus === STATES.MARK_DEAD){
			return
		}

		//分支变化图时不显示手数
		if(this.branch){
			return;
		}

		for(let k in this.orders) {
			this.orders[k].hide();
		}

		let lastMove = this.getLastMove();

		if(lastMove){
			let stepText = this.orders[lastMove.vertex];
			if(stepText){
				stepText.show();
				this.lastStepText = stepText;
			}
		}

		//更新Head展示
		this.showHead();
	}

	hideOrder () {
		for(let k in this.orders) {
			this.orders[k].hide();
		}

		if(this.branch){
			for(let k in this.branchOrders) {
				this.branchOrders[k].hide();
			}
		}

		//更新Head展示
		this.showHead();
	}

	showCoordinates () {
		this.options.showCoordinates = true
		for(let k in this.coordinates) {
			this.coordinates[k].show();
		}
	}

	hideCoordinates () {
		this.options.showCoordinates = false
		for(let k in this.coordinates) {
			this.coordinates[k].hide();
		}
	}

	removeAllPieces () {
		for(let k in this.pieces) {
			this.removePiece(k);
		}

		this.pieces = {};
		this.orders = {};
		this.hideHead();
	}

	rebuildPieces (stones){
		this.addedStoneNum = 0;

		for(let i = 0 ; i < this.trace.length; i++){
			const goCo = this.trace[i].split(",");
			//pass
			if(-1 === goCo[0] || -1 === goCo[1]){
				continue;
			}
			let key = goCo[0]+","+goCo[1];
			//eat if this position has piece
			this.removePiece(key);

			if(stones && !(key in stones)) {
				continue;
			}

			let color = goCo[2];
			let isAdded = goCo[3]*1;

			if(isAdded){
				this.addPiece(key, goCo[0],goCo[1], color, -1);
				this.addedStoneNum++;
			}else{
				this.addPiece(key, goCo[0],goCo[1], color, i + 1 - this.addedStoneNum);
			}
		}

		// 最后一手棋标志
		this.showHead();
	}

	getPiece (col, row) {
		return this.pieces[col+','+row];
	}

	getStepPiece (step) {
		if(step>=this.trace.length){
			return null;
		}
		let s = this.trace[step-1];
		if(!s){
			return null;
		}
		return this.pieces[s.substring(0, s.lastIndexOf(','))];
	}

	goTo (n){
		if(n>this.trace.length){
			return;
		}
		let currentTrace = this.trace.slice(0,n)
		let tailTrace = this.trace.slice(n);
		for(let i = 0 ; i < tailTrace.length; i++){
			this.pieces[this.parsePlay(tailTrace[i]).vertex].hide();
		}
		this.trace = currentTrace;
	}

	/**
	让棋
	*/
	changeColor (){
		if(this.currentColor) {
			this.currentColor = 0;
		}else{
			this.currentColor = 1;
		}
	}

	setPlayable (b) {
		this.playable = b;
	}

	setClientColor (val) {
		this.clientColor = val;
		this.updateDummyColor();
	}

	setCurrentColor (val) {
		if(val){
			this.currentColor = val;
		}else if(this.trace.length){
			// this.currentColor = 1 + this.trace.length%2;
			let last = this.trace[this.trace.length -1];
			let arr = last.split(',');
			// 最后一子是添加的
			if(arr[3]=== '1'){
				this.currentColor = this.whoFirst;
			}else{
				this.currentColor = arr[2] === '2' ? 1 : 2;
			}
		}else {
			this.currentColor = this.whoFirst;
		}

		this.updateDummyColor();
	}

	currentSteps () {
		return this.trace.length;
	}

	/**
	 * @param vertexes [{col:1,row:2}]
	 */
	eat (vertexes) {
		for(let i = 0 ;i < vertexes.length;i++){
			if(!this.getPiece(vertexes[i].col, vertexes[i].row)){
				continue;
			}
			this.getPiece(vertexes[i].col, vertexes[i].row).remove();
			let key = vertexes[i].col + "," + vertexes[i].row;
			this.removePiece(key);
		}
	}

	computeCurrentColor () {
		return this.trace.length % 2 === 0 ? 0 : 1;
	}

	clearTerritoryMarkers () {
		for(let k in this.places) {
			this.places[k].remove();
		}
		this.places = {};
	}

	markTerritories (territories) {
		for(let i = 0 ;i < territories.length; i++) {
			this.drawPlaces(territories[i].Color ,territories[i].Moyos);
		}
	}

	// old
	// startMarkDead () {
	// 	this.boardStatus = STATES.MARK_DEAD;
	// 	this.setMarkDead(true);
	// }
	startMarkDead (territories) {
		this.boardStatus = STATES.MARK_DEAD;
		this.setMarkDead(true);
		this.markTerritories(territories)
		// 标记死子时隐藏手数
		this.hideOrder()
	}
	endMarkDead  () {
		this.boardStatus = STATES.DEFAULT;
		this.setMarkDead(false);
		// 恢复手数
		this.recoverOrder()
	}

	recoverOrder() {
		if(this.options.showOrder === true){
			this.showOrder()
		}else if(this.options.showOrder === 'last'){
			this.showLastOrder();
		}
	}

	drawPlaces (color, vertexes){
		for(let i = 0 ;i<vertexes.length ;i++) {
			let key = vertexes[i].Col + "," + vertexes[i].Row;
			this.addPlace(key, vertexes[i].Col, vertexes[i].Row, color);
		}
	}

	addPlace (key, col, row, color) {
		const co = this.go2ph(col,row);

		let fill;

		if(color === 1 ){
			fill = 'black';
		}else if(color === 2){
			fill = 'white';
		}else{
			fill = 'red';
		}

		const offset = this.options.PLACE_WIDTH/ 2;

		this.places[key] = this.paper.rect(co[0] - offset, co[1] - offset, this.options.PLACE_WIDTH, this.options.PLACE_WIDTH).attr({
			fill: fill,
			opacity: 0.7
		});

	}

	clearBoard () {
		this.hideHead();
		for(let k in this.pieces) {
			this.removePiece(k);
		}
		this.pieces = {};
		this.orders = {};
		this.branchOrders = {};
		this.trace = [];
	}

	remove (vertexes) {

		this.hideHead();
		this.eat(vertexes);
		this.trace = this.trace.slice(0 , this.trace.length - vertexes.length);
		this.showHead();
	}


	startDrawMarker () {
		this.clickStatus = "marker";
		this.startMarkerDummy();
	}

	endDrawMarker () {
		this.clickStatus = null;
		this.currentMarker = null;
		this.endMarkerDummy();
	}

	clearMarkers () {
		for(let k in this.markers) {
			this.markers[k].remove();
		}
		this.markers = {};

		this.currentMarker = null;
		this.getNextMarker();
		this.updateMarkerDummy(this.currentMarker);
	}

	// 查询现有marker，给出接下来的字母标记
	getNextMarker () {
		if (!this.currentMarker) {
			this.currentMarker = 'A'
		}else{
			let max = ''

			for(let i in this.markers) {
				const mark = this.markers[i].attrs.text
				if(mark > max && mark < 'Z') {
					max = mark
				}
			}
			if(!max){
				this.currentMarker = 'A'
				return
			}
			const code = max.charCodeAt(0)
			this.currentMarker = String.fromCharCode(code + 1)
		}

	}

	getMarkers () {
		let list = []
		for(let k in this.markers) {
			const text = this.markers[k].attrs['text']
			// 不考虑三角等特殊标记
			if(text>='A' && text<='Z'){
				list.push(this.markers[k].attrs['text'])
			}
		}
		return list
	}

	startMarkerDummy (text) {
		if(!text){
			this.getNextMarker();
		}

		this.dummy.hide();
		this.updateMarkerDummy(text || this.currentMarker);
	}

	updateMarkerDummy (marker){
		if(this.markerDummy){
			this.markerDummy.remove();
		}

		if(!marker){
			return;
		}

		this.markerDummy = this.paper.text(0, 0, marker).attr({
			'font-size': this.options.markerSize,
			'font-weight': 'bold',
			fill: markerColor,
			opacity: 0.5,
			position: 'absolute',
			'z-index':2
		});

		// $(this.markerDummy.node).css({
		// 	'text-shadow': '0 0 9px #fff, 0 0 9px #fff',
		// 	'curcor': 'pointer'
		// });

		this.markerDummy.hide();
	}

	endMarkerDummy () {
		this.markerDummy && this.markerDummy.hide();
	}


	drawMarker (mark, col, row) {
		let key = col + "," + row;

		if( col > this.options.boardSize || row > this.options.boardSize){
			return false;
		}

		//该位置已存在标记， 先删除
		if(this.markers[key]){
			this.markers[key].remove();
			delete this.markers[key];
		}

		let co = this.go2ph(col,row);

		// $(marker.node).css({
		// 	'text-shadow': '0 0 9px #fff, 0 0 9px #fff'
		// });

		this.markers[key] = this.paper.text(co[0], co[1], mark).attr({
			'font-size': this.options.markerSize,
			"font-weight": "bold",
			fill: markerColor
		});
	}

	removeMarker (col, row) {
		let key = col + "," + row;

		if(this.markers[key]) {
			this.markers[key].remove();
			delete this.markers[key];
		}
	}

	destroy() {
		if(this.el){
			this.el.innerHTML = ''
		}
	}

	// changeTheme(setting) {
	// 	// 坐标校准
	// 	this.options.sizeSettings = setting
	// 	Object.assign(this.options, this.options.sizeSettings[this.options.boardSize]);
	// 	this.initParams()
	// 	this.initPosition()
	// 	this.boardMesh.attr('src', setting[this.options.boardSize].boardImg)
	// }

	changeTheme(settings) {
		// 坐标校准
		Object.assign(this.options, settings)
		const size = this.options.boardSize;
		Object.assign(this.options, this.options.sizeSettings[size]);

		this.initParams()
		this.initPosition()
		this.initChessBoard()

		// head三角和虚拟棋子尺寸变化，需要重新生成
		this.dummy.remove();
		this.head.remove();

		this.initPieces()
	}
}


