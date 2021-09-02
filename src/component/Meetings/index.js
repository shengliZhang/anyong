import React from 'react';
import Charts from '../Charts';
import TatolAndStatus from '../TatolAndStatus';

function Meeting({ data }) {
  return (
    <div style={{ marginBottom: '64px' }}>
      <TatolAndStatus type="meeting" data={data?.use} />
      <Charts type="meeting" data={data.chart} />
    </div>
  );
}

export default Meeting;
