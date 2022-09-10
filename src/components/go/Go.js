
/**
 * 不做停招处理
 * 不做落子次序校验（交给棋盘做）
 */

// Set 补充:批量添加，批量删除
Set.prototype.addAll = function (another) {
  if(another.size){
    another.forEach(item => {
      this.add(item);
    });
  }else if (another.length){
    for (const i in another){
      this.add(another[i]);
    }
  }

  return this;
}

Set.prototype.removeAll = function (another){
  another.forEach(item => {
    this.delete(item);
  });
  return this;
}

// 颜色
export const Color = {
  EMPTY : 0,
  BLACK : 1,
  WHITE : 2
}

// 大龙
export const Str = function(vertex){
  //棋子
  this.vertexes = new Set();
  //气
  this.liberty = new Set();
  //撞气的对方棋子
  this.opposite = new Set();

  if(vertex){
    this.vertexes.add(vertex);
  }
};
Str.prototype = {
  merge: function(another){
    this.vertexes.addAll(another.vertexes);
    this.liberty.addAll(another.liberty);
    this.opposite.addAll(another.opposite);

    return this;
  }
};

const neighbors = [[0,1],[0,-1],[1,0],[-1,0]]
const surround = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]

//noBoard: 不进行board二维数组初始化(UCT使用)
export class Go {

  constructor(size, noBoard){
    // 9，13，19
    this.size = size;
    this.blackStrs = new Set();
    this.whiteStrs = new Set();
    this.blackCaptures = new Map();
    this.whiteCaptures = new Map();
    this.addedStones = []

    if(noBoard){
      return
    }
    this.init()
  }

  init (){
    this.history = []
    this.board = [...Array(this.size)].map(() => Array(this.size).fill(Color.EMPTY))
  }

  add (x, y, color, isAdd) {
    let move = [x, y, color]
    let eating = this.willEat(move)
    let eatenVertexes = new Set()
    if(isAdd){
      this.addedStones.push(move)
    }

    eating.forEach(str => {
      eatenVertexes.addAll(str.vertexes)
    })

    this.doPlay(move, eating)
    this.history.push(move)

    this.board[y][x] = color

    return eatenVertexes
  }

  getVertex (x, y) {
    return `${x},${y}`
  }

  isOnBoard (x, y){
    return x >=0 && x < this.size && y >=0 && y < this.size
  }

  // 该坐标是否有落子, col=x, row=y
  isEmpty (x, y) {
    return this.board[y][x]  ===  Color.EMPTY
  }

  isBadMove (x, y) {
    return y < 0 || x < 0 || y >= this.size || x >= this.size || this.board[y][x] !== Color.EMPTY
  }

  // 此处可以落子
  // 此处无棋子，不是打劫，不是禁入点
  canPlay (x, y, color) {
    let move = [x, y, color]

    // 是否已经有子
    if (!this.isEmpty(x, y)) {
      return false;
    }
    // 是否有提子
    let eating = this.willEat(move)
    let eatenVertexes = new Set()
    // 把被吃掉的各块棋的棋子坐标全部加入集合
    eating.forEach(str => {
      eatenVertexes.addAll(str.vertexes)
    })
    // 是否是打劫
    if(!this.checkCanKo(move, eating)){
      return false
    }
    // 没有吃子，禁入点
    if (!eating.size && this.willSuicide(move)) {
      return false
    }
    return true
  }

  getStep () {
    return this.history.length
  }

  // 是否是打劫
  checkCanKo (move, eating) {
    if (1 !== eating.size) {
      return true
    }
    let eatVertex = null

    eating.forEach( str => {
      // 吃掉多个子则不是打劫
      if(str.vertexes.size !== 1) {
        return true
      }
      str.vertexes.forEach(v => {
        eatVertex = v
      })
    })

    // 没有上一步，不是打劫
    let lastMove = this.getLastMove()
    if (undefined  ===  lastMove) {
      return true
    }
    // 获得上一次提子
    let lastCaptureVertex = null
    let lastCaptures
    if(Color.BLACK  ===  lastMove[2]) {
      lastCaptures = this.blackCaptures.get(this.history.length - 1)
    } else {
      lastCaptures = this.whiteCaptures.get(this.history.length - 1)
    }

    // 上一次无提子，或有多个提子，不算打劫
    if(!lastCaptures || lastCaptures.size !== 1) {
      return true
    }

    lastCaptures.forEach(str => {
      // 吃掉多个子则不是打劫
      if(str.vertexes.size !== 1) {
        return true
      }
      str.vertexes.forEach(function (v) {
        lastCaptureVertex = v
      })
    })

    // 上一步被提掉子=本次落子，本次要吃掉的子=上一步落子
    if(lastCaptureVertex  ===  this.getVertex(move[0], move[1]) && eatVertex  ===  this.getVertex(lastMove[0], lastMove[1])){
      return false
    }
    return true
  }

  // 禁入点
  willSuicide (move) {
    let strs = move[2]  ===  Color.BLACK ? this.blackStrs : this.whiteStrs;
    let vertex = this.getVertex(move[0], move[1])
    // 该落子是否有气
    let hasLiberty = !!this.getLiberty(vertex).length;
    // 有多口气就忽略
    if (hasLiberty) {
      return false;
    }
    let result = true;
    strs.forEach(str => {
      // 所有大龙有该气，并有多口气就忽略
      if (str.liberty.has(vertex) && str.liberty.size > 1) {
        result = false;
        return false;
      }
    });

    return result;
  }

  willEat (move) {
    // 将被吃掉的多块棋
    let eatenStrs = new Set();
    // 当前落黑子，则遍历白棋各块棋， 反之亦然
    let strs = move[2]  ===  Color.BLACK ? this.whiteStrs : this.blackStrs;
    //搜索对方每条龙是否是最后1口气
    strs.forEach(str => {
      // 最后1口气，且坐标位置与落子相同
      if (str.liberty.size  ===  1 && str.liberty.has(this.getVertex(move[0], move[1]))) {
        eatenStrs.add(str);
      }
    });

    return eatenStrs;
  }

  oppositeColor(color){
    return 3 - color
  }

  doPlay (move, eating) {
    let vertex = this.getVertex(move[0], move[1])
    // eat
    let myStrs = move[2]  ===  Color.BLACK ? this.blackStrs : this.whiteStrs;
    let oppositeStrs = move[2]  ===  Color.BLACK ? this.whiteStrs	: this.blackStrs;

    //移除吃掉的子
    eating.forEach( eatenStr => {
      eatenStr.vertexes.forEach(v => {
        // 清除board值
        const arr = v.split(',');
        this.board[arr[1]*1][arr[0]*1] = Color.EMPTY;

        myStrs.forEach(str => {
          // 对于所有撞气的位置，增加气，移除撞气
          if (str.opposite.has(v)) {
            // add liberty
            str.liberty.add(v);
            // remove adjacent opposite
            str.opposite.delete(v);
          }
        });
      });
    });
    // 记录提子（方便恢复）
    if (eating.size) {
      if (Color.BLACK  ===  move[2]) {
        this.blackCaptures.set(this.history.length, eating);
      } else {
        this.whiteCaptures.set(this.history.length, eating);
      }
      // 对方大龙移除掉被吃的
      oppositeStrs.removeAll(eating);
    }

    // 合并我方大龙
    // 合并主方
    let firstStrs = null;
    // 合并客方
    let mergedStrs = new Set();

    myStrs.forEach(str => {
      // 我方气有该位置
      if (str.liberty.has(vertex)) {
        if (null  ===  firstStrs) {
          // 记录要合并主方
          firstStrs = str;
        } else {
          // 找到合并客方，合并
          firstStrs.merge(str);
          mergedStrs.add(str);
        }
      }
    });

    // 如果有合并动作，将合并客方删掉
    if (mergedStrs.size){
      myStrs.removeAll(mergedStrs);
    }

    // 没有大龙相连，新建一块棋
    if (null  ===  firstStrs) {
      firstStrs = new Str();
      firstStrs.vertexes.add(vertex);
      myStrs.add(firstStrs);
    } else {
      // 延长大龙，减少当前位置的气
      firstStrs.vertexes.add(vertex);
      firstStrs.liberty.delete(vertex);
    }
    // 获得该点的气，加到大龙上
    firstStrs.liberty.addAll(this.getLiberty(vertex));
    // 获得该点的撞气，加到大龙上
    firstStrs.opposite.addAll(this.getOpposite(move));
    // 对方大龙相应减气，增加撞气
    oppositeStrs.forEach(str => {
      if (str.liberty.has(vertex)) {
        str.liberty.delete(vertex);
        str.opposite.add(vertex);
      }
    });
  }

  undo(n) {
    let moveResult = {};

    if(n > this.history.length){
      return null;
    }

    this.blackStrs.clear();
    this.whiteStrs.clear();
    this.blackCaptures.clear();
    this.whiteCaptures.clear();

    let oldHistory = this.history;
    let oldBoard = this.board;

    this.history = [];
    this.init();

    //重新从第0步play到上一步
    for (let i = 0; i < oldHistory.length - n; i++) {
      let [x, y, color] = oldHistory[i]
      this.add(x, y, color);
    }

    moveResult.move = oldHistory.pop();

    let eaten = new Set();
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        //eaten = board minus result undo
        if(oldBoard[i][j] !== this.board[i][j]) {

          //exclude current move
          if(i  ===  moveResult.move[1] && j  ===  moveResult.move[0]){

          }else{
            eaten.add({
              row: i,
              col: j,
              color: this.board[i][j]
            });
          }
        }
      }
    }

    moveResult.eated = eaten;
    return moveResult;
  }

  /**
   *	交替落子
    * @return []Vertex  返回被吃掉的子
    * @return null  不能落子（有效性校验、打劫或是禁入点）
    */
  play (x, y, color) {
    // 检查有效性
    // 此处有子，不能落子
    if (!this.isOnBoard(x, y) || !this.isEmpty(x, y)) {
      return null;
    }

    let move = [x, y, color];

    // 是否有提子
    let eating = this.willEat(move);
    let eatenVertexes = new Set();

    // 把被吃掉的各块棋的棋子坐标全部加入集合
    eating.forEach(str => {
      eatenVertexes.addAll(str.vertexes);
    });

    // 是否是打劫
    if(!this.checkCanKo(move, eating)){
      return null;
    }
    // 没有吃子，禁入点
    if (!eating.size && this.willSuicide(move)) {
      return null;
    }
    // 对双方受影响的大龙进行调整
    this.doPlay(move, eating);

    // 加入历史，改变该坐标值
    this.history.push(move);
    this.board[y][x] = color;

    // 返回被提掉的棋子，用于界面删除
    return eatenVertexes;
  }

  /**
   *	快速走子
    */
  forcePlay(x, y, color) {
    let move = [x, y, color];
    // 是否有提子
    let eating = this.willEat(move);
    // 对双方受影响的大龙进行调整
    this.doPlay(move, eating);
    // 加入历史，改变该坐标值
    this.history.push(move);
    this.board[y][x] = color;
  }

  // 获得最后一次落子
  getLastMove(){
    return this.history[this.history.length - 1];
  }

  getNeighborByColor(x, y, color){
    const arr = []
    for (let i in neighbors){
      let x2 = neighbors[i][0] + x
      let y2 = neighbors[i][1] + y

      if(this.isOnBoard(x2, y2) && color  ===  this.board[y2][x2]){
        arr.push(this.getVertex(x2, y2))
      }
    }
    return arr;
  }

  // 返回该位置上下左右没有棋子的顶点
  getLiberty(vertex) {
    const arr = vertex.split(',')
    return this.getNeighborByColor(arr[0]*1, arr[1]*1, Color.EMPTY)
  }

  getOpposite(move) {
    return this.getNeighborByColor(move[0], move[1], this.oppositeColor(move[2]))
  }

  // 获取某位置上下左右我方棋子
  getOurs (move) {
    return this.getNeighborByColor(move[0], move[1], move[2]);
  }

  // 获取某位置周围8个位置的某种状态数（我方、敌方、空）
  getArounds (move) {
    let arr = [];
    let color = move[2];

    for (let i in surround){
      let x = surround[i][0] + move[0]
      let y = surround[i][1] + move[1]

      if(this.isOnBoard(x, y) && color  ===  this.board[y][x]){
        arr.push(this.getVertex(x, y))
      }
    }
    return arr;
  }

  // 获取与大龙相邻的敌方大龙
  getOppositeStrs (myStr, oppositeStrs) {
    let result = new Set();

    oppositeStrs.forEach(str => {
      str.vertexes.forEach(key => {
        if (myStr.opposite.has(key)) {
          if (!result.has(str)) {
            result.add(str);
          }
        }
      });
    });
    return result;
  }

  // startSgf: 带有AB,AW的sgf, 需要拼接
  getSgf (startSgf) {
    let prefix, history
    if(startSgf){
      const key = "MULTIGOGM[1]"
      let index = startSgf.indexOf(key)
      prefix = startSgf.substr(0, index+ key.length)

      history = this.history.slice(this.addedStones.length)
      if(!history.length){
        return prefix + ')'
      }
    }else{
      prefix = '(;CA[gb2312]AP[MultiGo:4.4.4]SZ[' + this.size + ']'
      history = this.history
    }
    let s = '';

    function toGnuCo(x, y) {
      return String.fromCharCode(97 + x) + String.fromCharCode(97 + y);
    }

    history.forEach( move => {
      s += ";";
      if (Color.BLACK  ===  move[2]) {
        s += "B";
      } else {
        s += "W";
      }
      s += "[";
      s += toGnuCo(move[0], move[1]);
      s += "]";
    });

    return prefix + s + ')';
  }
}

// exports.Str = Str
// exports.Color = Color
// exports.Go = Go
