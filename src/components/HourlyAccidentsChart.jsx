import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ORDEM_HORAS = [
  "[00:00-03:00[",
  "[03:00-06:00[",
  "[06:00-09:00[",
  "[09:00-12:00[",
  "[12:00-15:00[",
  "[15:00-18:00[",
  "[18:00-21:00[",
  "[21:00-00:00[",
];

const LABELS_HORAS = {
  "[00:00-03:00[": "00-03",
  "[03:00-06:00[": "03-06",
  "[06:00-09:00[": "06-09",
  "[09:00-12:00[": "09-12",
  "[12:00-15:00[": "12-15",
  "[15:00-18:00[": "15-18",
  "[18:00-21:00[": "18-21",
  "[21:00-00:00[": "21-00",
};

export default function HourlyAccidentsChart({ ano }) {
  const [dadosHora, setDadosHora] = useState([]);

  useEffect(() => {
    fetch("/data/acidentes_hora.json")
      .then((res) => res.json())
      .then((data) => setDadosHora(data))
      .catch((err) =>
        console.error("Erro ao carregar acidentes_hora.json:", err),
      );
  }, []);

  // Mantém a ordem cronológica dos intervalos horários, preenchendo valores em falta com zero
  const dadosFiltrados = useMemo(() => {
    const dadosAno = dadosHora.filter(
      (item) => String(item.ano).trim() === String(ano).trim(),
    );

    return ORDEM_HORAS.map((hora) => {
      const registo = dadosAno.find(
        (item) => String(item.hora).trim() === hora,
      );

      return {
        hora,
        label: LABELS_HORAS[hora],
        acidentes: Number(registo?.acidentes || 0),
        mortos: Number(registo?.mortos || 0),
        feridos_graves: Number(registo?.feridos_graves || 0),
        feridos_leves: Number(registo?.feridos_leves || 0),
      };
    });
  }, [dadosHora, ano]);

  const formatarNumero = (valor) => {
    return Number(valor || 0)
      .toLocaleString("fr-FR")
      .replace(/\u202f/g, " ");
  };

  const formatarHora = (hora) => {
    return String(hora || "")
      .replaceAll("[", "")
      .replaceAll("]", "")
      .replace("-", "–");
  };

  if (!dadosHora.length) {
    return (
      <div className="h-[240px] flex items-center justify-center text-slate-500">
        A carregar gráfico...
      </div>
    );
  }

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dadosFiltrados}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#3d2f68", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatarNumero}
            tick={{ fill: "#3d2f68", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip
            cursor={false}
            formatter={(value) => [formatarNumero(value), "Acidentes"]}
            labelFormatter={(label, payload) => {
              if (!payload || !payload.length) return label;
              return formatarHora(payload[0].payload.hora);
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
          <Bar dataKey="acidentes" radius={[10, 10, 0, 0]} fill="#979a9a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
