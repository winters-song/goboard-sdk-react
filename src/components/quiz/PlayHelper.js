import React from "react";
import ArrowIcon from "components/assets/ArrowIcon";

export default function PlayHelper(props){
  const {moveHelperLine, onConfirm} = props

  return <div className="play-helper">
    <div className="directions">
      <div className="arrow top" onClick={() => moveHelperLine(0, -1)}>
        <ArrowIcon/>
      </div>
      <div className="arrow bottom" onClick={() => moveHelperLine(0, 1)}>
        <ArrowIcon/>
      </div>
      <div className="arrow left" onClick={() => moveHelperLine(-1, 0)}>
        <ArrowIcon/>
      </div>
      <div className="arrow right" onClick={() => moveHelperLine(1, 0)}>
        <ArrowIcon/>
      </div>
    </div>
    <div className="buttons">
      <div className="btn btn-primary" onClick={onConfirm}>确认</div>
    </div>
  </div>
}