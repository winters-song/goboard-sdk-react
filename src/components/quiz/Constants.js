// import CryptoJS from  "crypto-js";

export const WHO_PLAY = {
  1: "黑先",
  2: "白先"
};


export const QUIZ_TYPE = {
  MANUAL : "MAKE_PICTURE",
  SELECT_SGF : "SGF_CHOOSE",
  SELECT_IMG: "PICTURE_CHOOSE",
  RESPONSIVE: "AUTO_ANSWER",
  SINGLE_MARK: "POINT_SINGLE",
  MULTI_MARK: "POINT_MULTI",
};

export const TYPE_NAME = {
  "MAKE_PICTURE": "摆图题",
  "SGF_CHOOSE": "选择题",
  "PICTURE_CHOOSE": "选择题",
  "AUTO_ANSWER": "自动应答题",
  "POINT_SINGLE": "枚举题",
  "POINT_MULTI": "枚举题"
};


export const RESULT = {
  NONE: 0,
  SUCCESS: 1,
  FAILED: 2
}

// 查看试卷状态： 我的答案、重做、正确答案
export const QUIZ_STATE = {
  MY_ANSWER: '1',
  REPLAY: '2',
  ANSWER: '3'
}



// export const RESULT_TYPE = {
//   0: "不需要选择结果",
//   1: "净杀/净活",
//   2: "打劫"
// };

// export const CATEGORY = {
//   1: "死活", //DEAD_LIVE
//   2: "布局", //LAYOUT
//   3: "定式", //PATTERN
//   4: "中盘", //MID
//   5: "官子" //YOSE
// };

// export const decrypt = function (id, str) {
//   const Id = CryptoJS.MD5(id + "").toString();
//   // key: 密钥 16 位
//   // iv: 初始向量 initial vector 16 位
//   const key = CryptoJS.enc.Utf8.parse(Id.substr(0, 16));
//   const iv = CryptoJS.enc.Utf8.parse(Id.substr(16));

//   let decrypted = CryptoJS.AES.decrypt(str, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7
//   });
//   decrypted = CryptoJS.enc.Utf8.stringify(decrypted);

//   return decrypted
// }
