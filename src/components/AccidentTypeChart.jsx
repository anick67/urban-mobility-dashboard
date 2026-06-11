import { useEffect, useMemo, useState } from "react";

export default function AccidentTypeChart({ ano }) {
  const [dadosTipo, setDadosTipo] = useState([]);

  useEffect(() => {
    fetch("/data/acidentes_tipo_acidente.json")
      .then((res) => res.json())
      .then((data) => setDadosTipo(data))
      .catch((err) =>
        console.error("Erro ao carregar acidentes_tipo_acidente.json:", err),
      );
  }, []);

  // Filtra e normaliza os dados do ano selecionado para apresentação no gráfico
  const dadosFiltrados = useMemo(() => {
    return dadosTipo
      .filter((item) => String(item.ano).trim() === String(ano).trim())
      .map((item) => ({
        tipo: item.tipo_acidente,
        acidentes: Number(item.acidentes || 0),
        mortos: Number(item.mortos || 0),
        feridos_graves: Number(item.feridos_graves || 0),
        feridos_leves: Number(item.feridos_leves || 0),
      }))
      .filter((item) => item.tipo && item.acidentes > 0)
      .sort((a, b) => b.acidentes - a.acidentes);
  }, [dadosTipo, ano]);

  const total = dadosFiltrados.reduce((soma, item) => soma + item.acidentes, 0);
  const maximo = Math.max(...dadosFiltrados.map((item) => item.acidentes), 1);

  const formatarNumero = (valor) => {
    return Number(valor || 0)
      .toLocaleString("fr-FR")
      .replace(/\u202f/g, " ");
  };

  if (!dadosTipo.length) {
    return (
      <div className="h-[240px] flex items-center justify-center text-slate-500">
        A carregar gráfico...
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-10">
      {dadosFiltrados.map((item) => {
        const percentagem = total > 0 ? (item.acidentes / total) * 100 : 0;
        const largura = maximo > 0 ? (item.acidentes / maximo) * 100 : 0;

        return (
          <div key={item.tipo}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-slate-700">
                  {item.tipo}
                </div>
                <div className="text-xs text-slate-500">
                  {formatarNumero(item.acidentes)} acidentes
                </div>
              </div>

              <div className="text-sm font-semibold text-slate-700">
                {percentagem.toFixed(1)}%
              </div>
            </div>

            <div className="h-4 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500"
                style={{ width: `${largura}%` }}
                title={`${item.tipo}: ${formatarNumero(item.acidentes)} acidentes`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
