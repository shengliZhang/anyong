import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, message } from 'antd';
import styles from './style.less';
import { useIntl } from 'umi';
import { bindCardByEmail } from '../../config/api';
import dayjs from 'dayjs';
import formatText from '../../helpers/format';

const comEmu = {
  text: Tips,
  success: Success,
  faile: Faile,
  book: Book,
};
function BookModal(props) {
  const { show, deskData = {}, onClosed, id, bindSuccess, code } = props;
  const { status, data, type = 'text' } = deskData;
  const [isShow, setIsShow] = useState(false);
  const [comType, setType] = useState('text');
  const [errText, setErrText] = useState('');
  const timer = useRef(null);
  const formatTextMsg = useIntl().messages;
  useEffect(() => {
    if (show) {
      setIsShow(true);
      startTimer();
      setType(type);
      if (Number(code) === 207) {
        setErrText(formatTextMsg['NOT_EXITS']);
      }
      //document.body.addEventListener('click', lisinerFun, true);
    } else {
      setIsShow(false);
      if (timer.current) {
        clearTimeout(timer.current);
      }
      //document.body.removeEventListener('click', lisinerFun);
    }
    return () => {
      //document.body.removeEventListener('click', lisinerFun);
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [show, type, code]);

  const hideModal = () => {
    onClosed && onClosed();
    if (timer.current) {
      clearTimeout(timer.current);
    }
  };

  useEffect(() => {
    if (!data) {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      setIsShow(false);
      onClosed && onClosed();
    }
  }, [data]);

  const handleBindSuccess = () => {
    bindSuccess();
  };
  const handleBindFaile = () => {
    setType('faile');
    const abc = formatTextMsg['BIND_ERR'];
    setErrText(abc);
  };

  const startTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      setIsShow(false);
      onClosed && onClosed();
    }, 1000 * 30);
  };

  const handleClearTimer = () => {
    startTimer();
  };

  return (
    <Modal
      closable={false}
      visible={isShow}
      maskClosable
      onCancel={hideModal}
      width={450}
      afterClose={hideModal}
      wrapClassName={styles.Container}
      footer={null}
      maskStyle={{
        background: 'none',
        right: '1250px',
      }}
    >
      <div className={styles.alartContainer}>
        <div
          onClick={() => {
            setIsShow(false);
            onClosed && onClosed();
          }}
          className={styles.closed}
        />
        {comType === 'text' && <Tips data={data} />}
        {comType === 'success' && <Success />}
        {comType === 'faile' && <Faile text={errText} />}
        {comType === 'book' && (
          <Book
            id={id}
            onSuccess={handleBindSuccess}
            onFaile={handleBindFaile}
            clearTimer={handleClearTimer}
          />
        )}
      </div>
    </Modal>
  );
}

export default BookModal;

function Tips({ data }) {
  if (!data) return null;
  return (
    <div className={styles.tipsToBook}>
      <div className={styles.tipTit}>{formatText('SHUAKA')}</div>
      <div className={styles.tipName}>{data.name}</div>
      <div className={styles.tipTime}>
        {dayjs(data.startTime).format('YYYY-MM-DD HH:mm')}
      </div>
      <div className={styles.tipDef}>{formatText('DEFAULT_BOOK_TIME')}</div>
    </div>
  );
}

function Success(params) {
  return (
    <div className={styles.resultContainer}>
      <i className={styles.success} />
      <p>{formatText('SUCCESS')}</p>
    </div>
  );
}
function Faile({ text = formatText('FAILE') }) {
  return (
    <div className={styles.resultContainer}>
      <i className={styles.error} />
      <p>{text}</p>
    </div>
  );
}
function Book({ id, clearTimer, onSuccess, onFaile }) {
  const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  const [email, setValue] = useState('');
  const [errTip, setErrTip] = useState(false);
  const [card, setCard] = useState('');

  useEffect(() => {
    setCard(id);
  }, [id]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setValue(value);
    clearTimer();
    if (errTip) {
      setErrTip(false);
    }
  };

  const handleBlur = () => {
    if (!pattern.test(email)) {
      setErrTip(true);
    }
  };

  const handleBind = async () => {
    if (!errTip && pattern.test(email)) {
      try {
        const bindRes = await bindCardByEmail({
          cardNo: card,
          email,
        });
        if (bindRes?.code === 200 || bindRes.errorCode === 200) {
          onSuccess && onSuccess();
        } else {
          //message.error(bindRes.message);
          onFaile && onFaile(bindRes.errorCode);
        }
      } catch (error) {
        console.error('bindCardByEmail error', error);
      }
    }
  };

  return (
    <div style={{ height: '500px' }} className={styles.resultContainer}>
      <div className={styles.title}>{formatText('BIND_EMAIL')}</div>
      <div className={styles.id}>ID：{card}</div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className={`${styles.input} ${errTip ? styles.errorBorder : ''}`}
      >
        <Input
          value={email}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={formatText('INPUT_EMAIL')}
        />
      </div>
      <div onClick={handleBind} className={styles.btn}>
        {formatText('CONFIRM')}
      </div>
    </div>
  );
}
