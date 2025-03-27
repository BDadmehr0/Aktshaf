import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polygon, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import * as turf from '@turf/turf';

// Sample walkable path GeoJSON and city boundary - put these in assets later
import walkablePaths from '../../assets/walkablePaths.json';
import cityBoundary from '../../assets/cityBoundary.json';

export default function HomeScreen() {
  const [location, setLocation] = useState<any>(null);
  const [trackedPoints, setTrackedPoints] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
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
        {/* City Border */}
        {cityBoundary.features.map((feature: any, idx: number) =>
          renderPolygonCoordinates(feature).map((coords: any, subIdx: number) => (
          <Polygon
            key={`${idx}-${subIdx}`}
            coordinates={coords}
            strokeColor="blue"
            fillColor="rgba(135,206,250,0.3)"
            strokeWidth={2}
            />
          ))
        )}


        {/* Walkable Paths */}
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
    top: 40,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    fontSize: 20,
    borderRadius: 10,
  },
});

