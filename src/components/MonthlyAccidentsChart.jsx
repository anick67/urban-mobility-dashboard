import { useEffect, useMemo, useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const ORDEM_MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const LABELS_CURTOS = {
  Janeiro: 'Jan',
  Fevereiro: 'Fev',
  Março: 'Mar',
  Abril: 'Abr',
  Maio: 'Mai',
  Junho: 'Jun',
  Julho: 'Jul',
  Agosto: 'Ago',
  Setembro: 'Set',
  Outubro: 'Out',
  Novembro: 'Nov',
  Dezembro: 'Dez',
};

export default function MonthlyAccidentsChart({ ano }) {
  const [dadosMes, setDadosMes] = useState([]);

  useEffect(() => {
    fetch('/data/acidentes_mes.json')
      .then((res) => res.json())
      .then((data) => setDadosMes(data))
      .catch((err) => console.error('Erro ao carregar acidentes_mes.json:', err));
  }, []);

  const dadosFiltrados = useMemo(() => {
  const dadosAno = dadosMes.filter(
    (item) => String(item.ano).trim() === String(ano).trim()
  );

  return ORDEM_MESES.map((mes) => {
    const registo = dadosAno.find(
      (item) => String(item.mes).trim() === mes
    );

    return {
      mes,
      label: LABELS_CURTOS[mes],
      acidentes: Number(registo?.acidentes || 0),
    };
  });
}, [dadosMes, ano]);

  const formatarNumero = (valor) => {
    return new Intl.NumberFormat('pt-PT').format(valor);
  };

  if (!dadosMes.length) {
    return (
      <div className="h-[320px] flex items-center justify-center text-slate-500">
        A carregar gráfico...
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={dadosFiltrados}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="accidentsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatarNumero}
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip
            formatter={(value) => [formatarNumero(value), 'Acidentes']}
            labelFormatter={(label, payload) => {
              if (!payload || !payload.length) return label;
              return payload[0].payload.mes;
            }}
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
            }}
          />
          <Area
            type="monotone"
            dataKey="acidentes"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#accidentsGradient)"
            dot={{ r: 4, fill: '#10b981' }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}