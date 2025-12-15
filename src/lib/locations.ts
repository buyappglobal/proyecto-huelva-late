// Diccionario para mapear pueblos a coordenadas (ya que la DB no tiene lat/lng)
export const SIERRA_COORDS: Record<string, { lat: number; lng: number }> = {
  'Linares de la Sierra': { lat: 37.8805, lng: -6.6219 },
  'Aracena': { lat: 37.8915, lng: -6.5626 },
  'Alájar': { lat: 37.8744, lng: -6.6633 },
  'Cortegana': { lat: 37.9102, lng: -6.8194 },
  'Fuenteheridos': { lat: 37.9022, lng: -6.6617 },
  'Galaroza': { lat: 37.9283, lng: -6.7083 },
  'Jabugo': { lat: 37.9167, lng: -6.7292 },
  'Almonaster la Real': { lat: 37.8714, lng: -6.7883 },
  'Zufre': { lat: 37.8333, lng: -6.5000 },
  'Higuera de la Sierra': { lat: 37.8361, lng: -6.4472 },
  'default': { lat: 37.8915, lng: -6.5626 }
};

export const getCoords = (pueblo: string) => {
  return SIERRA_COORDS[pueblo] || SIERRA_COORDS['default'];
};