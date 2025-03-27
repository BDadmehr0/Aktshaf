import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polygon, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import * as turf from '@turf/turf';
import RNPickerSelect from 'react-native-picker-select';

import walkablePaths from '../assets/walkablePaths.json';
import cityBoundary from '../assets/cityBoundary.json';

export default function HomeScreen() {
  const [location, setLocation] = useState<any>(null);
  const [trackedPoints, setTrackedPoints] = useState<any[]>([]);
  const [currentCity, setCurrentCity] = useState<any>(null);
  const [manualSelection, setManualSelection] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      if (!manualSelection) {
        const detected = detectCurrentCity(loc.coords, cityBoundary);
        setCurrentCity(detected);
      }
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!location) return;
      let loc = await Location.getCurrentPositionAsync({});
      setTrackedPoints((prev) => [...prev, loc.coords]);
    }, 5000);
    return () => clearInterval(interval);
  }, [location]);

  const detectCurrentCity = (location: any, allCitiesGeoJSON: any) => {
    const point = turf.point([location.longitude, location.latitude]);

    for (let feature of allCitiesGeoJSON.features) {
      if (turf.booleanPointInPolygon(point, feature)) {
        return feature;
      }
    }
    return null;
  };

  const calculateCoverage = () => {
    if (trackedPoints.length < 2) return 0;

    const walkedLine = turf.lineString(
      trackedPoints.map(p => [p.longitude, p.latitude])
    );

    let walkedCount = 0;

    walkablePaths.features.forEach((feature: any) => {
      const pathLine = turf.lineString(feature.geometry.coordinates);
      const intersection = turf.lineIntersect(walkedLine, pathLine);
      if (intersection.features.length > 0) walkedCount++;
    });

    return (walkedCount / walkablePaths.features.length) * 100;
  };

  const renderPolygonCoordinates = (feature: any) => {
    const { type, coordinates } = feature.geometry;

    if (type === 'Polygon') {
      return [coordinates[0].map(([lng, lat]: [number, number]) => ({
        latitude: lat,
        longitude: lng,
      }))];
    }

    if (type === 'MultiPolygon') {
      return coordinates.map(polygon =>
        polygon[0].map(([lng, lat]: [number, number]) => ({
          latitude: lat,
          longitude: lng,
        }))
      );
    }

    return [];
  };

  if (!location) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <RNPickerSelect
        placeholder={{ label: 'شهر خود را انتخاب کنید...', value: null }}
        onValueChange={(value) => {
          const selectedCity = cityBoundary.features.find(f => f.properties.name === value);
          if (selectedCity) {
            setCurrentCity(selectedCity);
            setManualSelection(true);
          }
        }}
        items={cityBoundary.features
          .filter(f => f.properties?.shapeName)
          .sort((a, b) => a.properties.shapeName.localeCompare(b.properties.shapeName, 'fa'))
          .map(f => ({
            label: f.properties.shapeName,
            value: f.properties.shapeName
        }))}
      />

      <MapView
        style={styles.map}
        showsUserLocation
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* مرز شهر فعلی */}
        {currentCity &&
          renderPolygonCoordinates(currentCity).map((coords: any, subIdx: number) => (
            <Polygon
              key={`current-${subIdx}`}
              coordinates={coords}
              strokeColor="blue"
              fillColor="rgba(135,206,250,0.3)"
              strokeWidth={2}
            />
          ))}

        {/* مسیرهای قابل پیاده‌روی */}
        {walkablePaths.features.map((feature: any, idx: number) => (
          <Polyline
            key={idx}
            coordinates={feature.geometry.coordinates.map(
              ([lng, lat]: [number, number]) => ({
                latitude: lat,
                longitude: lng,
              })
            )}
            strokeColor="gray"
            strokeWidth={1}
          />
        ))}
      </MapView>

      <Text style={styles.overlayText}>
        {calculateCoverage().toFixed(1)}% Explored
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  overlayText: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    fontSize: 18,
    borderRadius: 10,
    zIndex: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

