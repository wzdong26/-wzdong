/**
 * @title geoLocation
 * @description 基于原生geolocation实现的Promise方法
 * @author wzdong
 * @export {@link geoLocation}
 */
import type { GeoLocationError, GeoLocationOptions, GeoLocationResult } from './geolocationConf';
import { generateError, GEOLOCATION_ERROR } from './geolocationConf';

const geoLocation = ({
    enableHighAccuracy = true,
    timeout = 8000,
    maximumAge = 0,
    accuracyThreshold,
}: GeoLocationOptions = {}) => new Promise(
    (
        resolve: (geolocationPosition: GeoLocationResult) => void,
        reject: (geolocationError: GeoLocationError) => void
    ) => {
        // 原生h5 geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (data) => {
                    const {
                        coords: { accuracy },
                    } = data;
                    if (accuracy > (accuracyThreshold ?? Number.MAX_VALUE)) {
                        reject(generateError(GEOLOCATION_ERROR.LOW_ACCURACY));
                    }
                    resolve(data);
                },
                ({ code }) => reject(generateError(code)),
                {
                    enableHighAccuracy,
                    timeout,
                    maximumAge,
                }
            );
        } else {
            reject(generateError(GEOLOCATION_ERROR.NOT_SUPPORTED_ERR));
        }
    }
);

export default geoLocation;
