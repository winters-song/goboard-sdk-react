import {QUIZ_TYPE} from "../common/Constants";

export const agora_data = {
  appId: "e32e1e4277e244ce9934642b19662223",
  channel: "test",
  live_type: 1,
  token: "006e32e1e4277e244ce9934642b19662223IADCGngq3Ygw5NdfDSW7e2T+fWiNzcFp2fsMgoOqlJUztQx+f9gAAAAAEADR1hyrgBlEYgEAAQCAGURi"
}

export const star_data = [{
  type: 1, gold: 5
},{
  type: 1, gold: 6
},{
  type: 1, gold: 10
},{
  type: 2, gold: 12
},{
  type: 2, gold: 17
},{
  type: 3, gold: 35
}]

export const quiz_sent = {
  "version":1,
  "messageId":614838094174912513,
  "opCode":0,
  "data":{
    "code":"ok",
    "result":{
      "msg_id":1714,
      "time":1648105624784,
      "from_uid":0,
      "cid":333,
      "content":"{\"type\":2,\"index\":5,\"classroomId\":333,\"data\":{\"sgf\":\"(;GM[1]FF[4]CA[UTF-8]AP[Sabaki]KM[6.5]SZ[13]DT[2022-03-24];B[de];W[ci];B[jj];W[ek]LB[gg:A][hi:C][ig:B])\",\"options\":[{\"text\":\"A\"},{\"text\":\"B\"},{\"text\":\"C\"}],\"markers\":[\"A\",\"B\",\"C\"]},\"status\":1,\"broadcastId\":1714}"
    }
  }
}

export const marker1 = {
  type: 2,
  index: 429,
  classroomId: 327,
  data: {
    options: [{"text":"A"},{"text":"B"},{"text":"C"},{"text":"D"},{"text":"E"},{"text":"F"},{"text":"G"},{"text":"H"}],
  },
  status: 1,
  broadcastId: 1709,
  whoPlay: 1
}


export const closeMarker1 = {
  classroomId: 333,
  data: {
    answer: 'B'
  },
  index:4,
  status:0,
  type:2
}

export const red1 = {
  type: 1,
  index: 0,
  classroomId: 333,
  data: {
    envValuemax: 10,
    envValuemin: 5,
    envType: 0,
    value: "5:10",

  },
  status: 1,
  broadcastId: 1736
}

export const bean1 = {
  type: 14,
  index: 0,
  classroomId: 333,
  data: {
    envValuemax: 10,
    envValuemin: 5,
    envType: 0,
    value: "5:10",

  },
  status: 1,
  broadcastId: 1736
}

export const responsive1 = {
  type: 6,
  index: 429,
  classroomId: 327,
  data: {
    sgf: '(;CA[utf-8]AB[dg][cf][bd][be][cc][dc][fc][gc][hd][he][gf][eh]AW[bc][cd][fd][ff][cb][ge][ec][hc][gb][gg][cg][ef][ce][ee][dd][df][eg][de][fe][gd]C[]AP[MultiGo:4.4.4]SZ[9]AB[fg]MULTIGOGM[1];B[ed])',
    name: '如何打吃白棋',
    options: '',
    id: 429
  },
  status: 1,
  broadcastId: 1709,
  whoPlay: 1
}

export const responsive2 = {
  type: 6,
  index: 429,
  classroomId: 327,
  data: {
    sgf: '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.51.1]KM[5]SZ[19]DT[2022-04-02]AB[dd]AW[fc];B[cf];W[db];B[cc];W[ic])',
    imageUrl: 'https://oss-dev.iqidao.com/child/teacher/sgf/1643270017/bbcf9361d043679b35ed31103494356c.png',
    name: '如何打吃白棋',
    options: '',
    id: 429
  },
  status: 1,
  broadcastId: 1709,
  whoPlay: 1
}



export const select1 = {
  type: 4,
  index: 429,
  classroomId: 327,
  data: {
    sgf: '(;CA[utf-8]AB[dg][cf][bd][be][cc][dc][fc][gc][hd][he][gf][eh]AW[bc][cd][fd][ff][cb][ge][ec][hc][gb][gg][cg][ef][ce][ee][dd][df][eg][de][fe][gd]C[]AP[MultiGo:4.4.4]SZ[19]AB[fg]MULTIGOGM[1];B[ed])',
    name: '如何打吃白棋',
    options: "[{\"index\":\"1\",\"answer\":true,\"text\":\"A\"}," +
      "{\"index\":\"2\",\"answer\":false,\"text\":\"B\"}," +
      "{\"index\":\"3\",\"answer\":false,\"text\":\"C\"}," +
      "{\"index\":\"4\",\"answer\":false,\"text\":\"D\"}" +
      "]",
    id: 429
  },
  status: 1,
  broadcastId: 1709,
  whoPlay: 1
}


export const select2 = {
  type: 5,
  index: 429,
  classroomId: 327,
  data: {
    imageUrl: 'https://oss-dev.iqidao.com/child/teacher/sgf/1643270017/bbcf9361d043679b35ed31103494356c.png',
    name: '如何打吃白棋',
    options: "[{\"index\":\"1\",\"answer\":true,\"text\":\"A\"}," +
      "{\"index\":\"2\",\"answer\":false,\"text\":\"B\"}," +
      "{\"index\":\"3\",\"answer\":false,\"text\":\"C\"}," +
      "{\"index\":\"4\",\"answer\":false,\"text\":\"D\"}" +
      "]",
    id: 429
  },
  status: 1,
  broadcastId: 1709,
  whoPlay: 1
}



export const singlemark = {
  type: QUIZ_TYPE.SINGLE_MARK,
  index: 429,
  classroomId: 327,
  data: {
    sgf: "(;CA[gb2312]AB[fe][gg]AW[cf][cc][dg]CR[cc][cf][dg]AP[MultiGo:4.4.4]SZ[9]AB[fc]MULTIGOGM[1])",
    name: '如何打吃白棋',
    options: "[]",
    id: 429
  },
  status: 1,
  broadcastId: 1709,
  whoPlay: 1
}

export const mvp = [{
  id: 1,
  nickName: '修罗老虎不发威',
  userPhotoUrl: 'https://www.iqidao.com/static_resources/image/fe/ff/feff71359ec203591f479f52b3685f75.65x65.jpg',
  answerRightNum: 10,
  answerTimeStr : '00:59'
},{
  id: 2,
  nickName: '叶修',
  userPhotoUrl: 'https://www.iqidao.com/static_resources/image/29/e6/29e6df067efcc871f4b7505131e37a25.65x65.jpg',
  answerRightNum: 9,
  answerTimeStr : '00:58'
},{
  id: 3,
  nickName: '王悠宇',
  userPhotoUrl: 'https://www.iqidao.com/static_resources/image/48/c1/48c1a48ea95214785888b24e88ae1a68.65x65.jpeg',
  answerRightNum: 8,
  answerTimeStr : '00:57'
},{
  id: 4,
  nickName: '老虎不发威',
  userPhotoUrl: 'https://www.iqidao.com/static_resources/image/0e/40/0e40b77c21de2bfbc192901398921445.65x65.png',
  answerRightNum: 7,
  answerTimeStr : '00:56'
},{
  id: 5,
  nickName: '开心小妖怪',
  userPhotoUrl: 'https://www.iqidao.com/static_resources/image/32/2e/322eeab27dc86b7f6f8c56026b634bc0.65x65.jpg',
  answerRightNum: 6,
  answerTimeStr : '00:55'
},{
  id: 6,
  nickName: '鱼海航',
  userPhotoUrl: 'https://www.iqidao.com/static_resources/image/12/d1/12d127572d4facf57c1cd526ce8030f3.65x65.jpeg',
  answerRightNum: 5,
  answerTimeStr : '00:54'
},{
  id: 7,
  nickName: '岳佳妍',
  userPhotoUrl: 'https://www.iqidao.com/static_resources/image/f6/c8/f6c81570f9f9c5b3ec28c4816e2ad114.65x65.jpg',
  answerRightNum: 4,
  answerTimeStr : '00:53'
},{
  id: 8,
  nickName: '胡中源',
  userPhotoUrl: 'https://www.iqidao.com/static_resources/image/5d/f8/5df8e9778b883b921a7082be4fd89236.65x65.jpeg',
  answerRightNum: 3,
  answerTimeStr : '00:52'
},{
  id: 9,
  nickName: '姚鸿林',
  userPhotoUrl: 'https://www.iqidao.com/static_resources/image/1e/6a/1e6a247385306d463b52786248d2e686.65x65.jpg',
  answerRightNum: 2,
  answerTimeStr : '00:51'
},{
  id: 10,
  nickName: '王泽萱',
  userPhotoUrl: 'https://www.iqidao.com/static_resources/image/bf/40/bf40b9525cad36f2ef09cb808520fff2.65x65.jpg',
  answerRightNum: 1,
  answerTimeStr : '00:50'
}]


// 学生答题（标记题）返回值：
export const marker_submit = {
  "messageId": 1650523393202,
  "version": 1,
  "opCode": 31,
  "data": {
  "content": "{\"data\":{\"answer\":\"B\"},\"classroomId\":\"333\",\"broadcastId\":\"1894\",\"type\":\"2\",\"index\":\"1\",\"ct\":\"1650523393202\",\"uid\":\"13\"}",
    "gid": "340",
    "cid": "333",
    "sender_id": "13",
    "time": "1650523393202",
    "client_type": 1
  }
}

//
/*
* 学生答题（标记题）返回值
* data: {answer}
*
* 学生答题（自动应答题）返回值：
* data: {sgf, isright}
*
* 学生答题（选择题）返回值：
* data: {answer, answerIndex, isright}
*
* 学生收红包：
* envType (0 - 随机值, 1 - 固定值), envValue
* */