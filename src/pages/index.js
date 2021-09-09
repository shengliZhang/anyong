import { useState, useRef, useEffect } from 'react';
import { getLocale } from 'umi';
import fengmapSDK from 'fengmap';
import dayjs from 'dayjs';
import { message } from 'antd';
import GlobalHeader from '@/component/GlobalHeader';
import MapAlert from '@/component/MapAlert';
import BookModal from '@/component/BookModal';
import ScreenRight from '@/component/ScreenRight';
import { isObject, isArray, isString, isEqual } from '../helpers/object';
import Map from '../component/Map';
import formatText from '../helpers/format';
import SearchInput from '../component/SearchInput';
import styles from './index.less';
import { mapId } from '../config/index';
import SwitchTabs from '../component/SwitchTab';
import {
  getMeetingUse,
  getWeather,
  getBuildingId,
  getInnerAir,
  getMapData,
  getMeetingChart,
  getDeskUse,
  getDeskChart,
  bookDesk,
  getFloorId,
} from '../config/api';

// 默认地图配色
const DefaultColors = {
  0: '#59deab', // 绿色
  1: '#ff6c6c', // 红色
  2: '#59deab', // 绿色
};
const floorArr = ['18', '20'];
const floorObj = {
  18: 1,
  20: 2,
};

const mapStatusIcon = [
  {
    color: '#59deab',
    text: 'FLOOR_CAN_USE',
  },
  {
    color: '#ffdc68',
    text: 'FLOOR_WETING',
  },
  {
    color: '#ff6c6c',
    text: 'FLOOR_USEING',
  },
  {
    color: '#9a91ff',
    text: 'FLOOR_OCP',
  },
];

const HomePage = ({ location }) => {
  const { query } = location;
  const mapData = useRef(null);
  const MAP = useRef(null);
  const mapTimer = useRef(null);
  const language = useRef(null);
  const weatherTimer = useRef(null);
  const buidingId = useRef(null);
  const floorChange = useRef(false);
  const [meetingUse, setMeetingUse] = useState({});
  const [deskUse, setDeskUse] = useState({});
  const [weatherData, setWeatherData] = useState({});
  const [setFids, setSetFids] = useState('');
  const [clickData, setClickData] = useState({
    show: false,
    data: { type: 'text' },
  });
  const CardNoRef = useRef(null);
  const fetchTimer = useRef(null);
  const showMode = useRef(null);
  const clickMapNode = useRef(null);
  const floorObject = useRef({});
  const [focusFloor, setFocusFloor] = useState(18);
  const [cardValue, setCardValue] = useState('');

  const _onMapLoaded = (e, map) => {
    MAP.current = map; // 保存地图
    //map.rotateTo({ to: 20, duration: 1 });
    map.rotateTo({ to: 0, duration: 1 });
    map.labelLanguage = language.current;
    intervalMapData();
    let groupID = 1;
    if (isObject(query)) {
      if (floorArr.includes(query.f)) {
        setFocusFloor(query.f);
        groupID = floorObj[query.f];
        map.focusGroupID = groupID;
      }
    } else {
      setFocusFloor(18);
    }
  };

  /**
   *设置地图颜色
   *
   * @param {*} data
   */
  const setMapColor = (data) => {
    const serverData = [...data];
    const request = { types: ['model'] };
    const groupId = MAP.current.focusGroupID;
    fengmapSDK.MapUtil.search(MAP.current, groupId, request, (result) => {
      if (result.length <= 0) return;
      for (let model of result) {
        if (model.target.FID && model.FID) {
          const { target } = model;
          const { FID } = target;
          for (let key of serverData) {
            if (Array.isArray(key?.fids) && key.fids.includes(FID)) {
              model?.target?.setColor &&
                model.target.setColor(DefaultColors[key.status], 1);
              model?.setColor && model.setColor(DefaultColors[key.status], 1);
            }
            if (key?.fids && key.fids === FID) {
              model?.target?.setColor &&
                model.target.setColor(DefaultColors[key.status], 1);
              model?.setColor && model.setColor(DefaultColors[key.status], 1);
            }
          }
        }
      }
    });
  };

  /**
   * 获取工位数据
   */
  const getDeskScreenDisplay = async () => {
    try {
      const { success, result } = await getMapData({
        deskFloorId: '', //focusFloor,
        meetingBuildingId: '',
        meetingFloorId: '', //focusFloor,
        deskBuildingId: '',
      });
      if (success) {
        if (isArray(result)) {
          if (!isEqual(mapData.current, result) || floorChange.current) {
            console.log('not same');
            const datas = result.filter((item) => {
              if (Array.isArray(item.fids)) {
                return !!item.fids[0];
              }
              return !!item.fids;
            });

            mapData.current = datas;
            setMapColor(datas);
          } else {
            console.log('data is same');
          }
        }
      }
    } catch (error) {
      console.log('getDeskScreenDisplay err', error);
    }
  };

  const getMeetingUseData = async () => {
    try {
      const { code, model } = await getMeetingUse({
        buildingId: '',
        floorId: floorObject.current[focusFloor] || '',
      });
      const mchart = await getMeetingChart({
        buildingId: '',
        floorId: floorObject.current[focusFloor] || '',
      });
      let use = {};
      if (code === 200 && isObject(model)) {
        let total = 0;
        Object.values(model).forEach((k) => {
          total += k;
        });
        use = { ...model, total };
      }
      setMeetingUse({
        use,
        chart: mchart.model,
      });
    } catch (error) {}
  };

  const handleBindSuccess = () => {
    const opts = {
      cardNo: cardValue,
      reserveBeginTime: clickMapNode.current.startTime,
      reserveEndTime: clickMapNode.current.endTime,
      reserveInfo: [
        {
          deskId: clickMapNode.current.id,
          userType: '0',
        },
      ],
    };
    bookByCard(opts);
  };

  const intervalMapData = () => {
    //if (!buidingId.current) {
    //  console.log('没有buidingId,开始轮询');
    //  fetchBuidingId();
    //  setTimeout(() => {
    //    intervalMapData();
    //  }, 1000);
    //  return;
    //}
    getDeskScreenDisplay();
    if (mapTimer.current) {
      clearInterval(mapTimer.current);
    }
    mapTimer.current = setInterval(() => {
      floorChange.current = false;
      getDeskScreenDisplay();
    }, 1000 * 30);
  };

  /**
   * 地图点击
   *
   * @param {*} event 当前点击的modal对象
   * @param {*} mapInstance 地图实例
   * @return {*}
   */
  const handleMapClickNode = (event, mapInstance) => {
    if (showMode.current !== 'book') return;
    //const { focusFloor } = mapInstance;
    const { mapCoord, target } = event;
    const { FID } = target;
    if (!FID) {
      return;
    }
    const arr = mapData.current;
    const tarObj =
      arr.find((item) => {
        if (isArray(item.fids) && item.fids.includes(FID)) return true;
        if (isString(item.fids) && item.fids === FID) return true;
        return false;
      }) || {};
    if (Object.values(tarObj).length > 0 && tarObj.status == 2) {
      console.log('tarObj iiss -->>', tarObj);
      clickMapNode.current = {
        ...tarObj,
        startTime: dayjs().add(5, 'minute').format('YYYY-MM-DD hh:mm:ss'),
        endTime: dayjs()
          .add(5, 'minute')
          .add(12, 'hour')
          .format('YYYY-MM-DD hh:mm:ss'),
      };
      setClickData({
        show: true,
        data: { data: { ...clickMapNode.current }, type: 'text' },
      });
      setTimeout(() => {
        CardNoRef.current.value = '';
        CardNoRef.current.focus();
      }, 1000);
    }
  };
  const handleFloorChange = (floor) => {
    floorChange.current = true;
    setFocusFloor(floor);
    intervalMapData();
    getMeetingUseData();
    fetchDeskUseData();
  };

  const fetchBuidingId = async () => {
    try {
      const { success, data } = await getBuildingId();
      if (success) {
        if (isArray(data) && data.length > 0) {
          const obj =
            data.find(
              (item) =>
                item?.buildingMap &&
                isObject(item.buildingMap) &&
                item.buildingMap.mapId === mapId
            ) || {};

          buidingId.current = obj.id;
          return;
        }
        if (isObject(data)) {
          buidingId.current = data.id;
        }
      }
    } catch (error) {}
  };

  // 获取室外天气 && 室内空气 && 会议室使用情况 和 工位使用情况
  const init = async (lang) => {
    try {
      const { code, result } = await getWeather({ lang });
      const airData = await getInnerAir();
      if (code === 200 || airData.code === 200) {
        setWeatherData({
          outWeather: result,
          innerAir: airData.result,
        });
      }
      getMeetingUseData();
      fetchDeskUseData();
    } catch (error) {}
  };

  const fetchDeskUseData = async () => {
    console.log('floorObject.current 工位 is', floorObject.current);
    try {
      const { code, result } = await getDeskUse({
        deskBuildingId: '',
        deskFloorId: floorObject.current[focusFloor] || '',
      });
      const desk = await getDeskChart({
        buildingId: '',
        floorId: floorObject.current[focusFloor] || '',
      });
      let use = {};
      if (code === 200 && isObject(result)) {
        let total = 0;
        Object.values(result).forEach((k) => {
          total += k;
        });
        use = { ...result, total };
      }
      setDeskUse({
        use,
        chart: desk,
      });
    } catch (error) {}
  };

  const fetchFloorId = () => {
    return getFloorId().then(({ code, model }) => {
      if (code === 200) {
        console.log('fetchFloorId is', model);
        const florObj = {};
        if (isArray(model)) {
          model.forEach((item) => {
            const { floorNum, floorId } = item;
            florObj[floorNum] = floorId;
          });
          floorObject.current = florObj;
        }
      }
    });
  };

  useEffect(() => {
    language.current = getLocale() === 'en-US' ? 'en' : 'zh';
    fetchBuidingId();
    fetchFloorId().then(() => {
      getMeetingUseData();
      fetchDeskUseData();
    });

    if (weatherTimer.current) {
      clearInterval(weatherTimer.current);
    }
    weatherTimer.current = setInterval(() => {
      init(language.current);
    }, 1000 * 60 * 60);
    init(language.current);

    return () => {
      if (mapTimer.current) {
        clearInterval(mapTimer.current);
      }
      clearInterval(weatherTimer.current);
    };
  }, []);

  const handleLangChange = (langs) => {
    if (MAP.current) {
      MAP.current.labelLanguage = langs;
      language.current = langs;
      init(langs);
    }
  };

  const handleClosedAlart = () => {
    setClickData({ show: false, data: { type: 'text' } });
  };
  const handleSelectUser = (user) => {
    const { fids, floorName } = user;
    if (isString(floorName)) {
      const floor = floorName.replace(/[^0-9]/gi, '');
      if (floorArr.includes(floor)) {
        if (floorObj[floor] !== MAP.current.focusGroupID) {
          message.warning(
            <div className={styles.searchWaring}>
              您所搜素的员工不在本楼层，请前往{floor}F楼层大屏搜索
            </div>,
            3
          );
          return;
        }
        //MAP.current.focusGroupID = floorObj[floor];
        setTimeout(() => {
          let fid = '';
          if (isString(fids)) {
            fid = fids;
          }
          if (isArray(fids) && fids.length > 0) {
            fid = fids[0];
          }
          setSetFids(fid);
        }, 500);
        return;
      }
    }
  };

  const handleFrash = () => {
    intervalMapData();
  };

  const handleTabChange = (type) => {
    showMode.current = type;
    if (type === 'book') {
      CardNoRef.current.value = '';
      CardNoRef.current.focus();
    }
  };

  const handleCardChange = (e) => {
    const { value } = e.target;
    setCardValue(value);
    debounce();
  };

  const debounce = () => {
    if (!clickMapNode.current) {
      return;
    }
    if (fetchTimer.current) {
      clearTimeout(fetchTimer.current);
    }
    fetchTimer.current = setTimeout(() => {
      const opts = {
        cardNo: cardValue,
        reserveBeginTime: clickMapNode.current.startTime,
        reserveEndTime: clickMapNode.current.endTime,
        reserveInfo: [
          {
            deskId: clickMapNode.current.id,
            userType: '0',
          },
        ],
      };
      bookByCard(opts);
    }, 200);
  };

  const bookByCard = async (params) => {
    try {
      const { code } = await bookDesk(params);
      CardNoRef.current.blur();
      if (code === 200) {
        setClickData((prev) => ({
          show: true,
          data: { ...prev.data, type: 'success' },
        }));
        intervalMapData();
      } else {
        setClickData((prev) => ({
          show: true,
          data: { ...prev.data, type: 'book' },
        }));
      }
    } catch (error) {
      console.log('bookByCard', error);
    }
  };

  const handleBookModalClosed = () => {
    setCardValue('');
    handleClosedAlart();
  };

  return (
    <div className={styles.container}>
      <GlobalHeader langChange={handleLangChange} />
      <div className={styles.content}>
        <div className={styles.left}>
          <SearchInput
            debounceTimeout={50}
            onSelect={handleSelectUser}
            buildingId={buidingId.current}
          />
          <div className={styles.mapStatus}>
            <div>
              {mapStatusIcon.map((k) => {
                return (
                  <p key={k.color} className={styles.mid}>
                    <i style={{ backgroundColor: k.color }} />
                    {formatText(k.text)}
                  </p>
                );
              })}
            </div>
          </div>

          <SwitchTabs onChange={handleTabChange} />

          <div className={styles.mapCenter}>
            <Map
              _onMapLoaded={_onMapLoaded}
              mapWidth={2057}
              mapHeight={1530}
              defaultMapScale={148}
              handleMapClickNode={handleMapClickNode}
              handleFloorChange={handleFloorChange}
              query={query}
              refresh={handleFrash}
              positionFid={setFids}
            />
          </div>
        </div>
        <div className={styles.right}>
          <ScreenRight
            meetingUse={meetingUse}
            deskUse={deskUse}
            weatherData={weatherData}
            floor={focusFloor}
          />
        </div>
      </div>
      <BookModal
        id={cardValue}
        show={clickData.show}
        deskData={clickData.data}
        onClosed={handleBookModalClosed}
        bindSuccess={handleBindSuccess}
        inputDom={CardNoRef.current}
      />
      <input
        ref={CardNoRef}
        onChange={handleCardChange}
        className={styles.cardNo}
      />
      {/*<MapAlert
        show={clickData.show}
        onClosed={handleClosedAlart}
        data={clickData.data}
      />*/}
    </div>
  );
};

export default HomePage;
