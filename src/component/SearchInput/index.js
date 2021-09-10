import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import debounce from 'lodash/debounce';
import { Input } from 'antd';
import styles from './style.less';
import { getDeskData } from '../../config/api';
import formatText from '../../helpers/format';
import { isObject, isArray } from '../../helpers/object';
//import PropTypes from 'prop-types'

function SearchInput({ debounceTimeout = 100, onSelect, buildingId }) {
  const [List, setList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showWarper, setShowWarper] = useState(false);
  const timer = useRef(null);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      getDeskData(value).then(({ data, success }) => {
        if (success && isObject(data)) {
          if (isArray(data.content)) {
            const arr = data.content.filter((item) => !!item.userGroups) || [];
            if (arr.length > 0) {
              setShowWarper(true);
              setList(arr);
            }
          }
        }
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [getDeskData, debounceTimeout, buildingId]);

  const autoClose = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      setShowWarper(false);
      setInputValue('');
    }, 1000 * 60);
  }, [showWarper]);

  const handleSelectItem = (item) => {
    autoClose();
    setInputValue(item.userName);
    setShowWarper(false);
    onSelect(item);
  };

  const handleValueChange = (e) => {
    const value = e.target.value;
    if (value && `${value}`.trim()) {
      debounceFetcher({
        pageNumber: 1,
        pageSize: 100,
        userName: value,
        buildingId,
      });
    } else {
      setList([]);
    }
    setInputValue(value);
    autoClose();
  };
  const handleClose = () => {
    setInputValue('');
    setShowWarper(false);
  };

  return (
    <div className={styles.warper}>
      <div className={styles.content}>
        <i />
        <Input
          placeholder={formatText('STUF_SEARCH')}
          onChange={handleValueChange}
          value={inputValue}
          allowClear
          className={styles.search}
        />
      </div>
      {Array.isArray(List) && List.length > 0 && showWarper && (
        <div className={styles.mask} onClick={handleClose}>
          <div className={styles.listWarper}>
            {List.map((item, idx) => {
              return (
                <div
                  key={`${item.userId}${idx}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleSelectItem(item);
                  }}
                >
                  {item.userName}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchInput;
