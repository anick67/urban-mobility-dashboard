import { useEffect, useMemo, useState } from 'react';

export default function InsightsPanel({ ano }) {
  const [districts, setDistricts] = useState([]);
  const [hours, setHours] = useState([]);
  const [weekdays, setWeekdays] = useState([]);
  const [roadTypes, setRoadTypes] = useState([]);
  const [accidentTypes, setAccidentTypes] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/data/acidentes_distrito.json').then((r) => r.json()),
      fetch('/data/acidentes_hora.json').then((r) => r.json()),
      fetch('/data/acidentes_dia_semana.json').then((r) => r.json()),
      fetch('/data/acidentes_tipo_via.json').then((r) => r.json()),
      fetch('/data/acidentes_tipo_acidente.json').then((r) => r.json()),
    ])
      .then(([d, h, w, rv, at]) => {
        setDistricts(d);
        setHours(h);
        setWeekdays(w);
        setRoadTypes(rv);
        setAccidentTypes(at);
      })
      .catch((err) =>
        console.error('Erro ao carregar dados para insights:', err)
      );
  }, []);

  const formatarNumero = (valor) => {
    return Number(valor || 0)
        .toLocaleString('fr-FR')
        .replace(/\u202f/g, ' ');
    };

  const formatarHora = (hora) => {
    if (!hora) return '-';

    return String(hora)
      .replace('[', '')
      .replace('[', '')
      .replace(':00', '')
      .replace('-', 'h – ') + 'h';
  };

  const insights = useMemo(() => {
    const districtYear = districts.filter(
      (item) => String(item.ano) === String(ano)
    );

    const hourYear = hours.filter(
      (item) => String(item.ano) === String(ano)
    );

    const weekdayYear = weekdays.filter(
      (item) => String(item.ano) === String(ano)
    );

    const roadYear = roadTypes.filter(
      (item) => String(item.ano) === String(ano)
    );

    const accidentYear = accidentTypes.filter(
      (item) => String(item.ano) === String(ano)
    );

    const getMax = (data, field) => {
      return data.reduce(
        (max, item) =>
          Number(item[field] || 0) > Number(max[field] || 0) ? item : max,
        data[0] || {}
      );
    };

    return {
      districtMax: getMax(districtYear, 'acidentes'),
      districtDeaths: getMax(districtYear, 'mortos'),
      hourMax: getMax(hourYear, 'acidentes'),
      weekdayMax: getMax(weekdayYear, 'acidentes'),
      roadMax: getMax(roadYear, 'acidentes'),
      accidentMax: getMax(accidentYear, 'acidentes'),
    };
  }, [ano, districts, hours, weekdays, roadTypes, accidentTypes]);

  const horaFormatada = formatarHora(insights.hourMax?.hora);

  const nomeDia =
    insights.weekdayMax?.dia_semana === 'Sábado' ||
    insights.weekdayMax?.dia_semana === 'Domingo'
      ? insights.weekdayMax?.dia_semana
      : `${insights.weekdayMax?.dia_semana}-feira`;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-emerald-50 p-5">
          <div className="text-sm text-slate-500">
            Distrito com mais acidentes
          </div>
          <div className="mt-2 text-xl font-semibold">
            {insights.districtMax?.distrito}
          </div>
          <div className="text-slate-600">
            {formatarNumero(insights.districtMax?.acidentes)} acidentes
          </div>
        </div>

        <div className="rounded-xl bg-red-50 p-5">
          <div className="text-sm text-slate-500">
            Distrito com mais vítimas mortais
          </div>
          <div className="mt-2 text-xl font-semibold">
            {insights.districtDeaths?.distrito}
          </div>
          <div className="text-slate-600">
            {formatarNumero(insights.districtDeaths?.mortos)} mortos
          </div>
        </div>

        <div className="rounded-xl bg-blue-50 p-5">
          <div className="text-sm text-slate-500">
            Período horário mais crítico
          </div>
          <div className="mt-2 text-xl font-semibold">
            {horaFormatada}
          </div>
        </div>

        <div className="rounded-xl bg-violet-50 p-5">
          <div className="text-sm text-slate-500">
            Dia da semana mais crítico
          </div>
          <div className="mt-2 text-xl font-semibold">
            {nomeDia}
          </div>
        </div>

        <div className="rounded-xl bg-amber-50 p-5">
          <div className="text-sm text-slate-500">
            Tipo de via predominante
          </div>
          <div className="mt-2 text-xl font-semibold">
            {insights.roadMax?.via}
          </div>
        </div>

        <div className="rounded-xl bg-cyan-50 p-5">
          <div className="text-sm text-slate-500">
            Natureza mais frequente
          </div>
          <div className="mt-2 text-xl font-semibold">
            {insights.accidentMax?.tipo_acidente}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-slate-50 p-5 border border-slate-200">
        <h4 className="font-semibold text-lg">
          Principais conclusões para {ano}
        </h4>

        <ul className="mt-3 space-y-2 text-slate-600">
          <li>
            • {insights.districtMax?.distrito} registou o maior número de acidentes,
            com {formatarNumero(insights.districtMax?.acidentes)} ocorrências.
          </li>

          <li>
            • {insights.districtDeaths?.distrito} registou o maior número de vítimas mortais,
            com {formatarNumero(insights.districtDeaths?.mortos)} mortes.
          </li>

          <li>
            • O período {horaFormatada} concentrou a maior sinistralidade horária.
          </li>

          <li>
            • {nomeDia} foi o dia da semana com mais acidentes registados.
          </li>

          <li>
            • A natureza de acidente mais frequente foi a{' '}
            {insights.accidentMax?.tipo_acidente?.toLowerCase()}.
          </li>

          <li>
            • A tipologia de via com maior peso foi{' '}
            {insights.roadMax?.via?.toLowerCase()}.
          </li>
        </ul>
      </div>
    </>
  );
}