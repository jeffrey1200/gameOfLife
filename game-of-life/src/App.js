import React, { useState, useRef, useCallback, useEffect } from "react";
import produce from "immer";
import "./App.css";
import Grid from "./components/Grid";

let operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

function App() {
  const numRows = 30;
  const numCols = 30;

  const generateEmptyGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }

    return rows;
  };

  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [generation, setGeneration] = useState(0);

  function checkGrid(i, k) {
    const newGrid = produce(grid, (gridCopy) => {
      gridCopy[i][k] = grid[i][k] ? 0 : 1;
    });
    setGrid(newGrid);
  }
  const [speed, setSpeed] = useState(500);

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    let validGrid = false;

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              validGrid = true;
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    if (validGrid) {
      setGeneration((e) => (e += 1));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(runSimulation, speed);

    return () => clearInterval(interval);
  }, [runSimulation, speed]);

  function startSimulation() {
    setRunning(!running);
    if (!running) {
      runningRef.current = true;
      runSimulation();
    }
  }

  function createRandomGrid() {
    setGeneration(0);
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(
        Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
      );
    }

    setGrid(rows);
  }
  function resetGrid() {
    setGrid(generateEmptyGrid());
    setGeneration(0);
  }

  function changeSpeed(e) {
    let value = e.target.value;
    setSpeed(value);
  }
  console.log(speed);
  return (
    <div className="App">
      <div
        className="buttons"
        style={{
          width: "90%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <p>Generation number {generation}</p>
        <button onClick={() => startSimulation()}>
          {running ? "stop" : "start"}
        </button>
        <button
          onClick={() => {
            resetGrid();
          }}
        >
          clear
        </button>
        <button onClick={() => createRandomGrid()}>random </button>
        <input
          style={{ direction: "rtl" }}
          id="speed"
          onChange={changeSpeed}
          type="range"
          min={200}
          max={800}
          value={speed}
        ></input>
      </div>
      <Grid checkGrid={checkGrid} grid={grid} />
    </div>
  );
}

export default App;
