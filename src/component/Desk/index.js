import React from 'react';
import Charts from '../Charts';
import TatolAndStatus from '../TatolAndStatus';

function Deskpart({ data }) {
  return (
    <div>
      <TatolAndStatus data={data?.use} type="desk" />
      <Charts data={data?.chart} type="desk" />
    </div>
  );
}

export default Deskpart;
