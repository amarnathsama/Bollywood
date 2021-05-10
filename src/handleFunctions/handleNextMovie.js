import {useState} from "react";

export const handleGameStart = (mode) => {
    
    let fullDetails = this.getRandomMovie();
    this.setState(
        {
            movieName: fullDetails.title,
            hidden: false,
            lives: 9,
            gameOver: false,
            movieComplete: false,
            pressed: [],
            alreadyPressed: false,
            playMode: mode,
            showHint: false,
            fullDetails,
            gameScore: 0,
            isHighScore: false,
            value: null,
            scoreSubmitted: false,
            leaderboardName: null,
            showLeaderboard: false,
            rows: [],
        },
        () => {
            let visibleName = JSON.stringify(this.state.movieName);
            for (let x = 0; x < visibleName.length; x++) {
                if (
                    this.isCharacterALetter(visibleName[x]) &&
                    !this.isVowel(visibleName[x])
                ) {
                    visibleName = visibleName.replace(visibleName[x], "_");
                }
            }
            this.setState({ visibleName: JSON.parse(visibleName) });
        }
    );
};