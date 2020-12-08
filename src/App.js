import React, { useState, useCallback, useRef } from 'react'
import produce from 'immer'
import './App.css';
import Header from './Header/Header'

const numRows = 25
const numCols = 50

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
]

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0))
  }

  return rows;
}

function App() {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false)

  const runningRef = useRef()
  runningRef.current = running

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0
            operations.forEach(([x, y]) => {
              const newI = i + x
              const newK = k + y
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK]
              }
            })

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1
            }
          }
        }
      })
    })
    setTimeout(runSimulation, 50)
  }, [])

  return (
    <section className='game-box'>
      <Header />
      <div className="btn-container">

        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >{running ? 'stop' : 'start'}</button>
        <button
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(Array.from(Array(numCols), () => Math.random() > .8 ? 1 : 0))
            }

            setGrid(rows);
          }}
        >random</button>
        <button
          onClick={() => {
            setGrid(generateEmptyGrid());
          }}
        >clear</button>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 20px)`
      }}
        className="grid">
        {grid.map((rows, i) =>
          rows.map((col, k) =>
            <div className="grid-item" key={`${i}-${k}`}
              style={{
                width: 20, height: 20, backgroundColor: grid[i][k] ? '#00A6FB' :  '#0c3a52',
                border: "solid 1px gray"
              }}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                })
                setGrid(newGrid)

              }}
            />))}
      </div>
    </section>
  );
}

export default App;
