import React from 'react';
import Charts from '../Charts';
import TatolAndStatus from '../TatolAndStatus';

function Deskpart() {
  return (
    <div>
      <TatolAndStatus type="desk" />
      <Charts type="desk" />
    </div>
  );
}

export default Deskpart;
