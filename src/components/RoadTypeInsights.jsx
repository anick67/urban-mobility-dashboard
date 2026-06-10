import { useEffect, useMemo, useState } from "react";

const formatarNumero = (valor) => {
  return Number(valor || 0)
    .toLocaleString("fr-FR")
    .replace(/\u202f/g, " ");
};

const formatarVia = (via) => {
  return String(via || "")
    .replaceAll("_", " ")
    .replace("Estrada municipal", "Estr. Municipal")
    .replace("Estrada nacional", "Estr. Nacional")
    .replace("Estrada regional", "Estr. Regional")
    .replace("Itinerário Complementar", "IC")
    .replace("Itinerário principal", "IP");
};

export default function RoadTypeInsights({ ano }) {
  const [dadosVia, setDadosVia] = useState([]);

  useEffect(() => {
    fetch("/data/acidentes_tipo_via.json")
      .then((res) => res.json())
      .then((data) => setDadosVia(data))
      .catch((err) =>
        console.error("Erro ao carregar acidentes_tipo_via.json:", err),
      );
  }, []);

  const dadosAno = useMemo(() => {
    return dadosVia
      .filter((item) => String(item.ano).trim() === String(ano).trim())
      .map((item) => ({
        ...item,
        acidentes: Number(item.acidentes || 0),
        mortos: Number(item.mortos || 0),
      }));
  }, [dadosVia, ano]);

  const resumo = useMemo(() => {
    const ordenarPorAcidentes = [...dadosAno].sort(
      (a, b) => b.acidentes - a.acidentes,
    );

    const ordenarPorMortos = [...dadosAno].sort((a, b) => b.mortos - a.mortos);

    return {
      topAcidentes: ordenarPorAcidentes[0],
      topMortos: ordenarPorMortos[0],
      top3: ordenarPorAcidentes.slice(0, 3),
    };
  }, [dadosAno]);

  if (!dadosVia.length) {
    return <div className="text-slate-500">A carregar resumo...</div>;
  }

  if (!dadosAno.length) {
    return (
      <div className="text-slate-500">Sem dados para o ano selecionado.</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-emerald-50 p-5">
        <div className="text-sm text-slate-500">
          Tipo de via com mais acidentes
        </div>
        <div className="mt-2 text-2xl font-semibold text-slate-800">
          {formatarVia(resumo.topAcidentes?.via)}
        </div>
        <div className="text-slate-600">
          {formatarNumero(resumo.topAcidentes?.acidentes)} acidentes
        </div>
      </div>

      <div className="rounded-xl bg-rose-50 p-5">
        <div className="text-sm text-slate-500">
          Tipo de via com mais vítimas mortais
        </div>
        <div className="mt-2 text-2xl font-semibold text-slate-800">
          {formatarVia(resumo.topMortos?.via)}
        </div>
        <div className="text-slate-600">
          {formatarNumero(resumo.topMortos?.mortos)} vítimas mortais
        </div>
      </div>

      <div className="rounded-xl bg-slate-50 p-5">
        <div className="text-sm text-slate-500 mb-4">
          Top 3 tipos de via por acidentes
        </div>

        <div className="space-y-3">
          {resumo.top3.map((item, index) => (
            <div
              key={item.via}
              className="flex items-center justify-between rounded-xl bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {index + 1}
                </div>

                <div>
                  <div className="font-semibold text-slate-800">
                    {formatarVia(item.via)}
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
    </div>
  );
}
