"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coords = void 0;
class Coords {
    constructor(lat, lng) {
        if (!Coords.isValid(lat, lng)) {
            throw new Error(`Некорректные координаты: lat="${lat}", lng="${lng}"`);
        }
        this.lat = lat;
        this.lng = lng;
    }
    getLat() {
        return this.lat;
    }
    getLng() {
        return this.lng;
    }
    toString() {
        return `${this.lat},${this.lng}`;
    }
    equals(other) {
        return this.lat === other.lat && this.lng === other.lng;
    }
    static isValid(lat, lng) {
        if (!lat || typeof lat !== 'string')
            return false;
        if (!lng || typeof lng !== 'string')
            return false;
        const latNum = Number.parseFloat(lat);
        const lngNum = Number.parseFloat(lng);
        if (!Number.isFinite(latNum))
            return false;
        if (!Number.isFinite(lngNum))
            return false;
        if (latNum < -90 || latNum > 90)
            return false;
        if (lngNum < -180 || lngNum > 180)
            return false;
        return true;
    }
}
exports.Coords = Coords;
//# sourceMappingURL=coords.js.map