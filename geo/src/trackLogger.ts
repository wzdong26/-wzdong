/**
 * @title trackLogger
 * @description User track recorder
 * @author wzdong
 * @export 
 */
import type { GeoLocationOptions, GeoLocationResult, GeoLocationError } from './geolocationConf';
import { generateError, GEOLOCATION_ERROR } from './geolocationConf';


interface TrackLoggerOptions {
    interval: number
}
export default function trackLogger(options: TrackLoggerOptions) {
    let watchGeolId: number, data: GeolocationPosition[];
    const watchPosition = ({
        enableHighAccuracy = true,
        timeout = 3000,
        maximumAge = 0,
        accuracyThreshold,
    }: GeoLocationOptions) => {
        if (watchGeolId) return;
        data = [];
        watchGeolId = navigator.geolocation.watchPosition(res => {
            const {
                coords: { accuracy },
            } = res;
            if (accuracy > (accuracyThreshold ?? Number.MAX_VALUE)) {
                generateError(GEOLOCATION_ERROR.LOW_ACCURACY)
            }
            data.push(res)
        },
            ({ code, message }) => {
                console.warn(`WATCH_POSITION_ERROR(${code}): ${message}`)
            },
            {
                enableHighAccuracy,
                timeout,
                maximumAge,
            })
    }
    const clearWatch = () => {
        if (watchGeolId) {
            navigator.geolocation.clearWatch(watchGeolId)
        }
    }
}
