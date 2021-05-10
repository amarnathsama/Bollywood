import React, { Component } from "react";

const Hint = (props) => {
    return (
        <div className="hintText">
            <button className="hintButton" onClick={props.handleHintClick}>
                {!props.state.showHint ? "Show Hint" : "Hide Hint"}
            </button>
            {props.state.showHint ? (
                <div className="hint">
                    <div>
                        {props.state.randomnizer % 4 <= 1 ? (
                            <div>
                                Among Lead Actors -
                                {
                                    props.state.fullDetails.actors[
                                        Math.min(
                                            props.state.fullDetails.actors
                                                .length - 1,
                                            props.state.randomnizer % 2
                                        )
                                    ]
                                }
                            </div>
                        ) : (
                            <div>
                                Year of release- {props.state.fullDetails.year}
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default Hint;
