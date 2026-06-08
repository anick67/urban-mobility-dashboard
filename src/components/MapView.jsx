import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';

const LABELS_INDICADOR = {
  acidentes: 'Acidentes',
  feridos_leves: 'Feridos leves',
  feridos_graves: 'Feridos graves',
  mortos: 'Vítimas mortais',
};

export default function MapView({ ano, indicador = 'acidentes', altura = '400px' }) {
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

  const formatarNumero = (valor) => {
    return Number(valor || 0)
      .toLocaleString('fr-FR')
      .replace(/\u202f/g, ' ');
  };

  const getDistrictRecord = (districtName) => {
    return districtData.find(
      (item) =>
        normalizeText(item.distrito) === normalizeText(districtName) &&
        String(item.ano).trim() === String(ano).trim()
    );
  };

  const getIndicatorValue = (districtName) => {
    const record = getDistrictRecord(districtName);
    return Number(record?.[indicador] || 0);
  };

  const getColor = (value) => {
    if (indicador === 'acidentes' || indicador === 'feridos_leves') {
      if (value > 2500) return '#ef4444';
      if (value > 1800) return '#f97316';
      if (value > 1200) return '#facc15';
      if (value > 700) return '#4ade80';
      if (value > 300) return '#60a5fa';
      return '#cbd5e1';
    }

    if (indicador === 'feridos_graves') {
      if (value > 300) return '#ef4444';
      if (value > 200) return '#f97316';
      if (value > 120) return '#facc15';
      if (value > 70) return '#4ade80';
      if (value > 30) return '#60a5fa';
      return '#cbd5e1';
    }

    if (indicador === 'mortos') {
      if (value > 30) return '#ef4444';
      if (value > 20) return '#f97316';
      if (value > 12) return '#facc15';
      if (value > 6) return '#4ade80';
      if (value > 2) return '#60a5fa';
      return '#cbd5e1';
    }

    return '#cbd5e1';
  };

  const getLegendItems = () => {
    if (indicador === 'acidentes' || indicador === 'feridos_leves') {
      return ['> 2500', '1801–2500', '1201–1800', '701–1200', '301–700', '≤ 300'];
    }

    if (indicador === 'feridos_graves') {
      return ['> 300', '201–300', '121–200', '71–120', '31–70', '≤ 30'];
    }

    if (indicador === 'mortos') {
      return ['> 30', '21–30', '13–20', '7–12', '3–6', '≤ 2'];
    }

    return [];
  };

  const legendColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-400',
    'bg-green-400',
    'bg-blue-400',
    'bg-slate-300',
  ];

  const getStyle = (feature) => {
    const districtName = feature?.properties?.distrito;
    const value = getIndicatorValue(districtName);

    return {
      color: '#0f172a',
      weight: 1.2,
      fillColor: getColor(value),
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

    layer
      .bindTooltip(
        `
          <div style="min-width: 160px;">
            <strong>${props?.distrito ?? '-'}</strong><br/>
            Ano: ${ano}<br/>
            ${LABELS_INDICADOR[indicador]}: ${formatarNumero(record?.[indicador])}
          </div>
        `,
        {
          sticky: true,
          direction: 'top',
          opacity: 0.95,
        }
      )
      .openTooltip();

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

    e.target
      .bindPopup(
        `
          <div style="min-width: 190px;">
            <strong>${props.distrito}</strong><br/>
            Ano: ${ano}<br/>
            Acidentes: ${formatarNumero(record?.acidentes)}<br/>
            Mortos: ${formatarNumero(record?.mortos)}<br/>
            Feridos graves: ${formatarNumero(record?.feridos_graves)}<br/>
            Feridos leves: ${formatarNumero(record?.feridos_leves)}
          </div>
        `
      )
      .openPopup();
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
      <div
        className="rounded-[28px] border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500"
        style={{ height: altura }}
      >
        A carregar mapa...
      </div>
    );
  }

  return (
    <div
      className="relative rounded-[28px] overflow-hidden border border-slate-200 bg-white"
      style={{ height: altura }}
    >
      <MapContainer
        center={[39.5, -8.2]}
        zoom={6}
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
          key={`${ano}-${indicador}`}
          ref={geoJsonRef}
          data={geoData}
          style={getStyle}
          onEachFeature={onEachFeature}
        />

        <div className="absolute bottom-4 right-4 z-[1000] rounded-xl bg-white/95 border border-slate-200 px-4 py-3 text-sm shadow-md">
          <div className="mb-2 font-semibold text-slate-700">
            {LABELS_INDICADOR[indicador]}
          </div>

          <div className="space-y-1 text-slate-600">
            {getLegendItems().map((label, index) => (
              <div key={label} className="flex items-center gap-2">
                <span className={`h-4 w-4 rounded-sm ${legendColors[index]}`} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </MapContainer>
    </div>
  );
}