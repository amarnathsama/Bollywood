import React from "react";

import { consonants } from "./consonants";

export default function BlueButton(props) {
  return (
    <div className="group-container">
      <div className="multi-button skin3">
        {consonants.map((letter) => (
          <button onClick={props.fun}>{letter}</button>
        ))}
      </div>
    </div>
  );
}
