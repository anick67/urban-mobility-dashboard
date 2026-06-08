import { useEffect, useMemo, useState } from 'react';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const CORES_VIA = {
  Autoestrada: '#60a5fa',
  Arruamento: '#f97316',
  Estrada_municipal: '#fbbf24',
  Estrada_nacional: '#f472b6',
  Estrada_regional: '#a78bfa',
  Itinerário_Complementar: '#fb7185',
  Itinerário_principal: '#38bdf8',
  'Outras vias': '#94a3b8',
};

const formatarVia = (via) => {
  return String(via || '')
    .replaceAll('_', ' ')
    .replace('Estrada municipal', 'Estr. Municipal')
    .replace('Estrada nacional', 'Estr. Nacional')
    .replace('Estrada regional', 'Estr. Regional')
    .replace('Itinerário Complementar', 'IC')
    .replace('Itinerário principal', 'IP');
};

export default function RoadTypeChart({
  ano,
  tipoVia = 'Todas',
  modo = 'compacto',
}) {
  const [dadosVia, setDadosVia] = useState([]);

  useEffect(() => {
    fetch('/data/acidentes_tipo_via.json')
      .then((res) => res.json())
      .then((data) => setDadosVia(data))
      .catch((err) =>
        console.error('Erro ao carregar acidentes_tipo_via.json:', err)
      );
  }, []);

  const dadosFiltrados = useMemo(() => {
    return dadosVia
      .filter((item) => String(item.ano).trim() === String(ano).trim())
      .filter((item) =>
        tipoVia === 'Todas'
          ? true
          : String(item.via).trim() === String(tipoVia).trim()
      )
      .map((item) => ({
        via: formatarVia(item.via),
        viaOriginal: item.via,
        acidentes: Number(item.acidentes || 0),
      }))
      .filter((item) => item.via && item.acidentes > 0)
      .sort((a, b) => b.acidentes - a.acidentes);
  }, [dadosVia, ano, tipoVia]);

  const total = dadosFiltrados.reduce((soma, item) => soma + item.acidentes, 0);

  const formatarNumero = (valor) => {
    return Number(valor || 0)
      .toLocaleString('fr-FR')
      .replace(/\u202f/g, ' ');
  };

  if (!dadosVia.length) {
    return (
      <div className="h-[260px] flex items-center justify-center text-slate-500">
        A carregar gráfico...
      </div>
    );
  }

  if (!dadosFiltrados.length) {
    return (
      <div className="h-[260px] flex items-center justify-center text-slate-500">
        Sem dados para o ano selecionado.
      </div>
    );
  }

  const isDetalhado = modo === 'detalhado';

  return (
    <div
      className={
        isDetalhado
          ? 'mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-center gap-8'
          : 'mt-6 flex flex-col items-center'
      }
    >
      <div
        className={`relative shrink-0 ${
          isDetalhado ? 'h-64 w-64' : 'h-48 w-48'
        }`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dadosFiltrados}
              dataKey="acidentes"
              nameKey="via"
              innerRadius={isDetalhado ? 72 : 58}
              outerRadius={isDetalhado ? 118 : 88}
              paddingAngle={2}
              isAnimationActive={false}
            >
              {dadosFiltrados.map((entry) => (
                <Cell
                  key={entry.viaOriginal}
                  fill={CORES_VIA[entry.viaOriginal]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name, props) => {
                const percentagem =
                  total > 0 ? (Number(value) / total) * 100 : 0;

                return [
                  `${formatarNumero(value)} acidentes (${percentagem.toFixed(
                    1
                  )}%)`,
                  props.payload.via,
                ];
              }}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                padding: '10px 12px',
                fontSize: '13px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
              itemStyle={{ color: '#0f172a' }}
              labelStyle={{ color: '#0f172a', fontWeight: 600 }}
              wrapperStyle={{ zIndex: 50 }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div
            className={`font-semibold ${
              isDetalhado ? 'text-3xl' : 'text-2xl'
            }`}
          >
            {formatarNumero(total)}
          </div>
          <div className="text-slate-500 text-sm">
            {tipoVia === 'Todas' ? 'Total' : 'Selecionado'}
          </div>
        </div>
      </div>

      <div
        className={
          isDetalhado
            ? 'w-full max-w-md space-y-3'
            : 'mt-5 w-full space-y-2'
        }
      >
        {dadosFiltrados.map((item) => {
          const percentagem = total > 0 ? (item.acidentes / total) * 100 : 0;

          return (
            <div
              key={item.viaOriginal}
              className={
                isDetalhado
                  ? 'flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3'
                  : 'flex items-center justify-between gap-3'
              }
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`rounded-full shrink-0 ${
                    isDetalhado ? 'h-4 w-4' : 'h-3 w-3'
                  }`}
                  style={{ backgroundColor: CORES_VIA[item.viaOriginal] }}
                />
                <span className="text-sm text-slate-600 truncate">
                  {item.via}
                </span>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold text-slate-800">
                  {percentagem.toFixed(1)}%
                </div>

                {isDetalhado && (
                  <div className="text-xs text-slate-500">
                    {formatarNumero(item.acidentes)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}