import { useIntl } from 'umi';

function formatText(id) {
  const { messages, formatMessage } = useIntl();

  //console.log('intlsss is', intl);
  //return { messages, formatMessage };
  return messages[id];
}

export default formatText;
