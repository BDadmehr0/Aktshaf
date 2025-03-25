import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";

const App = () => {
  const [region, setRegion] = useState(null);
  Bundled;
  const [visitedAreas, setVisitedAreas] = useState([]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }, []);

  const handleRegionChange = (newRegion) => {
    setVisitedAreas([
      ...visitedAreas,
      { latitude: newRegion.latitude, longitude: newRegion.longitude },
    ]);
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={styles.map}
          initialRegion={region}
          onRegionChangeComplete={handleRegionChange}
        >
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            title="You"
          />
          <Polygon
            coordinates={visitedAreas}
            strokeColor="blue"
            fillColor="rgba(0,0,255,0.3)"
          />
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
});

export default App;

