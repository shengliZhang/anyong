import { useIntl } from 'umi';

function formatText(id) {
  const { messages, formatMessage } = useIntl();
  return messages[id];
}

export default formatText;
