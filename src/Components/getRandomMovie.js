// import { stockData } from "./MovieDatabase";

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
export const getRandomMovie = () => {
    const stockData = require("./popularMoviesSince1990.json");
    return stockData[getRandomInt(0, stockData.length - 1)];
};
