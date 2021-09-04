import { useState, useEffect, useRef } from 'react';
import fengmapSDK from 'fengmap';
import { FengmapBase, Fengmap3DControl } from 'react-fengmap';
import PropTypes from 'prop-types';
import styles from './style.less';
import {
  appKey,
  mapId,
  appName,
  DEBUGER_TIP,
  themeId,
} from '../../config/index';
import { isObject, isString } from '../../helpers/object';
import { message } from 'antd';
const { UMI_PUBLIC_PATH } = require('../../config/umiconfig');
//const UMI_PUBLIC_PATH = window.location.href;

const startPointUrl = `/${UMI_PUBLIC_PATH}/assets/startPoint.png`;
const endPointUrl = `/${UMI_PUBLIC_PATH}/assets/endPoint.png`;

const mapServerURL = `/${UMI_PUBLIC_PATH}/maps`; // ''https://3dl.dfocus.top/api/static/maps'
const mapThemeURL = `/${UMI_PUBLIC_PATH}/maps/themes`; // ''https://3dl.dfocus.top/api/static/themes'

const floorObj = {
  18: 1,
  20: 2,
};
const floorObjrever = {
  1: 18,
  2: 20,
};
const floorArr = ['18', '20'];
const startObj = {
  1: {
    x: 13522860.1654,
    y: 3652704.8798,
  },
  2: {
    x: 13522871.338,
    y: 3652697.177,
  },
};
function Map(props) {
  const {
    _onMapLoaded,
    mapWidth,
    mapHeight,
    defaultMapScale,
    mapScaleLevelRange,
    handleMapClickNode,
    handleFloorChange,
    query = {},
    positionFid,
    refresh,
  } = props;
  const [defaultScale, setScale] = useState(defaultMapScale);
  const [ScaleLevelRange, setScaleLevelRange] = useState(mapScaleLevelRange);
  const [height, setHeight] = useState(mapHeight);
  const [width, setWidth] = useState(mapWidth);
  const [floor, setFloor] = useState({});
  const [showList, setShowList] = useState(false);
  const mapInstance = useRef(null);
  const navigation = useRef(null);
  const startPoniter = useRef(null);
  const endPoniter = useRef(null);
  const touch = useRef(null);

  useEffect(() => {
    setScale(() => defaultMapScale);
    setScaleLevelRange(() => mapScaleLevelRange);
    setHeight(() => mapHeight);
    setWidth(() => mapWidth);

    return () => {
      clearTimeout(touch.current);
    };
  }, [mapScaleLevelRange, defaultMapScale, mapHeight, mapWidth]);

  const mapLoad = (e, map) => {
    console.log('load map', map);
    mapInstance.current = map;
    if (!navigation.current) {
      _createNavigation(map);
    }

    map.setBackgroundColor('#fff', 0);
    const { listFloors, focusFloor } = map;
    setFloor({ listFloors, focusFloor });
    const groupID = 1;
    const startP = {
      options: {
        ...startObj[groupID],
        groupID,
        size: 64,
        url: startPointUrl,
      },
    };
    startPoniter.current = startP;
    //setStart(startP);
    _setRoute(startP, null);
    _onMapLoaded(e, map);
  };

  const _createNavigation = (map) => {
    navigation.current = new fengmapSDK.FMNavigation({
      //followPosition: true, //模拟导航时是否地图跟随,默认true
      //followAngle: true, //模拟导航时是否改变地图角度，默认false
      //lineMarkerHeight: 1, //导航线与楼层之间的高度偏移设置。默认是1
      lineStyle: {
        lineType: fengmapSDK.FMLineType.FMARROW,
        lineWidth: 6,
        //godColor: '#FF0000',   //设置线的颜色
        //godEdgeColor: '#4a82d2',   //设置边线的颜色
      },
      map: map,
    });
  };

  const _setRoute = (start, end, reset) => {
    if (!navigation.current) {
      return;
    }
    if ((start && end) || reset) {
      navigation.current.clearAll();
    }
    if (start && start.options) {
      navigation.current.setStartPoint(start.options, start.noMarker);
    }
    if (end && end.options) {
      navigation.current.setEndPoint(end.options, end.noMarker);
    }

    if (start && end) {
      navigation.current.drawNaviLine();
    }
  };

  const handleToChangeFlor = (focusFloor) => {
    const groupID = floorObj[focusFloor];

    if (mapInstance.current) {
      mapInstance.current.focusGroupID = groupID;
      setShowList((pre) => !pre);
    }
  };

  const compileFloor = (listFloors, focus) => {
    if (!showList) {
      return null;
    }
    return (
      <div className={styles.listWper}>
        {listFloors.map((k) => {
          return (
            <p
              className={`${styles.itm} ${focus == k ? styles.active : ''}`}
              key={k}
              onClick={() => handleToChangeFlor(k)}
            >
              {k}
            </p>
          );
        })}
      </div>
    );
  };

  const onFloorChange = (obj) => {
    const { gid } = obj;
    const startP = {
      options: {
        ...startObj[gid],
        groupID: gid,
        size: 64,
        url: startPointUrl,
      },
    };
    _setRoute(startP);
    startPoniter.current = startP;
    setFloor((pre) => ({ ...pre, focusFloor: floorObjrever[gid] }));
    handleFloorChange(floorObjrever[gid]);
  };

  const handleFloorClick = () => {
    setShowList((pre) => !pre);
  };

  const onMapModalClick = (event, mapInstance) => {
    debugger;
    const { focusFloor } = mapInstance;
    const { mapCoord, target } = event;
    console.log('event is', event);
    if (!target || !target?.FID) {
      return;
    }
    const groupID = floorObj[focusFloor];
    const endPt = {
      options: {
        ...mapCoord,
        size: 50,
        groupID,
        url: endPointUrl,
      },
    };
    endPoniter.current = endPt;
    //searchByFid();
    _setRoute(startPoniter.current, endPt, true);
    resetMap();
    handleMapClickNode(event, mapInstance);
  };

  const handleResetClick = () => {
    _setRoute(startPoniter.current, null, true);
    resetFun();
  };

  const resetMap = () => {
    if (touch.current) {
      clearTimeout(touch.current);
    }
    if (!mapInstance.current) {
      return;
    }
    touch.current = setTimeout(() => {
      resetFun();
    }, 1000 * 60);
  };

  const resetFun = () => {
    refresh && refresh();
    _setRoute(startPoniter.current, null, true);
    mapInstance.current.rotateTo({ to: 0, duration: 1 });
    mapInstance.current.viewMode = fengmapSDK.FMViewMode.MODE_2D;
    if (isObject(query)) {
      if (query.f && floorArr.includes(query.f)) {
        mapInstance.current.focusGroupID = floorObj[query.f];
        return;
      }
    }
    if (mapInstance.current.focusGroupID != 1) {
      mapInstance.current.focusGroupID = 1;
    }
  };

  const searchByFid = (fid) => {
    const searchAnalyser = new fengmapSDK.FMSearchAnalyser(mapInstance.current);
    const searchReq = new fengmapSDK.FMSearchRequest();
    searchReq.FID = fid;
    searchAnalyser.query(searchReq, (reseult) => {
      const endPt = {
        options: {
          size: 50,
          url: endPointUrl,
        },
      };

      if (Array.isArray(reseult) && reseult.length > 0) {
        const { groupID, mapCoord } = reseult[0];
        const { x, y } = mapCoord;
        endPt.options.groupID = groupID;
        endPt.options.x = x;
        endPt.options.y = y;
        endPoniter.current = endPt;
        _setRoute(startPoniter.current, endPt);
        resetMap();
        return;
      }
      if (isObject(reseult)) {
        const { groupID, mapCoord } = reseult;
        const { x, y } = mapCoord;
        endPt.options.groupID = groupID;
        endPt.options.x = x;
        endPt.options.y = y;
        endPoniter.current = endPt;
        _setRoute(startPoniter.current, endPt);
        resetMap();
        return;
      }
      if (DEBUGER_TIP === '1') {
        message.error(`fid-${fid}未在地图中找到位置`);
      }
    });
  };

  useEffect(() => {
    if (isString(positionFid) && positionFid.length > 3) {
      searchByFid(positionFid);
    }
  }, [positionFid]);

  return (
    <div className={styles.mapWaper}>
      <FengmapBase
        fengmapSDK={fengmapSDK}
        mapId={mapId}
        mapOptions={{
          modelSelectedEffect: false,
          key: appKey,
          appName: appName,
          defaultThemeName: themeId,
          mapServerURL,
          mapThemeURL,
          defaultMapScale: defaultScale,
          mapScaleLevelRange: ScaleLevelRange,
        }}
        loadingTxt="Loading..."
        gestureEnableController={{
          enableMapRotate: false, //旋转
          enableMapPinch: false, // 缩放
          enableMapIncline: true, // 倾斜
          enableMapPan: false, // 移动
          enableMapSingleTap: false, //不可单击
        }}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
        events={{
          loadComplete: mapLoad,
          focusGroupIDChanged: onFloorChange,
          mapClickNode: onMapModalClick,
        }}
      >
        <Fengmap3DControl
          ctrlOptions={{
            position: fengmapSDK.controlPositon.RIGHT_BOTTOM,
            imgURL: `${UMI_PUBLIC_PATH}/assets/`,
            init2D: true,
            viewModeButtonNeeded: true,
            groupsButtonNeeded: false,
            offset: { x: 150, y: 10 },
          }}
        />
      </FengmapBase>
      {Array.isArray(floor?.listFloors) && (
        <div className={styles.floorWarper}>
          {compileFloor(floor.listFloors, floor.focusFloor)}
          <div onClick={handleFloorClick} className={styles.cur}>
            {floor.focusFloor}
          </div>
        </div>
      )}
      <div className={styles.resetMap} onClick={handleResetClick} />
    </div>
  );
}

Map.propTypes = {
  mapWidth: PropTypes.number,
  _onMapLoaded: PropTypes.func,
  handleMapClickNode: PropTypes.func,
  mapId: PropTypes.string,
  appKey: PropTypes.string,
  appName: PropTypes.string,
  mapServerURL: PropTypes.string,
  mapThemeURL: PropTypes.string,
  mapHeight: PropTypes.number,
  defaultMapScale: PropTypes.number,
  mapScaleLevelRange: PropTypes.array,
  offset: PropTypes.object,
  resetOffset: PropTypes.object,
  handleFloorChange: PropTypes.func,
  Start: PropTypes.object,
  End: PropTypes.object,
  query: PropTypes.object,
};

export default Map;
