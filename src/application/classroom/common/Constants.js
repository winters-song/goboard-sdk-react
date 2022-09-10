export const QUIZ_TYPE = {
  PRIZE: 1, //红包
  MARKER:2, //课堂标记题

  SELECT_SGF: 4, //sgf选择
  SELECT_IMG: 5, //图片选择
  RESPONSIVE : 6, //自动应答
  SINGLE_MARK : 7, //单点标记
  MULTI_MARK: 8, //多点标记
  BEAN: 14, // 发放棋豆

  BLACK_BOARD: 20, //黑板更新
  MVP: 21, //发榜

  START_COURSE: 100, //上课
  END_COURSE: 101, //下课
  END_STREAM: 102 //结束推流
}


export const QUIZ_TYPE_NAME = {
  [QUIZ_TYPE.SELECT_SGF]: '选择题',
  [QUIZ_TYPE.SELECT_IMG]: '选择题',
  [QUIZ_TYPE.RESPONSIVE]: '应答题',
  [QUIZ_TYPE.SINGLE_MARK]: '标记题',
  [QUIZ_TYPE.MULTI_MARK]: '标记题',
}
export const QUIZ_TYPE_CLS = {
  [QUIZ_TYPE.SELECT_SGF]: 'select',
  [QUIZ_TYPE.SELECT_IMG]: 'select',
  [QUIZ_TYPE.RESPONSIVE]: 'responsive',
  [QUIZ_TYPE.SINGLE_MARK]: 'mark',
  [QUIZ_TYPE.MULTI_MARK]: 'mark',
}
console.log(QUIZ_TYPE_CLS)