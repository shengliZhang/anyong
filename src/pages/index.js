import { useState, useRef, useEffect } from 'react';
import { getLocale } from 'umi';
import fengmapSDK from 'fengmap';
import GlobalHeader from '@/component/GlobalHeader';
import MapAlert from '@/component/MapAlert';
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
} from '../config/api';

// 默认地图配色
const DefaultColors = {
  0: '#59deab', // 绿色
  3: '#ff6c6c', // 红色
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
  const mapCenterRef = useRef(null);
  const language = useRef(null);
  const weatherTimer = useRef(null);
  const buidingId = useRef(null);
  const floorChange = useRef(false);
  const [meetingUse, setMeetingUse] = useState({});
  const [weatherData, setWeatherData] = useState({});
  const [setFids, setSetFids] = useState('');
  const [clickData, setClickData] = useState({ show: false, data: {} });

  const _onMapLoaded = (e, map) => {
    MAP.current = map; // 保存地图
    //map.rotateTo({ to: 20, duration: 1 });
    map.rotateTo({ to: 0, duration: 1 });
    map.labelLanguage = language.current;
    intervalMapData();
    let groupID = 1;
    if (isObject(query)) {
      if (floorArr.includes(query.f)) {
        groupID = floorObj[query.f];
        map.focusGroupID = groupID;
      }
    }
    //setOpacity();
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
            if (
              Array.isArray(key?.fids) &&
              key.fids.includes(FID) &&
              (key?.status == 0 || key?.status == 3)
            ) {
              model?.target?.setColor &&
                model.target.setColor(DefaultColors[key.status], 1);
              model?.setColor && model.setColor(DefaultColors[key.status], 1);
            }
            if (
              key?.fids &&
              key.fids === FID &&
              (key?.status == 0 || key?.status == 3)
            ) {
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
      const { success, data } = await getMapData({
        deskFloorId: '12',
        meetingBuildingId: '23',
        meetingFloorId: '44',
        buildingId: 1,
      });
      if (success) {
        if (isObject(data) && isArray(data.content)) {
          if (!isEqual(mapData.current, data.content) || floorChange.current) {
            console.log('not same');
            mapData.current = data.content;
            setMapColor(data.content);
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
        floorId: '',
      });
      const mchart = await getMeetingChart();
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
      console.log('mchart is', mchart);
    } catch (error) {}
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
    if (Object.values(tarObj).length > 0 && tarObj.status == 0) {
      //setMeetingDetail({ ...tarObj, showAlert: true });
      setClickData({ show: true, data: tarObj });
    }
  };
  const handleFloorChange = (obj) => {
    floorChange.current = true;
    intervalMapData();
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

  // 获取室外天气 && 室内空气
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
    } catch (error) {}
  };

  useEffect(() => {
    language.current = getLocale() === 'en-US' ? 'en' : 'zh';
    //fetchBuidingId();
    getMeetingUseData();
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
    setClickData({ show: false, data: {} });
  };
  const handleSelectUser = (user) => {
    const { fids, floorName } = user;
    if (isString(floorName)) {
      const floor = floorName.replace(/[^0-9]/gi, '');
      if (
        floorArr.includes(floor) &&
        floorObj[floor] !== MAP.current.focusGroupID
      ) {
        MAP.current.focusGroupID = floorObj[floor];
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
    let fid = '';
    if (isString(fids)) {
      fid = fids;
    }
    if (isArray(fids) && fids.length > 0) {
      fid = fids[0];
    }
    setSetFids(fid);
    //setSetFids('5432523601317');
  };
  const handleFrash = () => {
    intervalMapData();
  };

  const handleTabChange = (type) => {
    console.log('tab is', type);
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

          <div ref={mapCenterRef} id="mapCenter" className={styles.mapCenter}>
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
          <ScreenRight meetingUse={meetingUse} weatherData={weatherData} />
        </div>
      </div>
      <MapAlert
        show={clickData.show}
        onClosed={handleClosedAlart}
        data={clickData.data}
      />
    </div>
  );
};

export default HomePage;
