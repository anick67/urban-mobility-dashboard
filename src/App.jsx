export default function MobilidadeDashboardMockup() {
  const statCards = [
    { title: 'Total de acidentes', value: '12 487', change: '+8,2% vs 2024' },
    { title: 'Feridos leves', value: '8 913', change: '71,4% do total' },
    { title: 'Feridos graves', value: '624', change: '-3,1% vs 2024' },
    { title: 'Vítimas mortais', value: '96', change: '-1,0% vs 2024' },
  ];

  const monthlyValues = [62, 58, 66, 71, 76, 82, 91, 88, 74, 69, 73, 79];
  const districts = [
    { name: 'Lisboa', value: 96 },
    { name: 'Porto', value: 82 },
    { name: 'Setúbal', value: 68 },
    { name: 'Braga', value: 53 },
    { name: 'Aveiro', value: 47 },
  ];
  const severity = [
    { label: 'Só danos materiais', value: '54%' },
    { label: 'Feridos leves', value: '36%' },
    { label: 'Feridos graves', value: '7%' },
    { label: 'Mortais', value: '3%' },
  ];
  const accidentTypes = [
    { label: 'Colisão', value: 44 },
    { label: 'Despiste', value: 27 },
    { label: 'Atropelamento', value: 16 },
    { label: 'Outros', value: 13 },
  ];
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-[1600px] mx-auto p-6 md:p-8 space-y-6">
        <header className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
          <div className="flex items-center gap-6">
            <img
              src="/logo.png"
              alt="Logo Urban Mobility Insights"
              className="h-44 w-auto"
            />

            <div>
              <p className="text-xs md:text-sm uppercase tracking-[0.28em] text-cyan-300/80">
                Projeto · Mobilidade Urbana
              </p>
              <h1 className="mt-2 text-3xl md:text-4xl font-semibold">
                Dashboard de Sinistralidade Rodoviária
              </h1>
              <p className="mt-3 text-slate-400 max-w-3xl">
                Proposta de interface orientada aos dados da ANSR, com mapa à esquerda,
                painel analítico à direita e filtros ajustados a distrito, mês,
                gravidade e tipo de acidente.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full xl:w-auto">
            {statCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur"
              >
                <div className="text-xs text-slate-400">{card.title}</div>
                <div className="text-2xl font-semibold mt-1">{card.value}</div>
                <div className="text-xs text-cyan-300/80 mt-2">{card.change}</div>
              </div>
            ))}
          </div>
        </header>

        <section className="grid grid-cols-1 2xl:grid-cols-[300px_minmax(0,1.1fr)_520px] gap-6 items-start">
          <aside className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Filtros ANSR</h2>
              <span className="text-xs text-slate-400">Painel lateral</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Ano</label>
                <select className="w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-2.5 outline-none">
                  <option>2025</option>
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Distrito</label>
                <select className="w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-2.5 outline-none">
                  <option>Todos</option>
                  <option>Lisboa</option>
                  <option>Porto</option>
                  <option>Setúbal</option>
                  <option>Braga</option>
                  <option>Aveiro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Mês</label>
                <select className="w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-2.5 outline-none">
                  <option>Todos</option>
                  {months.map((month) => (
                    <option key={month}>{month}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Tipo de acidente</label>
                <select className="w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-2.5 outline-none">
                  <option>Todos</option>
                  <option>Colisão</option>
                  <option>Despiste</option>
                  <option>Atropelamento</option>
                  <option>Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Gravidade</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Todas', 'Danos', 'Leve', 'Grave', 'Mortal'].map((item) => (
                    <button
                      key={item}
                      className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-left hover:bg-slate-800 transition"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Condição de luz</label>
                <select className="w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-2.5 outline-none">
                  <option>Todas</option>
                  <option>Dia</option>
                  <option>Noite</option>
                  <option>Amanhecer / Anoitecer</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button className="flex-1 rounded-xl bg-cyan-400/90 text-slate-950 font-medium px-4 py-2.5 hover:bg-cyan-300 transition">
                  Aplicar
                </button>
                <button className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 hover:bg-slate-800 transition">
                  Limpar
                </button>
              </div>

              <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-4 mt-3">
                <div className="text-sm font-medium">Resumo da seleção</div>
                <div className="mt-3 space-y-2 text-sm text-slate-400">
                  <div>Distrito: <span className="text-slate-200">Todos</span></div>
                  <div>Período: <span className="text-slate-200">Ano 2025</span></div>
                  <div>Ocorrências filtradas: <span className="text-slate-200">12 487</span></div>
                  <div>Hotspot atual: <span className="text-slate-200">Lisboa</span></div>
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-4 md:p-5 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-medium">Mapa interativo das ocorrências</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Área principal para explorar acidentes por localização, com possibilidade de clusters, pontos e heatmap.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Pontos</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Clusters</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Heatmap</span>
                </div>
              </div>

              <div className="relative h-[620px] rounded-[28px] overflow-hidden border border-white/10 bg-slate-950">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),radial-gradient(circle_at_30%_35%,rgba(34,211,238,0.18),transparent_18%),radial-gradient(circle_at_55%_45%,rgba(16,185,129,0.12),transparent_14%),radial-gradient(circle_at_70%_60%,rgba(248,113,113,0.18),transparent_13%)] bg-[size:34px_34px,34px_34px,auto,auto,auto]" />

                <svg viewBox="0 0 1000 700" className="absolute inset-0 w-full h-full opacity-50">
                  <path d="M120 80 L220 120 L300 105 L390 165 L470 150 L535 210 L620 205 L690 290 L760 275 L825 345 L790 460 L700 520 L580 550 L460 520 L360 565 L250 540 L170 470 L135 380 L95 290 Z" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="4" />
                  <path d="M250 140 L290 220 L380 250 L470 240 L560 300 L650 280 L730 350" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
                  <path d="M190 320 L320 340 L410 430 L560 420 L660 470" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
                </svg>

                {[
                  { left: '18%', top: '26%', size: '16px' },
                  { left: '29%', top: '39%', size: '20px' },
                  { left: '42%', top: '32%', size: '14px' },
                  { left: '56%', top: '47%', size: '24px' },
                  { left: '67%', top: '42%', size: '18px' },
                  { left: '61%', top: '63%', size: '15px' },
                  { left: '36%', top: '60%', size: '13px' },
                ].map((point, index) => (
                  <div
                    key={index}
                    className="absolute rounded-full bg-cyan-300/95 border border-white/30 shadow-[0_0_0_10px_rgba(34,211,238,0.12)]"
                    style={{ left: point.left, top: point.top, width: point.size, height: point.size }}
                  />
                ))}

                <div className="absolute left-4 top-4 rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-3 backdrop-blur">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Camada ativa</div>
                  <div className="text-sm font-medium mt-1">Acidentes com vítimas</div>
                </div>

                <div className="absolute right-4 top-4 rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-3 backdrop-blur">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Seleção</div>
                  <div className="text-sm font-medium mt-1">Lisboa</div>
                  <div className="text-xs text-slate-400 mt-1">2 148 acidentes · 18 vítimas mortais</div>
                </div>

                <div className="absolute left-4 bottom-4 right-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-3 backdrop-blur">
                    <div className="text-xs text-slate-500 uppercase tracking-[0.18em]">Coordenadas</div>
                    <div className="text-sm mt-1">38.7223, -9.1393</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-3 backdrop-blur">
                    <div className="text-xs text-slate-500 uppercase tracking-[0.18em]">Tipo dominante</div>
                    <div className="text-sm mt-1">Colisão</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-3 backdrop-blur">
                    <div className="text-xs text-slate-500 uppercase tracking-[0.18em]">Filtro atual</div>
                    <div className="text-sm mt-1">2025 · Todos os meses</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-medium">Acidentes por mês</h3>
                  <p className="text-sm text-slate-400 mt-1">Distribuição temporal ao longo do ano selecionado.</p>
                </div>
                <span className="text-xs text-slate-400">Série temporal</span>
              </div>
              <div className="h-60 flex items-end gap-2.5">
                {monthlyValues.map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center justify-end gap-2">
                    <div
                      className="w-full rounded-t-2xl bg-gradient-to-t from-cyan-500/65 via-sky-400/85 to-blue-300/95"
                      style={{ height: `${value * 2.1}px` }}
                    />
                    <span className="text-[11px] text-slate-500">{months[index]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-medium">Top distritos</h3>
                  <p className="text-sm text-slate-400 mt-1">Distritos com maior volume de acidentes.</p>
                </div>
                <span className="text-xs text-slate-400">Ranking</span>
              </div>
              <div className="space-y-4">
                {districts.map((district) => (
                  <div key={district.name}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>{district.name}</span>
                      <span className="text-slate-400">{district.value}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-900 border border-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                        style={{ width: `${district.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-medium">Gravidade</h3>
                  <p className="text-sm text-slate-400 mt-1">Repartição dos acidentes por consequência.</p>
                </div>
                <span className="text-xs text-slate-400">Resumo</span>
              </div>
              <div className="space-y-3">
                {severity.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                    <span className="text-sm">{item.label}</span>
                    <span className="text-sm text-cyan-300">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-medium">Tipo de acidente</h3>
                  <p className="text-sm text-slate-400 mt-1">Categorias principais presentes nos dados.</p>
                </div>
                <span className="text-xs text-slate-400">Composição</span>
              </div>
              <div className="space-y-4">
                {accidentTypes.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>{item.label}</span>
                      <span className="text-slate-400">{item.value}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-900 border border-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-sky-400"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}
