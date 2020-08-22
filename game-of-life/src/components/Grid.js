import React from "react";

const numCols = 30;

const Grid = (props) => {
  const { checkGrid, grid } = props;

  return (
    <div className="main">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
          justifyContent: "center",
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              //creates unique key from a 2d array
              key={`${i} - ${k}`}
              onClick={() => checkGrid(i, k)}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "pink" : undefined,
                border: "solid 1px black",
              }}
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default Grid;
