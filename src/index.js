import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {  

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
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
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        }
      ],
      xIsNext: true,
      stepNumber: 0,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    history.push({squares: squares});
    this.setState({
      history: history,
      xIsNext: !this.state.xIsNext,
      stepNumber: this.state.stepNumber + 1,
    })
  }

  jumpTo(step) {
    if (step === this.state.stepNumber) {
      return;
    }

    this.setState({
      xIsNext: (step % 2) === 0,
      stepNumber: step,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let desc = move > 0 ? `Go to move #${move}` : `Go to game start`;

      const locate = calculateLocate(history, move);
      if (locate !== null) {
        desc += ' ' + toLocateString(locate);
      }

      if (move === this.state.stepNumber) {
        desc = `${desc}`;
      }

      return (
        <li key={move}>
          <button 
            onClick={() => this.jumpTo(move)} 
            style={move === this.state.stepNumber ? {fontWeight:'bold'} : {fontWeight: 'normal'}}>
              {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : `O`}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick= {(i) => this.handleClick(i)}
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

ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    const sa = squares[a];
    if (sa) {
      const sb = squares[b];
      const sc = squares[c];
      if (sa === sb && sa === sc) {
        return sa
      }
    }
  }
  return null;
}

function calculateLocate(history, step) {
  if (step === 0) {
    return null;
  }

  const squares0 = history[step - 1].squares;
  const squares1 = history[step].squares;
  for (let i = 0; i < squares0.length; i++) {
    const s0 = squares0[i];
    const s1 = squares1[i];
    if (s1 !== s0) {
      return i;
    }
  }
  
  throw Error('Can not reach this line');
}

function toLocateString(id) {
  const row = parseInt(id / 3);
  const col = id % 3;
  return `(${row + 1}, ${col + 1})`;
}