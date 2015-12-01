import React from 'react';
import Map from '../../lib/Map';

class MapCanvas extends React.Component {
  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  render() {
    let {
      startProposedWall,
      endProposedWall,
      commitProposedWall,
      abortProposedWall,
      proposedWall,
      map,
      proposedTileType } = this.props;

    // TODO: Switch from "Point" to "Position"
    function eventToPoint(e) {
      return {
        // TODO: Stop using nativeEvent if possible.
        x: Math.floor(e.nativeEvent.offsetX / e.target.offsetWidth * map.numColumns),
        y: Math.floor(e.nativeEvent.offsetY / e.target.offsetWidth * map.numRows)
      };
    }

    function onMouseDown(e) {
      if (e.button === 0) {
        startProposedWall(eventToPoint(e));
      }
    }
    function onMouseMove(e) {
      if (e.button === 0 && proposedWall) {
        endProposedWall(eventToPoint(e));
      }
    }
    function onMouseUp(e) {
      if (e.button === 0) {
        commitProposedWall(
          Object.assign({}, proposedWall, { tileType: proposedTileType })
        );
      }
    }

    return (
      <canvas ref="canvas"
        width="400"
        height="400"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        />
    );
  }

  draw() {
    let { map, proposedWall } = this.props;
    let { numColumns, numRows } = map;
    let { canvas } = this.refs;
    let { width, height } = canvas;
    let context = canvas.getContext('2d');
    let columnWidth = canvas.width / numColumns;
    let rowHeight = canvas.height / numRows;

    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.beginPath();

    for (let i = 0; i <= numColumns; ++i) {
      let x = i * columnWidth;
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
    }

    for (let i = 0; i <= numRows; ++i) {
      let y = i * rowHeight;
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
    }

    context.strokeStyle = 'red';
    context.stroke();
    context.closePath();

    context.fillStyle = 'blue';

    map.tiles.forEach((columnList, i) => {
      columnList.forEach((tile, j) => {
        if (tile === Map.tileTypes.WALLED_TILE) {
          context.fillRect(i * columnWidth, j * rowHeight, columnWidth, rowHeight);
        }
      })
    });

    if (proposedWall) {
      let start = proposedWall.normalizedStart;
      let end = proposedWall.normalizedEnd;

      context.fillStyle = '#AAF';
      context.fillRect(
        start.x * columnWidth,
        start.y * rowHeight,
        (end.x - start.x) * columnWidth + columnWidth,
        (end.y - start.y) * rowHeight + rowHeight
      );
    }
  }
}

export default MapCanvas;