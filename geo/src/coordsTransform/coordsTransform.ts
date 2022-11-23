/**
 * @title coordsTransform
 * @description WGS84(wgs) <-> GCJ-02(gcj) <-> BD-09(bd)
 * @import coordTransformAlgo
 */

import {
    CoordArr,
    wgsToGcj,
    gcjToBd,
    bdToGcj,
    wgsToBd,
} from './coordTransformAlgo';

type CoordLonLat = { lat: number; lon: number };
type CoordLngLat = { lat: number; lng: number };
type CoordLongitudeLatitude = { latitude: number; longitude: number };

type Coord = CoordLonLat | CoordLngLat | CoordLongitudeLatitude | CoordArr;

const isCoordLonLat = (coord: Coord): coord is CoordLonLat =>
    'lat' in coord && 'lon' in coord;
const isCoordLngLat = (coord: Coord): coord is CoordLngLat =>
    'lat' in coord && 'lng' in coord;
const isCoordLongitudeLatitude = (
    coord: Coord
): coord is CoordLongitudeLatitude =>
    'latitude' in coord && 'longitude' in coord;
const isCoordArr = (coord: Coord): coord is CoordArr =>
    coord instanceof Array && coord.length === 2;

type CoordsStandard = {
    coords: Coord[];
    readonly proj?: 'wgs84' | 'gcj02' | 'bd09';
};
type CoordsSimple = Coord[];
type Coords = CoordsStandard | CoordsSimple;

const isCoordsSimple = (coords: Coords): coords is CoordsSimple =>
    coords instanceof Array;

enum CoordsType {
    standard = 1,
    simplified,
}

const formatCoord = (coord: Coord): CoordArr => {
    if (isCoordArr(coord)) return coord;
    if (isCoordLonLat(coord)) return [coord.lon, coord.lat];
    if (isCoordLngLat(coord)) return [coord.lng, coord.lat];
    if (isCoordLongitudeLatitude(coord)) return [coord.longitude, coord.latitude];
    return coord;
};
const formatCoords = (coords: Coords): CoordsSimple => {
    if (isCoordsSimple(coords)) return coords;
    return coords.coords;
};

interface TransformType {
    from?: 'wgs84' | 'gcj02' | 'bd09';
    to?: 'gcj02' | 'bd09';
}

const coordsTransform = (

    { from, to }: TransformType,
    outputType: CoordsType = CoordsType.standard
): (coords: Coords) => Coords => {
    if (!from) {
        throw new Error('坐标转换失败！transformType.from入参缺失！');
    }
    if (!to) {
        throw new Error('坐标转换失败！transformType.to入参缺失！');
    }
    if (from === to) {
        throw new Error('坐标转换失败！transformType.from和to入参相同！');
    }
    return (coords: Coords) => {
        const transformedCoords = formatCoords(coords).map((coord) => {
            const formattedCoord = formatCoord(coord);
            if (from === 'wgs84' && to === 'gcj02') {
                return wgsToGcj(formattedCoord);
            }
            if (from === 'wgs84' && to === 'bd09') {
                return wgsToBd(formattedCoord);
            }
            if (from === 'gcj02' && to === 'bd09') {
                return gcjToBd(formattedCoord);
            }
            if (from === 'bd09' && to === 'gcj02') {
                return bdToGcj(formattedCoord);
            }
            return formattedCoord;
        });

        if (outputType === CoordsType.standard) {
            return { coords: transformedCoords, proj: to };
        }
        return transformedCoords;
    }
};

export default coordsTransform;
