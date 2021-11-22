import PropTypes from 'prop-types';
import styles from './index.less';

function Title(props) {
  const { name, location } = props;
  return (
    <div className={styles.container}>
      <div className={styles.warp}>
        <i className={styles.titleIcon} />
        <span>{name}</span>
      </div>
      <div>
        <span className={styles.city}>{location}</span>
      </div>
    </div>
  );
}

Title.propTypes = {
  name: PropTypes.string,
};

export default Title;
