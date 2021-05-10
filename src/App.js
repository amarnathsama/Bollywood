import React, { Component } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";

import Timer from "./Components/views/Timer";
import LeaderboardRender from "./Components/views/LeaderboardRender";
import { alphabets } from "./Components/Alphabets";
import { bollywoodHeader } from "./Components/Alphabets";
import { vowels } from "./Components/vowels";
import { getRandomMovie } from "./Components/getRandomMovie";
import { inUseUrl } from "./Components/link";
import Hint from "./Components/views/Hint";
import "./openingScreen.css";
import "./playScreen.css";
import "./endScreenPlayButton.css";
import "./styles.css";

class App extends Component {
    state = {
        hidden: true,
        movieName: null,
        visibleName: null,
        fullDetails: null,
        movieComplete: false,
        lives: 9,
        gameOver: false,
        pressed: [],
        alreadyPressed: false,
        playMode: "casual",
        showHint: false,
        gameScore: 0,
        isHighScore: false,
        value: null,
        scoreSubmitted: false,
        leaderboardName: null,
        showLeaderboard: false,
        rows: [],
        currentTime: 59,
        randomnizer: Math.floor(Math.random() * 1025),
    };

    componentDidMount() {
        document.addEventListener("keydown", this._handleKeyDown);
    }

    isCharacterALetter = (char) => {
        return /[a-zA-Z]/.test(char);
    };

    getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    isVowel = (isCharVowel) => {
        return vowels.includes(isCharVowel.toUpperCase());
    };

    handleGameStart = (mode) => {
        let fullDetails = getRandomMovie();
        this.setState(
            {
                movieName: fullDetails.title,
                hidden: false,
                lives: 9,
                gameOver: false,
                movieComplete: false,
                pressed: ["A", "E", "I", "O", "U"],
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
                currentTime: 59,
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

    handleNextMovie = () => {
        let fullDetails = getRandomMovie();

        this.setState(
            {
                movieName: fullDetails.title,
                movieComplete: false,
                pressed: [],
                alreadyPressed: false,
                showHint: false,
                fullDetails,
                currentTime: Math.min(59, this.state.currentTime + 30),
                pressed: ["A", "E", "I", "O", "U"],
                lives:
                    this.state.lives != 1
                        ? Math.min(this.state.lives + 1, 9)
                        : 3,
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
        return;
    };

    handleClickChar = (clickedChar) => {
        clickedChar = clickedChar.keyboard;
        if (this.state.movieComplete == true) return;
        if (this.state.pressed.includes(clickedChar)) {
            this.setState({ alreadyPressed: "Button already Pressed" });
            return;
        }
        this.setState({ alreadyPressed: null });
        let newPressed = this.state.pressed;
        newPressed.push(clickedChar);
        this.setState({ pressed: newPressed });
        let visibleName = JSON.stringify(this.state.visibleName);
        let movieName = JSON.stringify(this.state.movieName);
        let newVisibleName = "";
        let wrongChoice = true;
        for (let x = 0; x < visibleName.length; x++) {
            if (
                visibleName[x] === "_" &&
                movieName[x].toUpperCase() === clickedChar
            ) {
                newVisibleName = newVisibleName.concat(movieName[x]);
                wrongChoice = false;
            } else {
                newVisibleName = newVisibleName.concat(visibleName[x]);
            }
        }

        if (wrongChoice) {
            this.setState({ lives: this.state.lives - 1 }, () => {
                if (this.state.lives === 0) {
                    this.handleGameEnd();
                }
            });
        } else {
            this.setState({ visibleName: JSON.parse(newVisibleName) });
        }
        if (!newVisibleName.includes("_")) {
            this.setState({
                movieComplete: true,
                gameScore: this.state.gameScore + 1,
            });
        }
    };

    handleGameEnd = async () => {
        this.setState({ gameOver: true });
        if (this.state.playMode === "rated") {
            let alreadyHighScore = false;

            await fetch(`${inUseUrl}/api/leaderboard/totalEntries`)
                .then((res) => {
                    return res.json();
                })
                .then((totalEntries) => {
                    if (totalEntries < 30) {
                        this.setState({ isHighScore: true });
                        alreadyHighScore = true;
                    }
                });

            if (!alreadyHighScore)
                await fetch(`${inUseUrl}/api/leaderboard/leastScore`)
                    .then((res) => {
                        return res.json();
                    })
                    .then((leastScore) => {
                        // console.log(leastScore);
                        if (leastScore < this.state.gameScore) {
                            this.setState({ isHighScore: true });
                        }
                    });
            if (this.state.isHighScore) {
                const { REACT_APP_PASSWORD_KEY } = process.env;
                let encryptedGameScore = CryptoJS.AES.encrypt(
                    this.state.gameScore.toString(),
                    REACT_APP_PASSWORD_KEY.toString()
                ).toString();
                const leaderboardEntry = {
                    name: "anonymous",
                    score: encryptedGameScore,
                };
                axios.post(
                    `${inUseUrl}/api/leaderboard/submit`,
                    leaderboardEntry
                );
            }
        }
    };

    handleHintClick = () => {
        this.setState({
            showHint: !this.state.showHint,
        });
    };

    handleNameChange = (event) => {
        this.setState({ leaderboardName: event.target.value }, () => {
            // console.log(this.state.leaderboardName);
        });
    };

    handleLeaderboardSubmit = () => {
        this.setState({ scoreSubmitted: true });
        const { REACT_APP_PASSWORD_KEY } = process.env;
        let encryptedGameScore = CryptoJS.AES.encrypt(
            this.state.gameScore.toString(),
            REACT_APP_PASSWORD_KEY.toString()
        ).toString();
        const leaderboardEntry = {
            name: this.state.leaderboardName,
            score: encryptedGameScore,
        };
        axios.post(`${inUseUrl}/api/leaderboard/update`, leaderboardEntry);
    };
    createData = (rank, name, score) => {
        return { rank, name, score };
    };
    handleLeaderboardRender = async () => {
        this.setState({
            showLeaderboard: !this.state.showLeaderboard,
        });
        await fetch("https://bollywoodbackend.herokuapp.com/api/leaderboard/")
            .then((res) => {
                return res.json();
            })
            .then((usersData) => {
                let rows = [];
                if (rows.length == usersData.length) {
                    return;
                } else {
                    rows = [];
                }
                usersData.sort(function (a, b) {
                    if (a.score > b.score) return -1;
                    if (a.score < b.score) return 1;
                    return 0;
                });
                for (let x = 0; x < Math.min(usersData.length, 30); x++) {
                    rows.push(
                        this.createData(
                            x + 1,
                            usersData[x].name,
                            usersData[x].score
                        )
                    );
                }
                this.setState({ rows });
            });
    };

    handleTimeChange = () => {
        if (this.state.movieComplete == false)
            this.setState({ currentTime: this.state.currentTime - 1 });
    };

    render() {
        // *********StartScreen*************
        if (this.state.hidden) {
            return (
                <div>
                    <div className="openingTitle">BOLLYWOOD!</div>
                    <div className="button">
                        <a className="transparent" href="#">
                            <p>
                                <span className="bg"></span>
                                <span className="base"></span>
                                <span
                                    className="text"
                                    onClick={() => {
                                        let mode = "casual";
                                        this.handleGameStart(mode);
                                    }}
                                >
                                    PLAY
                                </span>
                            </p>
                        </a>
                        <a className="white" href="#">
                            <p>
                                <span className="bg"></span>
                                <span className="base"></span>
                                <span
                                    className="text"
                                    onClick={() => {
                                        let mode = "rated";
                                        this.handleGameStart(mode);
                                    }}
                                >
                                    PLAY(RATED)
                                </span>
                            </p>
                        </a>
                        <a href="#">
                            <p>
                                <span className="bg"></span>
                                <span className="base"></span>
                                <span
                                    className="text"
                                    onClick={this.handleLeaderboardRender}
                                >
                                    {this.state.showLeaderboard
                                        ? "Hide Leaderboard"
                                        : "Show Leaderboard"}
                                </span>
                            </p>
                        </a>
                    </div>
                    <div>
                        {this.state.showLeaderboard ? (
                            <div>
                                <LeaderboardRender rows={this.state.rows} />
                            </div>
                        ) : null}
                    </div>
                </div>
            );
        }

        // ******************GameOverScreen***************************
        if (this.state.gameOver) {
            return (
                <div className="EndScreen">
                    <div className="strikeThroughTitle">BOLLYWOOD</div>
                    <div className="endScreenText">
                        <div style={{ color: "red" }}>Game Over</div>
                        <div>
                            The film was-
                            <span className="endScreenMovieName">
                                {this.state.movieName}
                            </span>
                        </div>
                    </div>
                    {this.state.isHighScore && !this.state.scoreSubmitted ? (
                        <div className="endScreenText">
                            Your score made it on the leaderboard!
                            <br />
                            <form onSubmit={this.handleLeaderboardSubmit}>
                                <label>
                                    Leaderboard Name:
                                    <input
                                        value={this.state.value}
                                        name="name"
                                        onChange={this.handleNameChange}
                                    />
                                </label>
                                <input
                                    className="hintButton"
                                    type="submit"
                                    value="Submit"
                                />
                            </form>
                        </div>
                    ) : (
                        <br />
                    )}
                    <br />
                    <div>
                        <div className="endScreenPlayButton">
                            <a className="transparent" href="#">
                                <p>
                                    <span className="bg"></span>
                                    <span className="base"></span>
                                    <span
                                        className="text"
                                        onClick={() => {
                                            let mode = "casual";
                                            this.handleGameStart(mode);
                                        }}
                                    >
                                        PLAY
                                    </span>
                                </p>
                            </a>
                            <a className="white" href="#">
                                <p>
                                    <span className="bg"></span>
                                    <span className="base"></span>
                                    <span
                                        className="text"
                                        onClick={() => {
                                            let mode = "rated";
                                            this.handleGameStart(mode);
                                        }}
                                    >
                                        PLAY(RATED)
                                    </span>
                                </p>
                            </a>
                            <a href="#">
                                <p>
                                    <span className="bg"></span>
                                    <span className="base"></span>
                                    <span
                                        className="text"
                                        onClick={this.handleLeaderboardRender}
                                    >
                                        {this.state.showLeaderboard
                                            ? "Hide Leaderboard"
                                            : "Show Leaderboard"}
                                    </span>
                                </p>
                            </a>
                        </div>
                        <br />

                        <div>
                            {this.state.showLeaderboard ? (
                                <div>
                                    <LeaderboardRender rows={this.state.rows} />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            );
        }

        // **********************PlayScreen*********************
        return (
            <div className="PlayScreen">
                <div>
                    {bollywoodHeader.map((bollyChar, i) => (
                        <a
                            className={
                                8 - this.state.lives >= i
                                    ? "strikeThroughTitle"
                                    : "openingTitle"
                            }
                        >
                            {bollyChar}
                        </a>
                    ))}
                    {this.state.playMode == "rated" ? (
                        <Timer
                            initialSeconds={this.state.currentTime}
                            gameOver={this.handleGameEnd}
                            updateTime={this.handleTimeChange}
                            currentTime={this.state.currentTime}
                        />
                    ) : (
                        <br />
                    )}
                    <div className="lives">Lives: {this.state.lives}</div>
                    <br />
                    <div className="score">Score: {this.state.gameScore}</div>
                    <br />
                    <div className="movieTitle">{this.state.visibleName}</div>
                    <br />
                    <div className="playButton">
                        {!this.state.movieComplete
                            ? alphabets.map((keyboard, i) => (
                                  <a
                                      className={
                                          this.state.pressed.includes(keyboard)
                                              ? "white"
                                              : "transparent"
                                      }
                                      key={i}
                                      href="#"
                                  >
                                      <p>
                                          <span className="bg"></span>
                                          <span className="base"></span>
                                          <span
                                              className="text"
                                              onClick={() =>
                                                  this.handleClickChar({
                                                      keyboard,
                                                  })
                                              }
                                          >
                                              {keyboard}
                                          </span>
                                      </p>
                                  </a>
                              ))
                            : null}
                    </div>
                    {this.state.playMode == "casual" &&
                    !this.state.movieComplete ? (
                        <Hint
                            // fullDetails={this.state.fullDetails}
                            // showHint={this.state.showHint}
                            state={this.state}
                            handleHintClick={this.handleHintClick}
                        />
                    ) : null}

                    <div>
                        {this.state.movieComplete ? (
                            <button
                                className="nextMovieButton"
                                onClick={() => this.handleNextMovie()}
                            >
                                Next Movie
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
