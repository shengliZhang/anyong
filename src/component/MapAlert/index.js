import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'antd';
import styles from './style.less';
import Qrcode from 'qrcode.react';
//import { QRCODE_URL } from '../../config/index';
import formatText from '../../helpers/format';

function MapAlert(props) {
  const { show, data = {}, onClosed } = props;
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
      }, 1000 * 60);
      document.body.addEventListener('click', lisinerFun, true);
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
    console.log('hideModal invoked');
    onClosed && onClosed();
    if (timer.current) {
      clearTimeout(timer.current);
    }
  };

  console.log('data is', data);
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
      }}
    >
      <div className={styles.alartContainer}>
        <div className={styles.closed} />
        <div className={styles.title}>
          <p>{formatText('USE_WECHART')}</p>
          <p>{formatText('SCAN_BOOK')}</p>
        </div>
        <div className={styles.qrcodes}>
          <div>
            <Qrcode
              bgColor="rgba(0,0,0,1)"
              fgColor="rgba(255,255,255, 1)"
              value={data.qrCode}
              size={262}
            />
          </div>
        </div>
        <div className={styles.deskName}>{data.name}</div>
      </div>
    </Modal>
  );
}

export default MapAlert;
