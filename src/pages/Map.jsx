import { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { getPoints, postPoint } from '../services/mapService';
import { useAuth } from "../contexts/AuthContext";

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

  async function fetchMarkers() {
    try {
      const data = await getPoints(token);
      setMarkers(data);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
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
      await postPoint(token, newPoint);
      setModalOpen(false);
      fetchMarkers();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="map-background">
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          height: "100vh",
          background: "#fff",
          boxShadow: "0 0 16px rgba(0,0,0,0.08)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          border: "3px solid #21B573",
          borderRadius: 22,
        }}
      >
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

        {/* Modal de detalhes do ponto */}
        {selectedMarker && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
              backdropFilter: "blur(2px)",
              borderRadius: 22,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "32px 28px 24px 28px",
                borderRadius: 18,
                boxShadow: "0 8px 32px rgba(33,181,115,0.18)",
                minWidth: 320,
                maxWidth: 380,
                width: "90vw",
                position: "relative",
                fontFamily: "Inter, Arial, sans-serif",
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedMarker(null)}
                style={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  background: "none",
                  border: "none",
                  fontSize: 22,
                  color: "#21B573",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
                aria-label="Fechar"
              >
                ×
              </button>
              <h2
                style={{
                  margin: 0,
                  color: "#21B573",
                  fontWeight: 800,
                  fontSize: 22,
                  letterSpacing: 1,
                  textAlign: "center",
                }}
              >
                Detalhes do Ponto
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <label style={{ color: "#21B573", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                  Nome
                </label>
                <div
                  style={{
                    background: "#f7faf9",
                    borderRadius: 8,
                    padding: "10px 14px",
                    color: "#222",
                    fontWeight: 600,
                    fontSize: 16,
                    boxShadow: "0 1px 4px #21B57311",
                    marginBottom: 8,
                  }}
                >
                  {selectedMarker.title}
                </div>
                <label style={{ color: "#21B573", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                  Descrição
                </label>
                <div
                  style={{
                    background: "rgba(33,181,115,0.07)",
                    borderRadius: 8,
                    padding: "12px 14px",
                    color: "#333",
                    fontWeight: 400,
                    fontSize: 15.5,
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                    boxShadow: "0 1px 4px #21B57311",
                    minHeight: 50,
                    marginBottom: 8,
                  }}
                >
                  {selectedMarker.description}
                </div>
                <label style={{ color: "#21B573", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                  Latitude
                </label>
                <div
                  style={{
                    background: "#f7faf9",
                    borderRadius: 8,
                    padding: "8px 14px",
                    color: "#222",
                    fontWeight: 500,
                    fontSize: 15,
                    boxShadow: "0 1px 4px #21B57311",
                    marginBottom: 8,
                  }}
                >
                  {selectedMarker.position.lat}
                </div>
                <label style={{ color: "#21B573", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                  Longitude
                </label>
                <div
                  style={{
                    background: "#f7faf9",
                    borderRadius: 8,
                    padding: "8px 14px",
                    color: "#222",
                    fontWeight: 500,
                    fontSize: 15,
                    boxShadow: "0 1px 4px #21B57311",
                  }}
                >
                  {selectedMarker.position.lng}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de cadastro de novo ponto */}
        {modalOpen && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              backdropFilter: "blur(2px)",
              borderRadius: 22,
            }}
          >
            <form
              onSubmit={handleModalSubmit}
              style={{
                background: "#fff",
                padding: "32px 28px 24px 28px",
                borderRadius: 18,
                boxShadow: "0 8px 32px rgba(33,181,115,0.18)",
                display: "flex",
                flexDirection: "column",
                minWidth: 320,
                maxWidth: 380,
                gap: 18,
                position: "relative",
                fontFamily: "Inter, Arial, sans-serif",
              }}
            >
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  background: "none",
                  border: "none",
                  fontSize: 22,
                  color: "#21B573",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
                aria-label="Fechar"
              >
                ×
              </button>
              <h2
                style={{
                  margin: 0,
                  color: "#21B573",
                  fontWeight: 800,
                  fontSize: 24,
                  letterSpacing: 1,
                  textAlign: "center",
                }}
              >
                Novo Ponto
              </h2>
              <input
                type="text"
                placeholder="Nome do ponto"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  border: "1.5px solid #21B57355",
                  fontSize: 16,
                  outline: "none",
                  transition: "border 0.2s",
                  boxShadow: "0 2px 8px #21B57311",
                }}
                required
                autoFocus
              />
              <textarea
                placeholder="Descrição"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  border: "1.5px solid #21B57355",
                  fontSize: 15,
                  minHeight: 70,
                  resize: "vertical",
                  outline: "none",
                  transition: "border 0.2s",
                  boxShadow: "0 2px 8px #21B57311",
                }}
                required
              />
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: "8px 22px",
                    borderRadius: 7,
                    border: "none",
                    background: "#eee",
                    color: "#222",
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 22px",
                    borderRadius: 7,
                    border: "none",
                    background: "linear-gradient(90deg, #21B573 0%, #43E97B 100%)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px #21B57322",
                    transition: "background 0.2s",
                  }}
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};