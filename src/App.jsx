import { useEffect, useState } from 'react';
import MapView from './components/MapView';
import MonthlyAccidentsChart from './components/MonthlyAccidentsChart';

export default function MobilidadeDashboard() {

  const [anoSelecionado, setAnoSelecionado] = useState('2025');
  const [mesSelecionado, setMesSelecionado] = useState('Todos');
  const [dadosDistrito, setDadosDistrito] = useState([]);

  useEffect(() => {
  fetch('/data/acidentes_distrito.json')
    .then((res) => res.json())
    .then((data) => setDadosDistrito(data))
    .catch((err) => console.error('Erro ao carregar acidentes_distrito.json:', err));
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
  return new Intl.NumberFormat('pt-PT').format(valor);
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

  const hourlyData = [
    { hour: '0h', value: 250 },
    { hour: '2h', value: 120 },
    { hour: '4h', value: 100 },
    { hour: '6h', value: 190 },
    { hour: '8h', value: 470 },
    { hour: '10h', value: 750 },
    { hour: '12h', value: 530 },
    { hour: '14h', value: 480 },
    { hour: '16h', value: 670 },
    { hour: '18h', value: 880 },
    { hour: '20h', value: 710 },
    { hour: '22h', value: 590 },
  ];

  const roadTypeData = [
    { label: 'Arruamentos', value: 34.2, color: 'bg-blue-400' },
    { label: 'Estradas Nacionais', value: 28.7, color: 'bg-emerald-400' },
    { label: 'Autoestradas', value: 18.9, color: 'bg-amber-400' },
    { label: 'Estradas Municipais', value: 12.1, color: 'bg-pink-400' },
    { label: 'Outros', value: 6.1, color: 'bg-slate-400' },
  ];

  const recentAccidents = [
    {
      date: '15/12/2023 08:45',
      place: 'A2, km 5.3 - Lisboa',
      roadType: 'Autoestrada',
      severity: 'Com Vítimas',
      severityClass: 'bg-red-100 text-red-600',
    },
    {
      date: '14/12/2023 17:30',
      place: 'Av. da República - Porto',
      roadType: 'Arruamento',
      severity: 'Feridos Ligeiros',
      severityClass: 'bg-orange-100 text-orange-600',
    },
    {
      date: '14/12/2023 07:15',
      place: 'EN125, km 87.2 - Faro',
      roadType: 'Estrada Nacional',
      severity: 'Vítima Mortal',
      severityClass: 'bg-rose-100 text-rose-600',
    },
  ];

  const maxHourly = Math.max(...hourlyData.map((item) => item.value));

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
                <p className="text-slate-300 text-sm">Visualizing data for safer mobility</p>
              </div>
            </div>
          </div>

          <nav className="px-3 py-5 space-y-2">
            {[
              'Dashboard',
              'Análise Temporal',
              'Mapa de Acidentes',
              'Sobre',
            ].map((item, index) => (
              <button
                key={item}
                className={`w-full rounded-xl px-4 py-3 text-left transition ${
                  index === 0
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
              <h2 className="text-lg font-medium">Filtros</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Ano</label>
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

              <div>
  <label className="block text-sm text-slate-300 mb-2">Mês</label>
  <select
    value={mesSelecionado}
    onChange={(e) => setMesSelecionado(e.target.value)}
    className="w-full rounded-xl bg-slate-800 border border-white/10 px-3 py-3 text-white outline-none"
  >
    <option value="Todos">Todos</option>
    <option value="Janeiro">Janeiro</option>
    <option value="Fevereiro">Fevereiro</option>
    <option value="Março">Março</option>
    <option value="Abril">Abril</option>
    <option value="Maio">Maio</option>
    <option value="Junho">Junho</option>
    <option value="Julho">Julho</option>
    <option value="Agosto">Agosto</option>
    <option value="Setembro">Setembro</option>
    <option value="Outubro">Outubro</option>
    <option value="Novembro">Novembro</option>
    <option value="Dezembro">Dezembro</option>
  </select>
</div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Tipo de Via</label>
                <select className="w-full rounded-xl bg-slate-800 border border-white/10 px-3 py-3 text-white outline-none">
                  <option>Todas</option>
                  <option>Arruamentos</option>
                  <option>Estradas Nacionais</option>
                  <option>Autoestradas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Gravidade</label>
                <select className="w-full rounded-xl bg-slate-800 border border-white/10 px-3 py-3 text-white outline-none">
                  <option>Todas</option>
                  <option>Só danos materiais</option>
                  <option>Feridos ligeiros</option>
                  <option>Feridos graves</option>
                  <option>Vítimas mortais</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-medium px-4 py-3 transition">
                  Aplicar Filtros
                </button>
                <button className="rounded-xl border border-white/10 bg-slate-800 hover:bg-slate-700 px-4 py-3 transition">
                  Limpar
                </button>
              </div>
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
                <h2 className="text-5xl font-semibold tracking-tight">Dashboard</h2>
                <p className="text-slate-500 mt-2 text-lg">
                  Visão geral dos acidentes rodoviários
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-600 shadow-sm">
                1 jan 2023 - 31 dez 2023
              </div>
            </div>

            {/* Stat cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {statCards.map((card) => (
                <div
                  key={card.title}
                  className={`rounded-2xl border border-slate-200 p-5 shadow-sm ${card.bg}`}
                >
                  <div className="text-slate-600 text-sm">{card.title}</div>
                  <div className="mt-2 text-4xl font-semibold tracking-tight">{card.value}</div>
                  <div className={`mt-2 text-sm ${card.color}`}>{card.change}</div>
                </div>
              ))}
            </section>

            {/* Main dashboard grid */}
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              {/* Monthly chart */}
              <div className="xl:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <h3 className="text-3xl font-semibold">Acidentes por Mês</h3>
  <div className="mt-1 text-slate-500">
    Distribuição temporal ao longo do ano selecionado
  </div>

  <div className="mt-6">
    <MonthlyAccidentsChart ano={anoSelecionado} />
  </div>
</div>

              {/* Map */}
              <div className="xl:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-3xl font-semibold">Distribuição Geográfica</h3>
                <div className="mt-4">
                  <MapView ano={anoSelecionado} />
                </div>
              </div>

              {/* Hour chart */}
              <div className="xl:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-3xl font-semibold">Acidentes por Hora do Dia</h3>

                <div className="mt-8 h-[240px] flex items-end gap-3">
                  {hourlyData.map((item) => (
                    <div key={item.hour} className="flex-1 flex flex-col items-center justify-end gap-2">
                      <div
                        className="w-full rounded-t-xl bg-violet-300"
                        style={{ height: `${(item.value / maxHourly) * 170}px` }}
                      />
                      <span className="text-xs text-slate-500">{item.hour}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Road type donut mock */}
              <div className="xl:col-span-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-3xl font-semibold">Acidentes por Tipo de Via</h3>

                <div className="mt-8 flex flex-col items-center">
                  <div className="relative h-44 w-44 rounded-full bg-slate-200 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(#60a5fa_0%_34.2%,#34d399_34.2%_62.9%,#fbbf24_62.9%_81.8%,#f472b6_81.8%_93.9%,#94a3b8_93.9%_100%)]" />
                    <div className="absolute h-24 w-24 rounded-full bg-white" />
                    <div className="relative text-center">
                      <div className="text-3xl font-semibold">12.842</div>
                      <div className="text-slate-500 text-sm">Total</div>
                    </div>
                  </div>

                  <div className="mt-6 w-full space-y-3">
                    {roadTypeData.map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className={`h-3 w-3 rounded-full ${item.color}`} />
                          <span className="text-sm text-slate-600">{item.label}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-700">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Empty placeholder for alignment or future chart */}
              <div className="xl:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-3xl font-semibold">Resumo de Gravidade</h3>
                <div className="mt-5 space-y-4">
                  {[
                    { label: 'Só Danos Materiais', value: '54%', width: '54%' },
                    { label: 'Feridos Ligeiros', value: '36%', width: '36%' },
                    { label: 'Feridos Graves', value: '7%', width: '7%' },
                    { label: 'Mortais', value: '3%', width: '3%' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-700">{item.label}</span>
                        <span className="text-slate-500">{item.value}</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-400"
                          style={{ width: item.width }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Table */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-semibold">Últimos Acidentes Registados</h3>
                <button className="text-emerald-600 font-medium hover:text-emerald-500 transition">
                  Ver todos
                </button>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-left text-slate-500 text-sm">
                      <th className="pb-2">Data e Hora</th>
                      <th className="pb-2">Local</th>
                      <th className="pb-2">Tipo de Via</th>
                      <th className="pb-2">Gravidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAccidents.map((item, index) => (
                      <tr key={index} className="bg-slate-50">
                        <td className="px-4 py-4 rounded-l-xl">{item.date}</td>
                        <td className="px-4 py-4">{item.place}</td>
                        <td className="px-4 py-4">{item.roadType}</td>
                        <td className="px-4 py-4 rounded-r-xl">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.severityClass}`}>
                            {item.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}