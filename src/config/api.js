import { request } from 'umi';
import { ENV_API_HOST, DESK_API_HOST, MEETING_API_HOST } from '@/config';

export function getWeather(params) {
  return request(`${ENV_API_HOST}/env/data/outdoor/current`, {
    method: 'get',
    params,
  });
}
export function getInnerAir(params) {
  return request(`${ENV_API_HOST}/env/data/indoor/current`, {
    method: 'get',
    params,
  });
}

export function getDeskData(params) {
  //return request('/space/desk/list', {
  //  method: 'get',
  //  params,
  //});

  return request(`${DESK_API_HOST}/facade/desk/list`, {
    method: 'get',
    params,
  });
}

export function getBuildingId(params) {
  return request(`${DESK_API_HOST}/facade/building`, {
    method: 'get',
    params,
  });
}
export function getMapData() {
  return request(
    `${DESK_API_HOST}/space/desk/list?deskBuildingId=&deskFloorId=&meetingBuildingId=&meetingFloorId=`,
    {
      method: 'get',
    }
  );
}

export function getMeetingUse(params) {
  return request(`${MEETING_API_HOST}/anyong/screen/space/use/count`, {
    method: 'get',
    params,
  });
}
export function getMeetingChart(params) {
  return request(
    `${MEETING_API_HOST}/anyong/screen/space/use?buildingId=&floorId=`,
    {
      method: 'get',
      params,
    }
  );
}
