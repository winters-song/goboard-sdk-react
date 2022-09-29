import React from "react";
import { RESULT } from "./Constants";

import IconRight from 'components/assets/img/icon-right'
import IconWrong from 'components/assets/img/icon-wrong'

function ResultBar(props) {
  const {result} = props
  return <>
    {result === RESULT.SUCCESS && <div className="result success">答对了
      <span className="icon">
        <IconRight color={"current-color"}/>
      </span>
    </div>}
    {result === RESULT.FAILED && <div className="result failed">答错了
      <span className="icon">
        <IconWrong color={"current-color"}/>
      </span>
    </div>}
  </>
}

export default React.memo(ResultBar)