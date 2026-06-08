export const exportDashboardData = ({
  selectedYear,
  summaryData,
  monthlyData,
  hourlyData,
  weekdayData,
  roadTypeData,
  accidentNatureData,
  geographicData,
}) => {
  let csvContent = '';

  // RESUMO
  csvContent += `RESUMO DO ANO ${selectedYear}\n\n`;
  csvContent += 'Indicador,Valor\n';

  summaryData.forEach((item) => {
    csvContent += `"${item.label}","${item.value}"\n`;
  });

  csvContent += '\n\n';

  // MENSAL
  csvContent += 'ACIDENTES POR MÊS\n';
  csvContent += 'Mês,Acidentes\n';

  monthlyData.forEach((item) => {
    csvContent += `${item.mes},${item.acidentes}\n`;
  });

  csvContent += '\n\n';

  // HORA
  csvContent += 'ACIDENTES POR HORA\n';
  csvContent += 'Período,Acidentes\n';

  hourlyData.forEach((item) => {
    csvContent += `${item.hora},${item.acidentes}\n`;
  });

  csvContent += '\n\n';

  // DIA DA SEMANA
  csvContent += 'ACIDENTES POR DIA DA SEMANA\n';
  csvContent += 'Dia,Acidentes\n';

  weekdayData.forEach((item) => {
    csvContent += `${item.dia},${item.acidentes}\n`;
  });

  csvContent += '\n\n';

  // TIPO DE VIA
  csvContent += 'TIPO DE VIA\n';
  csvContent += 'Tipo,Acidentes\n';

  roadTypeData.forEach((item) => {
    csvContent += `${item.tipo},${item.acidentes}\n`;
  });

  csvContent += '\n\n';

  // NATUREZA
  csvContent += 'NATUREZA DO ACIDENTE\n';
  csvContent += 'Natureza,Acidentes\n';

  accidentNatureData.forEach((item) => {
    csvContent += `${item.tipo},${item.acidentes}\n`;
  });

  csvContent += '\n\n';

  // GEOGRÁFICA
  csvContent += 'DISTRIBUIÇÃO GEOGRÁFICA\n';
  csvContent += 'Distrito,Acidentes\n';

  geographicData.forEach((item) => {
    csvContent += `${item.distrito},${item.acidentes}\n`;
  });

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const link = document.createElement('a');

  link.href = URL.createObjectURL(blob);
  link.download = `urban_mobility_${selectedYear}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};