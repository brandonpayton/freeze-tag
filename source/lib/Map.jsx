import React from 'react';
import Immutable from 'immutable';
import Point2D from 'kld-affine/lib/Point2D';
import wrapToRange from '../lib/wrap-to-range';

export default class Map {

  static tileTypes = {
    EMPTY_TILE: 0,
    WALLED_TILE: 1
  };

  constructor({ numColumns, numRows, tiles }) {
    function createTileList(numColumns, numRows) {
      let defaultColumn = Immutable.List.of(new Array(numColumns).fill(false));
      return new Immutable.List(new Array(numRows).fill(defaultColumn));
    }

    this.numColumns = numColumns;
    this.numRows = numRows;
    this.tiles = tiles || createTileList(numColumns, numRows);
  }

  updateTiles({ startPoint, endPoint, tileType }) {
    let updatedTiles = this.tiles;

    for(
      let columnDifference = endPoint.x - startPoint.x,
        columnStep = columnDifference < 0 ? -1 : 1,
        column = startPoint.x;
      column <= endPoint.x;
      column += columnStep
    ) {
      for (
        let rowDifference = endPoint.y - startPoint.y,
          rowStep = rowDifference < 0 ? -1 : 1,
          row = startPoint.y;
        row <= endPoint.y;
        row += rowStep
      ) {
        // TODO: Is it more efficient to make a mutable version, update, and return an immutable version?
        // TODO: Is there a way to make this a reduce() op?
        updatedTiles = updatedTiles.set(column, updatedTiles.get(column).set(row, tileType));
      }
    }

    return Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this,
      { tiles: updatedTiles }
    );
  }

  wrapPosition(position) {
    return new Point2D(
      wrapToRange(position.x, 0, this.numColumns),
      wrapToRange(position.y, 0, this.numRows)
    );
  }
}