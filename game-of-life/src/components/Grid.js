import React from "react";

const Ggrid = (props) => {
  const { checkGrid, grid, running } = props;

  return (
    <div
      // style={{ paddingLeft: "30px", width: "100%" }}

      // style={gridDisplay(30)}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${50},15px)`,
        // gridTemplateColumns: `repeat(auto-fit,minmax(40px,1fr))`,
        gridTemplateRows: `repeat(${50},15px)`,
        justifyContent: "center",
        width: "49%",
        background: "black",
      }}
    >
      {grid.map((rows, i) =>
        rows.map((col, k) => (
          <div
            //creates unique key from a 2d array
            key={`${i} - ${k}`}
            onClick={() => (running ? grid : checkGrid(i, k))}
            // style={cellDisplay(i, k, 7)}
            style={{
              width: 15,
              height: 15,
              backgroundColor: grid[i][k] ? "#39ff14" : undefined,
              border: "solid 1px white",
              // gridColumn: grid[i],
              // gridRow: grid[k],
            }}
          ></div>
        ))
      )}
    </div>
  );
};

export default Ggrid;
