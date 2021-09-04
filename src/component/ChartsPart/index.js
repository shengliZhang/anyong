import React from 'react';
import TitleWithIcon from '../TitleWithIcon';
import formatText from '../../helpers/format';
import Meeting from '../Meetings';
import Desk from '../Desk';

function Index({ meetingUse, deskUse, floor }) {
  return (
    <div>
      <TitleWithIcon name={`${floor}F ${formatText('MEETING_USE')}`} />
      <Meeting data={meetingUse} />
      <TitleWithIcon name={`${floor}F ${formatText('DESK_USE')}`} />
      <Desk data={deskUse} />
    </div>
  );
}

export default Index;
