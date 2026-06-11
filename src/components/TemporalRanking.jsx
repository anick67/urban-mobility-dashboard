import { useEffect, useMemo, useState } from "react";

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

function RankingCard({ titulo, dados, campoNome, tipo }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-2xl font-semibold">{titulo}</h3>

      <div className="mt-5 space-y-3">
        {dados.map((item, index) => (
          <div
            key={`${campoNome}-${index}`}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                {index + 1}
              </div>

              <div>
                <div className="font-semibold text-slate-800">
                  {tipo === "hora"
                    ? formatarHora(item[campoNome])
                    : item[campoNome]}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-semibold text-slate-800">
                {formatarNumero(item.acidentes)}
              </div>
              <div className="text-xs text-slate-500">acidentes</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TemporalRanking({ ano }) {
  const [dadosMes, setDadosMes] = useState([]);
  const [dadosHora, setDadosHora] = useState([]);
  const [dadosSemana, setDadosSemana] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/data/acidentes_mes.json").then((res) => res.json()),
      fetch("/data/acidentes_hora.json").then((res) => res.json()),
      fetch("/data/acidentes_dia_semana.json").then((res) => res.json()),
    ])
      .then(([mes, hora, semana]) => {
        setDadosMes(mes);
        setDadosHora(hora);
        setDadosSemana(semana);
      })
      .catch((err) => console.error("Erro ao carregar ranking temporal:", err));
  }, []);

  const topMeses = useMemo(() => {
    return dadosMes
      .filter((item) => String(item.ano).trim() === String(ano).trim())
      .filter((item) => item.acidentes !== null && item.acidentes !== "")
      .map((item) => ({
        ...item,
        acidentes: Number(item.acidentes || 0),
      }))
      .sort((a, b) => b.acidentes - a.acidentes)
      .slice(0, 3);
  }, [dadosMes, ano]);

  const topHoras = useMemo(() => {
    return dadosHora
      .filter((item) => String(item.ano).trim() === String(ano).trim())
      .map((item) => ({
        ...item,
        acidentes: Number(item.acidentes || 0),
      }))
      .sort((a, b) => b.acidentes - a.acidentes)
      .slice(0, 3);
  }, [dadosHora, ano]);

  const topDias = useMemo(() => {
    return dadosSemana
      .filter((item) => String(item.ano).trim() === String(ano).trim())
      .map((item) => ({
        ...item,
        acidentes: Number(item.acidentes || 0),
      }))
      .sort((a, b) => b.acidentes - a.acidentes)
      .slice(0, 3);
  }, [dadosSemana, ano]);

  if (!dadosMes.length || !dadosHora.length || !dadosSemana.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-slate-500">
        A carregar resumo temporal...
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <RankingCard
        titulo="Top 3 Meses com Mais Acidentes"
        dados={topMeses}
        campoNome="mes"
        tipo="mes"
      />

      <RankingCard
        titulo="Top 3 Períodos Horários com Mais Acidentes"
        dados={topHoras}
        campoNome="hora"
        tipo="hora"
      />

      <RankingCard
        titulo="Top 3 Dias da Semana com Mais Acidentes"
        dados={topDias}
        campoNome="dia_semana"
        tipo="dia"
      />
    </section>
  );
}
