import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ORDEM_MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const LABELS_CURTOS = {
  Janeiro: "Jan",
  Fevereiro: "Fev",
  Março: "Mar",
  Abril: "Abr",
  Maio: "Mai",
  Junho: "Jun",
  Julho: "Jul",
  Agosto: "Ago",
  Setembro: "Set",
  Outubro: "Out",
  Novembro: "Nov",
  Dezembro: "Dez",
};

export default function MonthlyAccidentsChart({ ano }) {
  const [dadosMes, setDadosMes] = useState([]);

  useEffect(() => {
    fetch("/data/acidentes_mes.json")
      .then((res) => res.json())
      .then((data) => setDadosMes(data))
      .catch((err) =>
        console.error("Erro ao carregar acidentes_mes.json:", err),
      );
  }, []);

  // Mantém todos os meses no gráfico e usa null para meses sem dados, evitando interpretar dados em falta como zero
  const dadosFiltrados = useMemo(() => {
    const dadosAno = dadosMes.filter(
      (item) => String(item.ano).trim() === String(ano).trim(),
    );

    return ORDEM_MESES.map((mes) => {
      const registo = dadosAno.find((item) => String(item.mes).trim() === mes);

      return {
        mes,
        label: LABELS_CURTOS[mes],
        acidentes:
          registo?.acidentes === null || registo?.acidentes === ""
            ? null
            : Number(registo?.acidentes),
      };
    });
  }, [dadosMes, ano]);

  const formatarNumero = (valor) => {
    return Number(valor || 0)
      .toLocaleString("fr-FR")
      .replace(/\u202f/g, " ");
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
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatarNumero}
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip
            formatter={(value) => [formatarNumero(value), "Acidentes"]}
            labelFormatter={(label, payload) => {
              if (!payload || !payload.length) return label;
              return payload[0].payload.mes;
            }}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              color: "#0f172a",
              padding: "10px 12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            itemStyle={{
              color: "#0f172a",
            }}
          />

          <Area
            type="monotone"
            dataKey="acidentes"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#accidentsGradient)"
            dot={{ r: 4, fill: "#3b82f6" }}
            activeDot={{ r: 6 }}
            connectNulls={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
