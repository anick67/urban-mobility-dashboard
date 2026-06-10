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

const ORDEM_DIAS = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

const LABELS_DIAS = {
  Segunda: "Seg",
  Terça: "Ter",
  Quarta: "Qua",
  Quinta: "Qui",
  Sexta: "Sex",
  Sábado: "Sáb",
  Domingo: "Dom",
};

export default function WeekdayAccidentsChart({ ano }) {
  const [dadosDia, setDadosDia] = useState([]);

  useEffect(() => {
    fetch("/data/acidentes_dia_semana.json")
      .then((res) => res.json())
      .then((data) => setDadosDia(data))
      .catch((err) =>
        console.error("Erro ao carregar acidentes_dia_semana.json:", err),
      );
  }, []);

  // Mantém a ordem cronológica dos dias da semana, preenchendo valores em falta com zero
  const dadosFiltrados = useMemo(() => {
    const dadosAno = dadosDia.filter(
      (item) => String(item.ano).trim() === String(ano).trim(),
    );

    return ORDEM_DIAS.map((dia) => {
      const registo = dadosAno.find(
        (item) => String(item.dia_semana).trim() === dia,
      );

      return {
        dia,
        label: LABELS_DIAS[dia],
        acidentes: Number(registo?.acidentes || 0),
        mortos: Number(registo?.mortos || 0),
        feridos_graves: Number(registo?.feridos_graves || 0),
        feridos_leves: Number(registo?.feridos_leves || 0),
      };
    });
  }, [dadosDia, ano]);

  const formatarNumero = (valor) => {
    return Number(valor || 0)
      .toLocaleString("fr-FR")
      .replace(/\u202f/g, " ");
  };

  if (!dadosDia.length) {
    return (
      <div className="h-[300px] flex items-center justify-center text-slate-500">
        A carregar gráfico...
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dadosFiltrados}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
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
            cursor={false}
            formatter={(value) => [formatarNumero(value), "Acidentes"]}
            labelFormatter={(label, payload) => {
              if (!payload || !payload.length) return label;
              return payload[0].payload.dia;
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
          <Bar dataKey="acidentes" radius={[10, 10, 0, 0]} fill="#59a8b5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
