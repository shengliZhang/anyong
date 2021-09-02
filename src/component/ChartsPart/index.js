import React from 'react';
import TitleWithIcon from '../TitleWithIcon';
import formatText from '../../helpers/format';
import Meeting from '../Meetings';
import Desk from '../Desk';

function Index({ meetingUse }) {
  return (
    <div>
      <TitleWithIcon name={`18F ${formatText('MEETING_USE')}`} />
      <Meeting data={meetingUse} />
      <TitleWithIcon name={`18F ${formatText('DESK_USE')}`} />
      <Desk />
    </div>
  );
}

export default Index;
