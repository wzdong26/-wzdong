/**
 * @title coordTransformAlgo
 * @author wzdong
 * @description WGS84(wgs) <-> GCJ-02(gcj) <-> BD-09(bd)
 * @exports {@link wgsToGcj} wgs -> gcj
 * @exports {@link gcjToBd} gcj -> bd
 * @exports {@link bdToGcj} bd -> gcj
 * @exports {@link wgsToBd} wgs -> bd
 */
export type CoordArr = [lon: number, lat: number]; // [lon, lat]

interface CoordTransformFn {
    (coords: CoordArr): CoordArr;
}

const outOfChina = ([lon, lat]: CoordArr): boolean =>
    !(lon > 72.004 && lon < 137.8347 && lat > 0.8293 && lat < 55.8271);

const transformLatWithXY = (x: number, y: number) => {
    const PI = Math.PI;
    let lat = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    lat += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0;
    lat += ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) / 3.0;
    lat += ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) * 2.0) / 3.0;
    return lat;
};

const transformLonWithXY = (x: number, y: number) => {
    const PI = Math.PI;
    let lon = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    lon += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0;
    lon += ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) / 3.0;
    lon += ((150.0 * Math.sin((x / 12.0) * PI) + 300.0 * Math.sin((x / 30.0) * PI)) * 2.0) / 3.0;
    return lon;
};

// 转换算法
export const wgsToGcj: CoordTransformFn = ([longitude, latitude]) => {
    // 必要常量
    // PI
    const PI = Math.PI;
    // 克拉索索夫斯基椭球长半轴长，也叫赤道半径，a
    const a = 6378245.0;
    // 克拉索索夫斯基椭球第一偏心率的平方，e^2
    const ee = 0.00669342162296594323;

    if (outOfChina([longitude, latitude])) {
        return [longitude, latitude];
    }
    let adjustLat = transformLatWithXY(longitude - 105.0, latitude - 35.0);
    let adjustLon = transformLonWithXY(longitude - 105.0, latitude - 35.0);
    const radLat = (latitude / 180.0) * PI;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    adjustLat = (adjustLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * PI);
    adjustLon = (adjustLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * PI);
    return [longitude + adjustLon, latitude + adjustLat];
};

export const gcjToBd: CoordTransformFn = ([longitude, latitude]) => {
    // 必要常量
    const X_PI = (Math.PI * 3000.0) / 180.0;

    const z = Math.sqrt(longitude * longitude + latitude * latitude) + 0.00002 * Math.sin(latitude * X_PI);
    const theta = Math.atan2(latitude, longitude) + 0.000003 * Math.cos(longitude * X_PI);
    const a_latitude = z * Math.sin(theta) + 0.006;
    const a_longitude = z * Math.cos(theta) + 0.0065;

    return [a_longitude, a_latitude];
};

export const bdToGcj: CoordTransformFn = ([longitude, latitude]) => {
    const X_PI = (Math.PI * 3000.0) / 180.0;

    const x = longitude - 0.0065;
    const y = latitude - 0.006;
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
    const a_latitude = z * Math.sin(theta);
    const a_longitude = z * Math.cos(theta);

    return [a_longitude, a_latitude];
};

export const wgsToBd: CoordTransformFn = (coord) => gcjToBd(wgsToGcj(coord));
