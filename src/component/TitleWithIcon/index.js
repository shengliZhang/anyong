import PropTypes from 'prop-types';
import styles from './index.less';

function Title(props) {
  const { name } = props;
  return (
    <div className={styles.warp}>
      <i className={styles.titleIcon} />
      <span>{name}</span>
    </div>
  );
}

Title.propTypes = {
  name: PropTypes.string,
};

export default Title;
