// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from './02'

function Board({squares, onClick}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  const status = calculateStatus(squares)

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  // Managed State
  const [currentSquares, setCurrentSquares] = useLocalStorageState(
    'squares',
    Array(9).fill(null),
  )
  const [moves, setMoves] = useLocalStorageState([])

  // Derived State (will recompute after rerendering)
  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  function selectSquare(square) {
    if (winner || currentSquares[square]) {
      return
    }

    let squaresCopy = [...currentSquares]
    squaresCopy[square] = nextValue
    setCurrentSquares(squaresCopy)
    setMoves([...moves, squaresCopy])
  }

  function restart() {
    setCurrentSquares(Array(9).fill(null))
  }

  function onHistoryClick(stepIndex, moves) {
    setCurrentSquares([...moves[stepIndex]])
    setMoves([...moves.slice(0, stepIndex)])
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{calculateMoves(moves, onHistoryClick)}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  if (squares)
    return winner
      ? `Winner: ${winner}`
      : squares.every(Boolean)
      ? `Scratch: Cat's game`
      : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares && squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  if (squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a]
      }
    }
    return null
  }

  return
}

function calculateMoves(moves, onStepClick) {
  return moves.map((step, index) => {
    if (index === 0) {
      return (
        <li>
          <button onClick={() => onStepClick(index, moves)}>
            Go to game start
          </button>
        </li>
      )
    }
    return (
      <li>
        <button onClick={() => onStepClick(index, moves)}>
          Go to step {index + 1}
        </button>
      </li>
    )
  })
}

function App() {
  return <Game />
}

export default App
