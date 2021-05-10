import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
//try states again
const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});
// function createData(name, calories, fat, carbs, protein) {
//     return { name, calories, fat, carbs, protein };
// }

function createData(rank, name, score) {
    return { rank, name, score };
}

var rows = [
    // createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    // createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    // createData("Eclair", 262, 16.0, 24, 6.0),
    // createData("Cupcake", 305, 3.7, 67, 4.3),
    // createData("Gingerbread", 356, 16.0, 49, 3.9),
];

var loaded = false;
const fillRows = async () => {
    await fetch("http://localhost:5000/api/leaderboard/")
        .then((res) => {
            return res.json();
        })
        .then((usersData) => {
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
            // console.log(usersData);
            for (let x = 0; x < usersData.length; x++) {
                rows.push(
                    createData(x + 1, usersData[x].name, usersData[x].score)
                );
            }
        });
};

export default function LeaderboardRender(props) {
    const classes = useStyles();
    console.log(props);
    fillRows();
    if (props.rows.length)
        return (
            <div className="leaderboardTable">
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Rank</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Score</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.rows.map((row) => (
                                <TableRow key={row.rank}>
                                    <TableCell component="th" scope="row">
                                        {row.rank}
                                    </TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.score}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    else return <div></div>;
}
