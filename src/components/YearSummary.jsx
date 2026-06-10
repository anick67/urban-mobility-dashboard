import { useEffect, useMemo, useState } from "react";

const formatarNumero = (valor) => {
  return Number(valor || 0)
    .toLocaleString("fr-FR")
    .replace(/\u202f/g, " ");
};

const formatarVia = (via) =>
  String(via || "")
    .replaceAll("_", " ")
    .replace("Estrada nacional", "Estr. Nacional")
    .replace("Estrada municipal", "Estr. Municipal")
    .replace("Estrada regional", "Estr. Regional")
    .replace("Itinerário Complementar", "IC")
    .replace("Itinerário principal", "IP");

const formatarHora = (hora) =>
  String(hora || "")
    .replaceAll("[", "")
    .replaceAll("]", "")
    .replace("-", "–");

const formatarDia = (dia) => {
  if (dia === "Sábado" || dia === "Domingo") return dia;
  return `${dia}-feira`;
};

export default function YearSummary({ ano }) {
  const [dadosDistrito, setDadosDistrito] = useState([]);
  const [dadosHora, setDadosHora] = useState([]);
  const [dadosSemana, setDadosSemana] = useState([]);
  const [dadosVia, setDadosVia] = useState([]);
  const [dadosNatureza, setDadosNatureza] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/data/acidentes_distrito.json").then((res) => res.json()),
      fetch("/data/acidentes_hora.json").then((res) => res.json()),
      fetch("/data/acidentes_dia_semana.json").then((res) => res.json()),
      fetch("/data/acidentes_tipo_via.json").then((res) => res.json()),
      fetch("/data/acidentes_tipo_acidente.json").then((res) => res.json()),
    ])
      .then(([distrito, hora, semana, via, natureza]) => {
        setDadosDistrito(distrito);
        setDadosHora(hora);
        setDadosSemana(semana);
        setDadosVia(via);
        setDadosNatureza(natureza);
      })
      .catch((err) => console.error("Erro ao carregar resumo do ano:", err));
  }, []);

  // Reúne os principais indicadores do ano selecionado a partir das várias dimensões dos dados
  const resumo = useMemo(() => {
    const filtrarAno = (dados) =>
      dados.filter((item) => String(item.ano).trim() === String(ano).trim());

    const maxPorCampo = (dados, campo) =>
      [...dados].sort(
        (a, b) => Number(b[campo] || 0) - Number(a[campo] || 0),
      )[0];

    const distritosAno = filtrarAno(dadosDistrito);
    const horasAno = filtrarAno(dadosHora);
    const semanaAno = filtrarAno(dadosSemana);
    const viasAno = filtrarAno(dadosVia);
    const naturezaAno = filtrarAno(dadosNatureza);

    return {
      distritoMaisAcidentes: maxPorCampo(distritosAno, "acidentes"),
      distritoMaisMortos: maxPorCampo(distritosAno, "mortos"),
      horaMaisCritica: maxPorCampo(horasAno, "acidentes"),
      diaMaisCritico: maxPorCampo(semanaAno, "acidentes"),
      viaPredominante: maxPorCampo(viasAno, "acidentes"),
      naturezaMaisFrequente: maxPorCampo(naturezaAno, "acidentes"),
    };
  }, [ano, dadosDistrito, dadosHora, dadosSemana, dadosVia, dadosNatureza]);

  if (
    !dadosDistrito.length ||
    !dadosHora.length ||
    !dadosSemana.length ||
    !dadosVia.length ||
    !dadosNatureza.length
  ) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        A carregar resumo do ano...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-3xl font-semibold">Resumo do Ano</h3>

      <p className="mt-1 text-slate-500">
        Principais indicadores do ano selecionado
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-blue-50 p-4">
          <div className="text-sm text-slate-500">
            Distrito com mais acidentes
          </div>
          <div className="mt-1 text-xl font-semibold text-slate-800">
            {resumo.distritoMaisAcidentes?.distrito}
          </div>
          <div className="text-slate-600">
            {formatarNumero(resumo.distritoMaisAcidentes?.acidentes)} acidentes
          </div>
        </div>

        <div className="rounded-xl bg-rose-50 p-4">
          <div className="text-sm text-slate-500">
            Distrito com mais vítimas mortais
          </div>
          <div className="mt-1 text-xl font-semibold text-slate-800">
            {resumo.distritoMaisMortos?.distrito}
          </div>
          <div className="text-slate-600">
            {formatarNumero(resumo.distritoMaisMortos?.mortos)} vítimas mortais
          </div>
        </div>

        <div className="rounded-xl bg-cyan-50 p-4">
          <div className="text-sm text-slate-500">
            Dia da semana mais crítico
          </div>
          <div className="mt-1 text-xl font-semibold text-slate-800">
            {formatarDia(resumo.diaMaisCritico?.dia_semana)}
          </div>
          <div className="text-slate-600">
            {formatarNumero(resumo.diaMaisCritico?.acidentes)} acidentes
          </div>
        </div>

        <div className="rounded-xl bg-violet-50 p-4">
          <div className="text-sm text-slate-500">
            Período horário mais crítico
          </div>
          <div className="mt-1 text-xl font-semibold text-slate-800">
            {formatarHora(resumo.horaMaisCritica?.hora)}
          </div>
          <div className="text-slate-600">
            {formatarNumero(resumo.horaMaisCritica?.acidentes)} acidentes
          </div>
        </div>

        <div className="rounded-xl bg-orange-50 p-4">
          <div className="text-sm text-slate-500">Tipo de via predominante</div>
          <div className="mt-1 text-xl font-semibold text-slate-800">
            {formatarVia(resumo.viaPredominante?.via)}
          </div>
          <div className="text-slate-600">
            {formatarNumero(resumo.viaPredominante?.acidentes)} acidentes
          </div>
        </div>

        <div className="rounded-xl bg-indigo-50 p-4">
          <div className="text-sm text-slate-500">Natureza mais frequente</div>
          <div className="mt-1 text-xl font-semibold text-slate-800">
            {resumo.naturezaMaisFrequente?.tipo_acidente}
          </div>
          <div className="text-slate-600">
            {formatarNumero(resumo.naturezaMaisFrequente?.acidentes)} acidentes
          </div>
        </div>
      </div>
    </div>
  );
}
