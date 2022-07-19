import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

//This makes a single button
function Square(props){
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {

    //This is a method? To create our Square object, which is a button for us to press...
    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick= { () => this.props.onClick(i)}
        />;
    }


    render() {
        //Creates the actual board, 3 rows of 3 squares.
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    //Setting constructor to pass history state down to the board
    //Initial board state at the start of every game.
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    // Will be passed onto square, and change
    handleClick(i) {
        //If we time travel, slices all the "future" moves out of our state.
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        //The board view right now!
        const current = history[history.length -1]
        // Creating a new array for immutability
        const squares = current.squares.slice();
        // an early return to get out of function if a winner has been declared
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        // ternary to toggle true false???
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState(
            // history creates a board object {}, and puts it into an array.
            // since we're slicing, its a new array every time. we can add that array into our history array
            //So when the board is set, it will be history[0], move 1 will be history[1], can be accessed while on current
            //We use concat? it's good for immutability, push mutates.
            {history: history.concat([{
                squares: squares,
                }]),
                //The last index always
                stepNumber : history.length,
                xIsNext : !this.state.xIsNext,
            });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        // return all past steps/moves.
        const history = this.state.history;
        //Always the last index of history array
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        //HUH?!
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }


        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);


function calculateWinner(squares) {

    const lines = [
        //First 3 arrays check for all Xs or Os across
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        //Next 3 arrays check to see if all Xs or Os vertically
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        //These two are to check if diagonal win condition is met
        [0, 4, 8],
        [2, 4, 6],
    ];
    //for loop compares Xs and Os
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        //if all 3 spots in the array match the same value ("X" || "O"), return the winning array
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}