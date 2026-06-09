import { useEffect, useState } from 'react';
import AccidentTypeChart from './components/AccidentTypeChart';
import DistrictRanking from './components/DistrictRanking';
import HourlyAccidentsChart from './components/HourlyAccidentsChart';
import MapView from './components/MapView';
import MonthlyAccidentsChart from './components/MonthlyAccidentsChart';
import RoadTypeChart from './components/RoadTypeChart';
import RoadTypeInsights from './components/RoadTypeInsights';
import WeekdayAccidentsChart from './components/WeekdayAccidentsChart';
import YearSummary from './components/YearSummary';

export default function MobilidadeDashboard() {
  const [anoSelecionado, setAnoSelecionado] = useState('2025');
  const [dadosDistrito, setDadosDistrito] = useState([]);
  const [dadosMes, setDadosMes] = useState([]);
  const [dadosHora, setDadosHora] = useState([]);
  const [dadosSemana, setDadosSemana] = useState([]);
  const [dadosVia, setDadosVia] = useState([]);
  const [dadosNatureza, setDadosNatureza] = useState([]);
  const [gravidadeSelecionada, setGravidadeSelecionada] = useState('acidentes');
  const [paginaAtiva, setPaginaAtiva] = useState('Dashboard');

  useEffect(() => {
  Promise.all([
    fetch('/data/acidentes_distrito.json').then((res) => res.json()),
    fetch('/data/acidentes_mes.json').then((res) => res.json()),
    fetch('/data/acidentes_hora.json').then((res) => res.json()),
    fetch('/data/acidentes_dia_semana.json').then((res) => res.json()),
    fetch('/data/acidentes_tipo_via.json').then((res) => res.json()),
    fetch('/data/acidentes_tipo_acidente.json').then((res) => res.json()),
  ])
    .then(([distrito, mes, hora, semana, via, natureza]) => {
      setDadosDistrito(distrito);
      setDadosMes(mes);
      setDadosHora(hora);
      setDadosSemana(semana);
      setDadosVia(via);
      setDadosNatureza(natureza);
    })
    .catch((err) => console.error('Erro ao carregar dados:', err));
}, []);

  const dadosAno = dadosDistrito.filter(
    (item) => String(item.ano).trim() === String(anoSelecionado).trim()
  );

  const somarCampo = (campo) => {
    return dadosAno.reduce((total, item) => {
      return total + Number(item[campo] || 0);
    }, 0);
  };

  const formatarNumero = (valor) => {
    return Number(valor || 0)
      .toLocaleString('fr-FR')
      .replace(/\u202f/g, ' ');
  };

  const statCards = [
    {
      title: 'Total de Acidentes',
      value: formatarNumero(somarCampo('acidentes')),
      change: `Ano ${anoSelecionado}`,
      color: 'text-slate-500',
      bg: 'bg-blue-50',
    },
    {
      title: 'Feridos Graves',
      value: formatarNumero(somarCampo('feridos_graves')),
      change: `Ano ${anoSelecionado}`,
      color: 'text-slate-500',
      bg: 'bg-orange-50',
    },
    {
      title: 'Feridos Ligeiros',
      value: formatarNumero(somarCampo('feridos_leves')),
      change: `Ano ${anoSelecionado}`,
      color: 'text-slate-500',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Vítimas Mortais',
      value: formatarNumero(somarCampo('mortos')),
      change: `Ano ${anoSelecionado}`,
      color: 'text-slate-500',
      bg: 'bg-violet-50',
    },
  ];

  const handleExportCSV = () => {
  const filtrarAno = (dados) =>
    dados.filter((item) => String(item.ano).trim() === String(anoSelecionado).trim());

  const maxPorCampo = (dados, campo) =>
    [...dados].sort((a, b) => Number(b[campo] || 0) - Number(a[campo] || 0))[0];

  const formatarVia = (via) =>
    String(via || '')
      .replaceAll('_', ' ')
      .replace('Estrada nacional', 'Estr. Nacional')
      .replace('Estrada municipal', 'Estr. Municipal')
      .replace('Estrada regional', 'Estr. Regional')
      .replace('Itinerário Complementar', 'IC')
      .replace('Itinerário principal', 'IP');

  const formatarHora = (hora) =>
    String(hora || '')
      .replaceAll('[', '')
      .replaceAll(']', '')
      .replace('-', '–');

  const formatarDia = (dia) => {
    if (dia === 'Sábado' || dia === 'Domingo') return dia;
    return `${dia}-feira`;
  };

  const valorCSV = (valor) => `"${String(valor ?? '').replaceAll('"', '""')}"`;

  const adicionarLinha = (valores) => {
    linhas.push(valores.map(valorCSV).join(','));
  };

  const dadosMesAno = filtrarAno(dadosMes);
  const dadosHoraAno = filtrarAno(dadosHora);
  const dadosSemanaAno = filtrarAno(dadosSemana);
  const dadosViaAno = filtrarAno(dadosVia);
  const dadosNaturezaAno = filtrarAno(dadosNatureza);

  const resumoAno = {
    distritoMaisAcidentes: maxPorCampo(dadosAno, 'acidentes'),
    distritoMaisMortos: maxPorCampo(dadosAno, 'mortos'),
    horaMaisCritica: maxPorCampo(dadosHoraAno, 'acidentes'),
    diaMaisCritico: maxPorCampo(dadosSemanaAno, 'acidentes'),
    viaPredominante: maxPorCampo(dadosViaAno, 'acidentes'),
    naturezaMaisFrequente: maxPorCampo(dadosNaturezaAno, 'acidentes'),
  };

  const linhas = [];

  linhas.push(`Urban Mobility Insights - Dashboard ${anoSelecionado}`);
  linhas.push('');

  linhas.push('Resumo Geral');
  adicionarLinha(['Indicador', 'Valor']);
  statCards.forEach((card) => {
    adicionarLinha([card.title, card.value]);
  });

  linhas.push('');
  linhas.push('Resumo do Ano');
  adicionarLinha(['Indicador', 'Valor', 'Total']);
  adicionarLinha([
    'Distrito com mais acidentes',
    resumoAno.distritoMaisAcidentes?.distrito,
    resumoAno.distritoMaisAcidentes?.acidentes,
  ]);
  adicionarLinha([
    'Distrito com mais vítimas mortais',
    resumoAno.distritoMaisMortos?.distrito,
    resumoAno.distritoMaisMortos?.mortos,
  ]);
  adicionarLinha([
    'Dia da semana mais crítico',
    formatarDia(resumoAno.diaMaisCritico?.dia_semana),
    resumoAno.diaMaisCritico?.acidentes,
  ]);
  adicionarLinha([
    'Período horário mais crítico',
    formatarHora(resumoAno.horaMaisCritica?.hora),
    resumoAno.horaMaisCritica?.acidentes,
  ]);
  adicionarLinha([
    'Tipo de via predominante',
    formatarVia(resumoAno.viaPredominante?.via),
    resumoAno.viaPredominante?.acidentes,
  ]);
  adicionarLinha([
    'Natureza mais frequente',
    resumoAno.naturezaMaisFrequente?.tipo_acidente,
    resumoAno.naturezaMaisFrequente?.acidentes,
  ]);

  linhas.push('');
  linhas.push('Acidentes por Mês');
  adicionarLinha(['Mês', 'Acidentes', 'Vítimas Mortais', 'Feridos Graves', 'Feridos Leves']);
  dadosMesAno.forEach((item) => {
    adicionarLinha([
      item.mes,
      item.acidentes,
      item.mortos,
      item.feridos_graves,
      item.feridos_leves,
    ]);
  });

  linhas.push('');
  linhas.push('Acidentes por Hora do Dia');
  adicionarLinha(['Período Horário', 'Acidentes', 'Vítimas Mortais', 'Feridos Graves', 'Feridos Leves']);
  dadosHoraAno.forEach((item) => {
    adicionarLinha([
      formatarHora(item.hora),
      item.acidentes,
      item.mortos,
      item.feridos_graves,
      item.feridos_leves,
    ]);
  });

  linhas.push('');
  linhas.push('Acidentes por Dia da Semana');
  adicionarLinha(['Dia', 'Acidentes', 'Vítimas Mortais', 'Feridos Graves', 'Feridos Leves']);
  dadosSemanaAno.forEach((item) => {
    adicionarLinha([
      formatarDia(item.dia_semana),
      item.acidentes,
      item.mortos,
      item.feridos_graves,
      item.feridos_leves,
    ]);
  });

  linhas.push('');
  linhas.push('Acidentes por Tipo de Via');
  adicionarLinha(['Tipo de Via', 'Acidentes']);
  dadosViaAno.forEach((item) => {
    adicionarLinha([formatarVia(item.via), item.acidentes]);
  });

  linhas.push('');
  linhas.push('Natureza do Acidente');
  adicionarLinha(['Natureza', 'Acidentes', 'Vítimas Mortais', 'Feridos Graves', 'Feridos Leves']);
  dadosNaturezaAno.forEach((item) => {
    adicionarLinha([
      item.tipo_acidente,
      item.acidentes,
      item.mortos,
      item.feridos_graves,
      item.feridos_leves,
    ]);
  });

  linhas.push('');
  linhas.push('Distribuição Geográfica');
  adicionarLinha(['Distrito', 'Acidentes', 'Feridos Graves', 'Feridos Leves', 'Vítimas Mortais']);
  dadosAno.forEach((item) => {
    adicionarLinha([
      item.distrito,
      item.acidentes,
      item.feridos_graves,
      item.feridos_leves,
      item.mortos,
    ]);
  });

  const csv = linhas.join('\n');

  const blob = new Blob([`\uFEFF${csv}`], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `urban_mobility_dashboard_${anoSelecionado}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-[320px] shrink-0 bg-slate-950 text-white flex flex-col">
          <div className="px-6 py-7 border-b border-white/10">
            <div className="flex items-center gap-4">
              <img
                src="/logo.png"
                alt="Logo Urban Mobility Insights"
                className="h-16 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold leading-tight">
                  <span className="text-emerald-400">MOBILIDADE</span> URBANA
                </h1>
                <p className="text-slate-300 text-sm">
                  Visualizing data for safer mobility
                </p>
              </div>
            </div>
          </div>

          <nav className="px-3 py-5 space-y-2">
            {[
              'Dashboard',
              'Análise Temporal',
              'Mapa de Acidentes',
              'Tipos de Via',
              'Sobre',
            ].map((item) => (
              <button
                key={item}
                onClick={() => setPaginaAtiva(item)}
                className={`w-full rounded-xl px-4 py-3 text-left transition ${
                  paginaAtiva === item
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="mx-4 my-3 h-px bg-white/10" />

          <div className="px-6 py-4 flex-1">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-lg font-medium">Ano de Análise</h2>
            </div>

            <div className="space-y-5">
              <select
                value={anoSelecionado}
                onChange={(e) => setAnoSelecionado(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-2.5 outline-none"
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
          </div>

          <div className="px-6 py-5 border-t border-white/10 text-slate-400 text-sm">
            Projeto de Engenharia Informática
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">
          <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Top */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <h2 className="text-5xl font-semibold tracking-tight">
                  {paginaAtiva}
                </h2>

                <div className="flex items-center gap-6 mt-2">
                  <p className="text-slate-500 text-xl">
                    {paginaAtiva === 'Dashboard' &&
                      'Visão geral da sinistralidade rodoviária'}
                    {paginaAtiva === 'Análise Temporal' &&
                      'Análise dos acidentes ao longo do tempo'}
                    {paginaAtiva === 'Mapa de Acidentes' &&
                      'Distribuição geográfica da sinistralidade'}
                    {paginaAtiva === 'Tipos de Via' &&
                      'Análise da sinistralidade por categoria de via'}
                    {paginaAtiva === 'Sobre' &&
                      'Enquadramento, dados e tecnologias utilizadas no projeto'}
                  </p>

                  {paginaAtiva === 'Dashboard' && (
                    <button
                      onClick={handleExportCSV}
                      className="text-sm font-medium text-slate-700 hover:text-slate-950 transition"
                    >
                      [↧ Exportar CSV]
                    </button>
                  )}
                </div>
              </div>

              {paginaAtiva !== 'Sobre' && (
  <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm min-w-[220px]">
    <div className="text-sm text-slate-500">Ano selecionado</div>

    <div className="text-3xl font-bold text-slate-800">
      {anoSelecionado}
    </div>

    {anoSelecionado === '2025' && (
      <div className="mt-1 text-sm text-slate-500">
        Dados disponíveis até setembro
      </div>
    )}
  </div>
)}
            </div>

            {paginaAtiva === 'Dashboard' && (
              <>
                {/* Stat cards */}
                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {statCards.map((card) => (
                    <div
                      key={card.title}
                      className={`rounded-2xl border border-slate-200 p-5 shadow-sm ${card.bg}`}
                    >
                      <div className="text-slate-600 text-sm">
                        {card.title}
                      </div>
                      <div className="mt-2 text-4xl font-semibold tracking-tight">
                        {card.value}
                      </div>
                      <div className={`mt-2 text-sm ${card.color}`}>
                        {card.change}
                      </div>
                    </div>
                  ))}
                </section>

                <section className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                  <div className="xl:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-3xl font-semibold">
                      Acidentes por Mês
                    </h3>
                    <div className="mt-1 text-slate-500">
                      Distribuição temporal ao longo do ano selecionado
                    </div>
                    <div className="mt-6">
                      <MonthlyAccidentsChart ano={anoSelecionado} />
                    </div>
                  </div>

                  <div className="xl:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-3xl font-semibold">
                      Distribuição Geográfica
                    </h3>
                    <div className="mt-4">
                      <MapView
                        ano={anoSelecionado}
                        indicador={gravidadeSelecionada}
                      />
                    </div>
                  </div>

                  <div className="xl:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-3xl font-semibold">
                      Acidentes por Hora do Dia
                    </h3>
                    <div className="mt-6">
                      <HourlyAccidentsChart ano={anoSelecionado} />
                    </div>
                  </div>

                  <div className="xl:col-span-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-3xl font-semibold">
                      Acidentes por Tipo de Via
                    </h3>
                    <RoadTypeChart ano={anoSelecionado} />
                  </div>

                  <div className="xl:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-3xl font-semibold">
                      Natureza do Acidente
                    </h3>
                    <p className="mt-1 text-slate-500">
                      Distribuição por atropelamento, colisão e despiste
                    </p>
                    <AccidentTypeChart ano={anoSelecionado} />
                  </div>
                </section>

                <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-3xl font-semibold">
                      Acidentes por Dia da Semana
                    </h3>

                    <p className="mt-1 text-slate-500">
                      Distribuição dos acidentes ao longo da semana
                    </p>

                    <div className="mt-6">
                      <WeekdayAccidentsChart ano={anoSelecionado} />
                    </div>
                  </div>

                  <YearSummary ano={anoSelecionado} />
                </section>
              </>
            )}

            {paginaAtiva === 'Análise Temporal' && (
              <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-3xl font-semibold">
                    Acidentes por Mês
                  </h3>
                  <div className="mt-6">
                    <MonthlyAccidentsChart ano={anoSelecionado} />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-3xl font-semibold">
                    Acidentes por Hora do Dia
                  </h3>
                  <div className="mt-6">
                    <HourlyAccidentsChart ano={anoSelecionado} />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-3xl font-semibold">
                    Acidentes por Dia da Semana
                  </h3>
                  <div className="mt-6">
                    <WeekdayAccidentsChart ano={anoSelecionado} />
                  </div>
                </div>
              </section>
            )}

            {paginaAtiva === 'Mapa de Acidentes' && (
              <section className="space-y-4">
                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {statCards.map((card) => (
                    <div
                      key={card.title}
                      className={`rounded-2xl border border-slate-200 p-5 shadow-sm ${card.bg}`}
                    >
                      <div className="text-slate-600 text-sm">
                        {card.title}
                      </div>
                      <div className="mt-2 text-4xl font-semibold tracking-tight">
                        {card.value}
                      </div>
                      <div className={`mt-2 text-sm ${card.color}`}>
                        {card.change}
                      </div>
                    </div>
                  ))}
                </section>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-3xl font-semibold">
                        Mapa de Sinistralidade por Distrito
                      </h3>

                      <p className="mt-1 text-slate-500">
                        Distribuição geográfica da sinistralidade no ano
                        selecionado
                      </p>
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1 text-xs uppercase tracking-wide text-slate-500">
                        Visualizar por
                      </label>

                      <select
                        value={gravidadeSelecionada}
                        onChange={(e) =>
                          setGravidadeSelecionada(e.target.value)
                        }
                        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm"
                      >
                        <option value="acidentes">Acidentes</option>
                        <option value="feridos_leves">Feridos leves</option>
                        <option value="feridos_graves">Feridos graves</option>
                        <option value="mortos">Vítimas mortais</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-5">
                    <MapView
                      ano={anoSelecionado}
                      indicador={gravidadeSelecionada}
                      altura="400px"
                    />
                  </div>
                </div>

                <DistrictRanking ano={anoSelecionado} />
              </section>
            )}

            {paginaAtiva === 'Tipos de Via' && (
              <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-3xl font-semibold">
                    Distribuição por Tipo de Via
                  </h3>

                  <p className="mt-2 text-slate-500">
                    Distribuição dos acidentes por categoria de via.
                  </p>

                  <div className="mt-6">
                    <RoadTypeChart ano={anoSelecionado} modo="detalhado" />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-3xl font-semibold">
                    Resumo por Tipo de Via
                  </h3>

                  <p className="mt-2 text-slate-500">
                    Principais indicadores da sinistralidade por via.
                  </p>

                  <div className="mt-6">
                    <RoadTypeInsights ano={anoSelecionado} />
                  </div>
                </div>
              </section>
            )}

            {paginaAtiva === 'Sobre' && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-3xl font-semibold">Sobre o Projeto</h3>

                <p className="mt-3 text-slate-600 leading-relaxed">
                O Urban Mobility Insights é um dashboard interativo desenvolvido no âmbito 
                do Projeto de Engenharia Informática, com o objetivo de apoiar a análise 
                da sinistralidade rodoviária em Portugal.
                </p>

                <p className="mt-3 text-slate-600 leading-relaxed">
                A aplicação permite explorar os dados através de visualizações temporais, 
                geográficas e estatísticas, facilitando a identificação de padrões e  
                a interpretação da informação disponibilizada.
                </p>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">
                      Fonte dos dados
                    </div>
                    <div className="mt-1 font-semibold text-slate-800">
                      ANSR
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">
                      Período analisado
                    </div>
                    <div className="mt-1 font-semibold text-slate-800">
                      2020–2025 (2025 até setembro)
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Tecnologias</div>
                    <div className="mt-1 font-semibold text-slate-800">
                      React · Tailwind CSS · Leaflet · GeoJSON · Recharts
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  Nota: Os dados referentes a 2025 encontram-se disponíveis apenas até setembro. 
                  Os meses posteriores não devem ser interpretados como ausência de acidentes.
                </p>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}