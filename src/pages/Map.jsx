import { useEffect, useContext, useState } from "react";
import { Navbar } from "../components";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { getPoints, postPoint } from '../services/mapService';
import { useAuth } from "../contexts/AuthContext";

const containerStyle = {
  width: "100vw",
  height: "100vh",
  position: "relative",
  overflow: "hidden",
  margin: 0,
  padding: 0,
};

const mapContainerStyle = {
  width: "100vw",
  height: "calc(100vh - 56px - 56px)",
  marginTop: "56px",
  marginBottom: "56px",
};

// Como pegar a posição atual do usuário?
// Dica: use Geolocation API do navegador
const center = {
  lat: -28.2628,
  lng: -52.4069,
};

export const Map = () => {
  const { token } = useAuth();
  const [markers, setMarkers] = useState([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    async function fetchMarkers() {
      try {
        const data = await getPoints(token);
        setMarkers(data.map(point => ({
          id: point.id,
          title: point.descricao || "Ponto",
          position: { lat: point.latitude, lng: point.longitude }
        })));
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchMarkers();
  }, [token]);

  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newPoint = {
      latitude: lat,
      longitude: lng,
      descricao: "Descrição do ponto",
    };
    try {
      const savedPoint = await postPoint(token, newPoint);
      const savedMarker = {
        id: savedPoint.id,
        title: savedPoint.descricao || "Novo Ponto",
        position: {
          lat: savedPoint.latitude,
          lng: savedPoint.longitude,
        },
      };
      setMarkers((prev) => [...prev, savedMarker]);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "#f5f5f5",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 400,
        height: "100vh",
        background: "#fff",
        boxShadow: "0 0 16px rgba(0,0,0,0.08)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Navbar fixa */}
        <div style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 400,
          height: 56,
          background: "#21B573",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}>
          <span style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 16,
            letterSpacing: 1,
          }}>CITYTOUR</span>
          <button
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: 28,
              cursor: "pointer",
              lineHeight: 1,
            }}
            onClick={() => window.history.back()}
            aria-label="Fechar"
          >×</button>
        </div>

        {/* Mapa */}
        <div style={{
          width: "100%",
          height: "calc(100vh - 56px - 56px)",
          marginTop: 56,
          marginBottom: 56,
        }}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center}
              zoom={13}
              onClick={handleMapClick}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {markers.map(marker => (
                <Marker
                  key={marker.id}
                  position={marker.position}
                  title={marker.title}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    scaledSize: { width: 40, height: 40 }
                  }}
                />
              ))}
            </GoogleMap>
          ) : (
            <div>Carregando mapa...</div>
          )}
        </div>

        {/* Footer/logo fixa */}
        <div style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 400,
          height: 80,
          background: "#21B573",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          flexDirection: "column",
          padding: 0,
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 24,
              letterSpacing: 2,
              fontFamily: "sans-serif",
              lineHeight: 1,
            }}>CITY</span>
            <span style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 20,
              letterSpacing: 2,
              fontFamily: "sans-serif",
              lineHeight: 1,
            }}>TOUR</span>
            <svg width="48" height="18" viewBox="0 0 48 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: 2 }}>
              <path d="M4 2C10 14 38 14 44 2" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
