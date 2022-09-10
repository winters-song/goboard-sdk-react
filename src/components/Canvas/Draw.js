/* 此模块用于实现签名绘图功能 */

// 需要用到的变量定义
let clickArr = []
let clickDrag = []
let paint;
let point = {notFirst: false};

// 重绘用缓存
let pointCache = []
let contentCache = []
window.contentCache = contentCache

let canvasDiv = null; // 初始化画布父盒子
let canvas = document.createElement('canvas'); // 创建画板
let context = canvas.getContext("2d"); // 创建2d画布
let canvasWidth = 0; // 初始化画布宽度
let canvasHeight = 0; // 初始化画布高度

// 可导出图片的标识
let _exportable = false;
const lineColor = '#ef4136'

//压缩采样点算法
function douglasPeucker(points, epsilon) {
  let i,
    maxIndex = 0,
    maxDistance = 0,
    perpendicularDistance,
    leftRecursiveResults, rightRecursiveResults,
    filteredPoints;
  // find the point with the maximum distance
  for (i = 1; i < points.length - 1; i++) {
    perpendicularDistance = findPerpendicularDistance(points[i], [points[0], points[points.length - 1]]);
    if (perpendicularDistance > maxDistance) {
      maxIndex = i;
      maxDistance = perpendicularDistance;
    }
  }
  // if max distance is greater than epsilon, recursively simplify
  if (maxDistance >= epsilon) {
    leftRecursiveResults = douglasPeucker(points.slice(0, maxIndex + 1), epsilon);
    rightRecursiveResults = douglasPeucker(points.slice(maxIndex), epsilon);
    filteredPoints = leftRecursiveResults.concat(rightRecursiveResults.slice(1));
  } else {
    //filteredPoints = points;
    filteredPoints = [points[0], points[points.length - 1]];
  }
  return filteredPoints;
}

// 求垂直距离
function findPerpendicularDistance(point, line) {
  const pointX = point.x
  const pointY = point.y
  const lineStart = {
    x: line[0].x,
    y: line[0].y
  }
  const lineEnd = {
    x: line[1].x,
    y: line[1].y
  }
  const slope = (lineEnd.y - lineStart.y) / (lineEnd.x - lineStart.x)
  const intercept = lineStart.y - (slope * lineStart.x)
  let result;

  if (lineEnd.x === lineStart.x) {
    result = Math.abs(pointX - lineEnd.x)
  } else {
    result = Math.abs(slope * pointX - pointY + intercept) / Math.sqrt(Math.pow(slope, 2) + 1);
  }
  return result;
}

// 绘制CatmullRom插值曲线
function drawCatmullRom(points, segment) {
  const len = points.length
  if (len < 4) {
    return;
  }
  context.beginPath();
  context.moveTo(points[0].x, points[0].y)

  for (let index = 1; index < len - 2; index++) {
    const p0 = points[index - 1]
    const p1 = points[index]
    const p2 = points[index + 1]
    const p3 = points[index + 2]

    for (let i = 1; i <= segment; i++) {
      const t = i * (1.0 / segment);
      const tt = t * t;
      const ttt = tt * t;

      const x = 0.5 * (2 * p1.x + (p2.x - p0.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * tt + (3 * p1.x - p0.x - 3 * p2.x + p3.x) * ttt)
      const y = 0.5 * (2 * p1.y + (p2.y - p0.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * tt + (3 * p1.y - p0.y - 3 * p2.y + p3.y) * ttt)
      context.lineTo(x, y);
    }
  }
  context.lineTo(points[len - 1].x, points[len - 1].y);
  // context.closePath();
  context.stroke();
}

/* ------------ 需要用到的一些功能函数  ------------ */
function addClick(x, y, dragging) {
  const vector = {x, y}
  clickArr.push(vector)
  pointCache.push(vector)
  clickDrag.push(dragging)
}

function draw() {
  _exportable = true;

  while (clickArr.length > 0) {
    point.bx = point.x;
    point.by = point.y;
    //x, y
    Object.assign(point, clickArr.pop())
    point.drag = clickDrag.pop();
    context.beginPath();
    if (point.drag && point.notFirst) {
      context.moveTo(point.bx, point.by);
    } else {
      point.notFirst = true;
      context.moveTo(point.x - 1, point.y);
    }
    context.lineTo(point.x, point.y);
    // context.closePath();
    context.stroke();
  }
}

//重绘
function redraw() {
  _exportable = true;

  //有新加划线
  if(pointCache.length){
    let filteredArr = douglasPeucker(pointCache, 1)
    contentCache.push(filteredArr)
    pointCache = []
  }
  create()

  contentCache.forEach(points => {
    redrawLine(points)
  })
}

function redrawLine(points) {
  if(points.length< 4){
    let point = {};

    points.forEach((vector, index)=> {

      point.bx = point.x;
      point.by = point.y;
      //x, y
      Object.assign(point, vector)
      context.beginPath();
      if (index>0) {
        context.moveTo(point.bx, point.by);
      } else {
        point.notFirst = true;
        context.moveTo(point.x - 1, point.y);
      }
      context.lineTo(point.x, point.y);
      // context.closePath();
      context.stroke();
    })
  }else{
    drawCatmullRom(points, 100)
  }
}

/* 创建画布背景和画笔 */
function create() {
  // 以下是创建画布背景
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  // context.fillStyle="#f2f2f2"; // 图片北京色是灰色，此处去除会变黑色
  // context.fill();
  // 设置画笔属性
  context.strokeStyle = lineColor;
  context.lineJoin = "round";
  context.lineWidth = 3;
  // 默认值清理
  clickArr = [];
  clickDrag = [];
  _exportable = false;
}

export default {
  /* 初始化 */
  init(canvasDivDom, classname) {
    canvasDiv = canvasDivDom; // 传入画布父盒子
    canvasWidth = canvasDiv.clientWidth; // 获取父盒子宽度
    canvasHeight = canvasDiv.clientHeight; // 获取父盒子高度
    // 设置属性并追加元素
    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);
    canvasDiv.appendChild(canvas);
    // 创建画布背景和画笔
    create();
    // 开始监控画图
    this.listen(classname);
  },

  /* 画图时的监控 */
  listen(classname) {
    // 获取盒子需要的参数
    let left = canvas.getBoundingClientRect().left;
    let top = canvas.getBoundingClientRect().top;
    // 支持 移动端
    canvasDiv.addEventListener("touchstart", function(e){
      paint = true;
      classname && (this.className = classname);
      (e.touches) && (e = e.touches[0]);
      addClick(e.pageX - left, e.pageY - top);
      draw();
    });

    canvasDiv.addEventListener("touchmove", function(e){
      if(!paint) {
        return;
      }
      (e.touches) && (e = e.touches[0]);
      addClick(e.pageX - left, e.pageY - top, true);
      draw();
    });

    canvasDiv.addEventListener("touchend", () => {
      paint = false;
      redraw()
    });

    // 支持 PC 端
    canvasDiv.addEventListener("mousedown", function (e) {
      paint = true;
      classname && (this.className = classname);
      addClick(e.pageX - left, e.pageY - top);
      draw();
    });

    canvasDiv.addEventListener("mousemove", function (e) {
      if (!paint) {
        return;
      }
      addClick(e.pageX - left, e.pageY - top, true);
      draw();
    });

    canvasDiv.addEventListener("mouseup", () => {
      paint = false;
      redraw()
    });

    canvasDiv.addEventListener("mouseleave", () => {
      paint = false;
      redraw()
    });
  },

  /* 清理 */
  clear() {
    contentCache = []
    create(); // 重新创建画布背景和画笔
    _exportable = false; // 清理之后无法导出
  },

  /* 导出图片 */
  exportImg() {
    if (!_exportable) {
      return -1;  // 说明此处无法导出图片
    }
    return canvas.toDataURL("image/png");
  },

  resize({width, height}) {
    canvasWidth = width
    canvasHeight = height
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    redraw()
  }
}