import {SgfTree} from '@/components/go/SgfTree'


/*
* 检查用户落子是否与答案匹配
* 1：错误分支
* 0：正确分支
* 无0时，覆盖正确分支算对，允许超过正确分支的摆图
* */
export function checkUserAnswer(sgf, trace) {
  let result = true

  const tree = new SgfTree(sgf)

  let index = 0
  let node = tree.current;

  while(node.children){

    if(index >= trace.length){
      result = false
      break;
    }

    const step = trace[index].split(',');
    const col = step[0]*1
    const row = step[1]*1

    let matched = false
    let isEnd = false
    // sgf查找正确分支（可能有多个正确分支）
    for(let i = 0; i< node.children.length; i++) {
      const comment = node.children[i].getComment();
      // 如果进入了错误分支，标记当前题目data的comment = 1
      if (comment && /^1/.test(comment)) {
        continue
      } else{
        const nextNode = node.children[i]

        if(nextNode.col === col && nextNode.row === row){

          if(comment && /^0/.test(comment)){
            isEnd = true
            break
          }
          node = nextNode
          index++
          matched = true
          break
        }
      }
    }
    if(isEnd){
      result = true
      break;
    }

    if(!matched){
      result = false
      break;
    }

  }

  return result;
}