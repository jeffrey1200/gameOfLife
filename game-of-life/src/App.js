import React, { useState, useRef, useCallback, useEffect } from "react";
import produce from "immer";
import "./App.css";
import Grid from "./components/Grid";
import * as presets from "./components/presetArrays/PresetArray";
import Rules from "./components/Rules";
import useInterval from "./components/UseInterval";

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
  const numRows = 50;
  const numCols = 50;
  const [generation, setGeneration] = useState(0);
  // const [size, setSize] = useState(100);
  const [speed, setSpeed] = useState(1500);
  const [running, setRunning] = useState(false);

  // const gridRef = useRef

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

  function checkGrid(i, k) {
    const newGrid = produce(grid, (gridCopy) => {
      gridCopy[i][k] = grid[i][k] ? 0 : 1;
    });
    setGrid(newGrid);
  }

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = () => {
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
      setGeneration((prevState) => (prevState += 1));
    }
  };
  useInterval(runSimulation, speed);

  // useEffect(() => {
  //   const interval = setInterval(runSimulation, speed);

  //   return () => clearInterval(interval);
  // }, [runSimulation, speed]);

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
    setRunning(!running);
  }

  function changeSpeed(e) {
    let value = e.target.value;
    setSpeed(value);
  }

  // function changeGridSize(e) {
  //   setSize(e.target.value);
  // }
  // console.log(grid);
  // // console.log(size);
  // // console.log(speed);

  function stepThroughSimulation() {}
  return (
    <div className="App">
      <h1 style={{ fontSize: "3em", padding: "20px 0" }}>
        Conway's Game Of Life
      </h1>
      <div
        className="buttons"
        style={{
          width: "49%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <p>Generation number: {generation}</p>
        {/* <img src="https://www.conwaylife.com/w/images/a/a0/Tumbler.gif"></img> */}
        <span>Select Pattern</span>
        <select defaultValue="default" name="preset">
          <option value="default" disabled hidden>
            Choose here
          </option>
          <option onClick={() => setGrid(presets.gosperGliderGun)}>
            Glider{" "}
          </option>
          <option onClick={() => setGrid(presets.pulsar)}>Pulsar </option>
          <option onClick={() => setGrid(presets.diamond)}>Diamond </option>
        </select>
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
        <label>
          Speed
          <input
            style={{ direction: "rtl" }}
            id="speed"
            onChange={changeSpeed}
            type="range"
            min={200}
            max={3000}
            value={speed}
          ></input>
        </label>
      </div>
      <div style={{ display: "flex" }}>
        <Grid checkGrid={checkGrid} grid={grid} running={running} />
        <Rules />
      </div>
    </div>
  );
}

export default App;
