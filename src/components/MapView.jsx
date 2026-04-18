import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';

export default function MapView({ ano }) {
  const [geoData, setGeoData] = useState(null);
  const [districtData, setDistrictData] = useState([]);
  const geoJsonRef = useRef(null);

  useEffect(() => {
    Promise.all([
      fetch('/data/distritos.geojson').then((res) => res.json()),
      fetch('/data/acidentes_distrito.json').then((res) => res.json()),
    ])
      .then(([geoJson, accidents]) => {
        setGeoData(geoJson);
        setDistrictData(accidents);
      })
      .catch((err) => console.error('Erro ao carregar dados do mapa:', err));
  }, []);

  const normalizeText = (text) => {
    return String(text || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  };

  const getDistrictRecord = (districtName) => {
    return districtData.find(
      (item) =>
        normalizeText(item.distrito) === normalizeText(districtName) &&
        String(item.ano).trim() === String(ano).trim()
    );
  };

  const getAccidentValue = (districtName) => {
    const record = getDistrictRecord(districtName);
    return Number(record?.acidentes || 0);
  };

  const getColor = (value) => {
    if (value > 2500) return '#ef4444';
    if (value > 1800) return '#f97316';
    if (value > 1200) return '#facc15';
    if (value > 700) return '#4ade80';
    if (value > 300) return '#60a5fa';
    return '#cbd5e1';
  };

  const getStyle = (feature) => {
    const districtName = feature?.properties?.distrito;
    const accidents = getAccidentValue(districtName);

    return {
      color: '#0f172a',
      weight: 1.2,
      fillColor: getColor(accidents),
      fillOpacity: 0.65,
    };
  };

  const highlightFeature = (e) => {
    const layer = e.target;
    const props = layer.feature?.properties;
    const record = getDistrictRecord(props?.distrito);

    layer.setStyle({
      weight: 2.5,
      color: '#111827',
      fillOpacity: 0.85,
    });

    layer.bindTooltip(
      `
        <div style="min-width: 140px;">
          <strong>${props?.distrito ?? '-'}</strong><br/>
          Ano: ${ano}<br/>
          Acidentes: ${record?.acidentes ?? '-'}
        </div>
      `,
      {
        sticky: true,
        direction: 'top',
        opacity: 0.95,
      }
    ).openTooltip();

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };

  const resetHighlight = (e) => {
    if (geoJsonRef.current) {
      geoJsonRef.current.resetStyle(e.target);
    }
    e.target.closeTooltip();
  };

  const onClickFeature = (e) => {
    const props = e.target.feature.properties;
    const record = getDistrictRecord(props.distrito);

    e.target.bindPopup(`
      <div style="min-width: 180px;">
        <strong>${props.distrito}</strong><br/>
        Ano: ${ano}<br/>
        Acidentes: ${record?.acidentes ?? '-'}<br/>
        Mortos: ${record?.mortos ?? '-'}<br/>
        Feridos graves: ${record?.feridos_graves ?? '-'}<br/>
        Feridos leves: ${record?.feridos_leves ?? '-'}
      </div>
    `).openPopup();
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: onClickFeature,
    });
  };

  if (!geoData || !districtData.length) {
    return (
      <div className="h-[400px] rounded-[28px] border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500">
        A carregar mapa...
      </div>
    );
  }

  return (
    <div className="relative h-[400px] rounded-[28px] overflow-hidden border border-slate-200 bg-white">
      <MapContainer
        center={[39.7, -8.0]}
        zoom={7}
        minZoom={6}
        maxZoom={10}
        maxBounds={[
          [36.5, -10.5],
          [42.5, -5.0],
        ]}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <GeoJSON
          key={ano}
          ref={geoJsonRef}
          data={geoData}
          style={getStyle}
          onEachFeature={onEachFeature}
        />

        <div className="absolute bottom-4 right-4 z-[1000] rounded-lg bg-white/90 border border-slate-200 px-3 py-2 text-[11px] shadow-sm">
          <div className="space-y-1 text-slate-600">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-red-500" />
              <span>Mais de 2500</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-orange-500" />
              <span>1801 a 2500</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-yellow-400" />
              <span>1201 a 1800</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-green-400" />
              <span>701 a 1200</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-blue-400" />
              <span>301 a 700</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-slate-300" />
              <span>Até 300</span>
            </div>
          </div>
        </div>
      </MapContainer>
    </div>
  );
}