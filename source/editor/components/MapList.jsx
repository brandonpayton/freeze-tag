import React from 'react';

export default function MapList(props) {
  let mapItems = props.maps.map(
    map => (<li key={map.name} onClick={ e => props.selectMap(map.name) }>{map.name}</li>)
  );

  return mapItems.length > 0
    ? <ol>{mapItems}</ol>
    : <div>No maps found</div>;
};