import React from "react";
import { useState, useEffect } from "react";
// import { setConstantValue } from "typescript";

const Timer = (props) => {
    useEffect(() => {
        let myInterval = setInterval(() => {
            if (props.currentTime > 0) {
                // setSeconds(seconds - 1);
                props.updateTime();
            } else {
                props.gameOver();
            }
        }, 1000);
        return () => {
            clearInterval(myInterval);
        };
    }, [props.initialSeconds]);
    return (
        <div className="timer">
            {props.currentTime === 0 ? null : (
                <h1>
                    {" "}
                    0:
                    {props.currentTime < 10
                        ? `0${props.currentTime}`
                        : props.currentTime}
                </h1>
            )}
        </div>
    );
};

export default Timer;
