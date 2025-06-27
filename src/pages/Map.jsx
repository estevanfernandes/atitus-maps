import { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { getPoints, postPoint } from '../services/mapService';
import { useAuth } from "../contexts/AuthContext";
import { InfoWindow } from "@react-google-maps/api";


const center = {
  lat: -28.2628,
  lng: -52.4069,
};

export const Map = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const { token } = useAuth();
  const [markers, setMarkers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newPointCoords, setNewPointCoords] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    async function fetchMarkers() {
      try {
        const data = await getPoints(token);
        setMarkers(data); // 
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchMarkers();
  }, [token]);

  const handleMapClick = (event) => {
    setNewPointCoords({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    setForm({ name: "", description: "" });
    setModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description) return;
    const newPoint = {
      name: form.name,
      description: form.description,
      latitude: newPointCoords.lat,
      longitude: newPointCoords.lng,
    };
    try {
      const savedPoint = await postPoint(token, newPoint);
      const savedMarker = {
        id: savedPoint.id,
        title: savedPoint.name, // Corrigido para mostrar o nome
        description: savedPoint.description, // Adicionado para mostrar a descrição
        position: {
          lat: savedPoint.latitude,
          lng: savedPoint.longitude,
        },
      };
      setMarkers((prev) => [...prev, savedMarker]);
      setModalOpen(false);
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
                  onClick={() => setSelectedMarker(marker)}
                />
              ))}
              {selectedMarker && (
                <InfoWindow
                  position={selectedMarker.position}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
                      padding: 16,
                      minWidth: 220,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <h3 style={{ margin: 0, color: "#21B573", fontSize: 18 }}>{selectedMarker.title}</h3>
                    <p style={{ margin: 0, color: "#444", fontSize: 15, whiteSpace: "pre-line" }}>
                      {selectedMarker.description}
                    </p>
                  </div>
                </InfoWindow>
              )}
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

        {/* novo ponto */}
        {modalOpen && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000,
          }}>
            <form
              onSubmit={handleModalSubmit}
              style={{
                background: "#fff",
                padding: 24,
                borderRadius: 12,
                boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
                minWidth: 280,
                gap: 12,
              }}
            >
              <h3 style={{ margin: 0, color: "#21B573" }}>Novo Ponto</h3>
              <input
                type="text"
                placeholder="Nome"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                required
              />
              <textarea
                placeholder="Descrição"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", minHeight: 60 }}
                required
              />
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ padding: "6px 16px", borderRadius: 6, border: "none", background: "#eee" }}>Cancelar</button>
                <button type="submit" style={{ padding: "6px 16px", borderRadius: 6, border: "none", background: "#21B573", color: "#fff" }}>Salvar</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};