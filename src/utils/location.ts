import { LocationData, GPSFormat } from '../types/camera';

export const DEFAULT_LOCATION: LocationData = {
  street: '936 Jalan MT. Haryono',
  subdistrict: 'Peterongan',
  district: 'Kecamatan Semarang Selatan',
  city: 'Kota Semarang',
  province: 'Jawa Tengah',
  latitude: -6.992614,
  longitude: 110.428542,
  altitude: 28,
  speed: 0,
  compassHeading: 240,
  isRealLocation: false,
};

export async function fetchCurrentLocation(): Promise<LocationData> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(DEFAULT_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const alt = Math.round(pos.coords.altitude || 32);
        const spd = pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 0;
        const heading = pos.coords.heading || Math.floor(Math.random() * 360);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'id,en' } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const road = addr.road || addr.pedestrian || addr.suburb || 'Jl. MT Haryono';
            const houseNumber = addr.house_number ? `${addr.house_number} ` : '';
            const subdistrict = addr.neighbourhood || addr.suburb || addr.quarter || 'Peterongan';
            const district = addr.city_district || addr.subdistrict || 'Kecamatan Semarang Selatan';
            const city = addr.city || addr.town || addr.municipality || 'Kota Semarang';
            const province = addr.state || addr.province || 'Jawa Tengah';

            resolve({
              street: `${houseNumber}${road}`.trim(),
              subdistrict,
              district,
              city,
              province,
              latitude: lat,
              longitude: lon,
              altitude: alt,
              speed: spd,
              compassHeading: heading,
              isRealLocation: true,
            });
            return;
          }
        } catch {
          // fall back to default coordinates with real lat/long
        }

        resolve({
          ...DEFAULT_LOCATION,
          latitude: lat,
          longitude: lon,
          altitude: alt,
          speed: spd,
          isRealLocation: true,
        });
      },
      () => {
        resolve(DEFAULT_LOCATION);
      },
      { timeout: 8000, enableHighAccuracy: true, maximumAge: 30000 }
    );
  });
}

export function formatGPSCoordinates(lat: number, lon: number, format: GPSFormat): string {
  if (format === 'none') return '';
  if (format === 'decimal') {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(6)}° ${latDir}, ${Math.abs(lon).toFixed(6)}° ${lonDir}`;
  }
  if (format === 'dms') {
    const toDms = (val: number, isLat: boolean) => {
      const dir = isLat ? (val >= 0 ? 'N' : 'S') : val >= 0 ? 'E' : 'W';
      const abs = Math.abs(val);
      const deg = Math.floor(abs);
      const minFloat = (abs - deg) * 60;
      const min = Math.floor(minFloat);
      const sec = Math.floor((minFloat - min) * 60);
      return `${deg}°${min}'${sec}" ${dir}`;
    };
    return `${toDms(lat, true)} ${toDms(lon, false)}`;
  }
  if (format === 'utm') {
    return `UTM: 49S ${Math.round(436780 + lon * 100)} ${Math.round(9226800 + lat * 100)}`;
  }
  return '';
}

export function formatDateTime(date: Date, formatStyle: string): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const pad = (n: number) => n.toString().padStart(2, '0');

  const day = date.getDate();
  const monthStr = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  if (formatStyle === 'YYYY-MM-DD HH:mm:ss') {
    return `${year}-${pad(date.getMonth() + 1)}-${pad(day)} ${hours}:${minutes}:${seconds}`;
  }
  if (formatStyle === 'MM/DD/YYYY hh:mm:ss A') {
    const h12 = date.getHours() % 12 || 12;
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${pad(date.getMonth() + 1)}/${pad(day)}/${year} ${pad(h12)}:${minutes}:${seconds} ${ampm}`;
  }
  if (formatStyle === 'DD/MM/YYYY HH:mm:ss') {
    return `${pad(day)}/${pad(date.getMonth() + 1)}/${year} ${hours}:${minutes}:${seconds}`;
  }
  // Default style matching screenshot: "11 Nov 2026 13.16.26"
  return `${day} ${monthStr} ${year} ${hours}.${minutes}.${seconds}`;
}
