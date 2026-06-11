import { useEffect, useMemo, useState } from "react";

const formatarNumero = (valor) => {
  return Number(valor || 0)
    .toLocaleString("fr-FR")
    .replace(/\u202f/g, " ");
};

function RankingCard({ title, data, field, suffix }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-2xl font-semibold">{title}</h3>

      <div className="mt-5 space-y-3">
        {data.map((item, index) => (
          <div
            key={`${item.distrito}-${index}`}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {index + 1}
              </div>

              <div>
                <div className="font-semibold text-slate-800">
                  {item.distrito}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-semibold text-slate-800">
                {formatarNumero(item[field])}
              </div>
              <div className="text-xs text-slate-500">{suffix}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DistrictRanking({ ano }) {
  const [dadosDistrito, setDadosDistrito] = useState([]);

  useEffect(() => {
    fetch("/data/acidentes_distrito.json")
      .then((res) => res.json())
      .then((data) => setDadosDistrito(data))
      .catch((err) =>
        console.error("Erro ao carregar acidentes_distrito.json:", err),
      );
  }, []);

  const dadosAno = useMemo(() => {
    return dadosDistrito.filter(
      (item) => String(item.ano).trim() === String(ano).trim(),
    );
  }, [dadosDistrito, ano]);

  const topAcidentes = useMemo(() => {
    return [...dadosAno]
      .sort((a, b) => Number(b.acidentes || 0) - Number(a.acidentes || 0))
      .slice(0, 3);
  }, [dadosAno]);

  const topFeridosLeves = useMemo(() => {
    return [...dadosAno]
      .sort(
        (a, b) => Number(b.feridos_leves || 0) - Number(a.feridos_leves || 0),
      )
      .slice(0, 3);
  }, [dadosAno]);

  const topFeridosGraves = useMemo(() => {
    return [...dadosAno]
      .sort(
        (a, b) => Number(b.feridos_graves || 0) - Number(a.feridos_graves || 0),
      )
      .slice(0, 3);
  }, [dadosAno]);

  const topMortos = useMemo(() => {
    return [...dadosAno]
      .sort((a, b) => Number(b.mortos || 0) - Number(a.mortos || 0))
      .slice(0, 3);
  }, [dadosAno]);

  if (!dadosDistrito.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-500 shadow-sm">
        A carregar rankings...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <RankingCard
        title="Top 3 Distritos com Mais Acidentes"
        data={topAcidentes}
        field="acidentes"
        suffix="acidentes"
      />

      <RankingCard
        title="Top 3 Distritos com Mais Feridos Leves"
        data={topFeridosLeves}
        field="feridos_leves"
        suffix="feridos leves"
      />

      <RankingCard
        title="Top 3 Distritos com Mais Feridos Graves"
        data={topFeridosGraves}
        field="feridos_graves"
        suffix="feridos graves"
      />

      <RankingCard
        title="Top 3 Distritos com Mais Vítimas Mortais"
        data={topMortos}
        field="mortos"
        suffix="vítimas mortais"
      />
    </div>
  );
}
