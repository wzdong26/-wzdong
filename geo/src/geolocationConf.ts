export interface GeoLocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
    accuracyThreshold?: number;
};

export type GeoLocationResult = GeolocationPosition;
export type GeoLocationError = { code: GEOLOCATION_ERROR; msg: string };

export enum GEOLOCATION_ERROR {
    PERMISSION_DENIED = 1,
    POSITION_UNAVAILABLE,
    TIMEOUT,
    NOT_SUPPORTED_ERR,
    LOW_ACCURACY,
};

// 在此配置错误msg
export const ERR_CODE_MSG = {
    [GEOLOCATION_ERROR.PERMISSION_DENIED]: '请开启定位权限！',
    [GEOLOCATION_ERROR.POSITION_UNAVAILABLE]: '获取定位失败！',
    [GEOLOCATION_ERROR.TIMEOUT]: '定位超时！',
    [GEOLOCATION_ERROR.NOT_SUPPORTED_ERR]: '当前浏览器不支持geolocation定位！',
    [GEOLOCATION_ERROR.LOW_ACCURACY]: '定位精度不满足！',
}

export const generateError = (code: GEOLOCATION_ERROR) => ({
    code,
    msg: ERR_CODE_MSG[code],
})
