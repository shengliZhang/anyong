import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, message } from 'antd';
import styles from './style.less';
import { bindCardByEmail } from '../../config/api';
import formatText from '../../helpers/format';

function BookModal(props) {
  const { show, data = {}, onClosed, id } = props;
  //const { status } = data;
  const [isShow, setIsShow] = useState(false);
  const timer = useRef(null);
  useEffect(() => {
    const lisinerFun = () => {
      setIsShow(false);
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
    if (show) {
      setIsShow(true);
      timer.current = setTimeout(() => {
        setIsShow(false);
        onClosed && onClosed();
      }, 1000 * 60 * 360000);
      //document.body.addEventListener('click', lisinerFun, true);
    } else {
      setIsShow(false);
      if (timer.current) {
        clearTimeout(timer.current);
      }
      document.body.removeEventListener('click', lisinerFun);
    }
    return () => {
      document.body.removeEventListener('click', lisinerFun);
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [show, onClosed]);

  const hideModal = () => {
    //setIsShow(false);
    onClosed && onClosed();
    if (timer.current) {
      clearTimeout(timer.current);
    }
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
        <Tips />
        {/*<Success />*/}
        {/*<Faile />*/}
        {/*<Book id={id} />*/}
      </div>
    </Modal>
  );
}

export default BookModal;

function Tips(params) {
  return <div className={styles.tipsToBook}>请刷卡预订此工位</div>;
}

function Success(params) {
  return (
    <div className={styles.resultContainer}>
      <i className={styles.success} />
      <p>预订成功</p>
    </div>
  );
}
function Faile(params) {
  return (
    <div className={styles.resultContainer}>
      <i className={styles.error} />
      <p>预订失败</p>
    </div>
  );
}
function Book({ id }) {
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
        if (bindRes?.code === 200) {
        } else {
          //message.error(bindRes.message);
        }
      } catch (error) {
        console.error('bindCardByEmail error', error);
      }
    }
  };

  return (
    <div style={{ height: '500px' }} className={styles.resultContainer}>
      <div className={styles.title}>请绑定邮箱</div>
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
          placeholder="请输入邮箱"
        />
      </div>
      <div onClick={handleBind} className={styles.btn}>
        确定
      </div>
    </div>
  );
}
