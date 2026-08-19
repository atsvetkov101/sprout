export class Coords {
  private readonly lat: string;
  private readonly lng: string;

  constructor(lat: string, lng: string) {
    if (!Coords.isValid(lat, lng)) {
      throw new Error(`Некорректные координаты: lat="${lat}", lng="${lng}"`);
    }
    this.lat = lat;
    this.lng = lng;
  }

  getLat(): string {
    return this.lat;
  }

  getLng(): string {
    return this.lng;
  }

  toString(): string {
    return `${this.lat},${this.lng}`;
  }

  equals(other: Coords): boolean {
    return this.lat === other.lat && this.lng === other.lng;
  }

  static isValid(lat: string, lng: string): boolean {
    if (!lat || typeof lat !== 'string') return false;
    if (!lng || typeof lng !== 'string') return false;

    const latNum = Number.parseFloat(lat);
    const lngNum = Number.parseFloat(lng);

    if (!Number.isFinite(latNum)) return false;
    if (!Number.isFinite(lngNum)) return false;

    // Широта: -90..90
    if (latNum < -90 || latNum > 90) return false;
    // Долгота: -180..180
    if (lngNum < -180 || lngNum > 180) return false;

    return true;
  }
}
