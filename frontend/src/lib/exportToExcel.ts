import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function exportDCFToExcel(data: any) {
  const wb = XLSX.utils.book_new();

  // Summary Sheet
  const summaryData = [
    ['AlphaForge - DCF Analysis'],
    [''],
    ['Company:', data.company_name],
    ['Ticker:', data.ticker],
    ['Analysis Date:', new Date().toLocaleDateString()],
    [''],
    ['VALUATION SUMMARY'],
    ['Current Price:', data.current_price],
    ['Fair Value:', data.dcf_results.value_per_share],
    ['Upside/Downside:', `${data.upside}%`],
    [''],
    ['Enterprise Value:', data.dcf_results.enterprise_value],
    ['Equity Value:', data.dcf_results.equity_value],
    ['PV of FCF:', data.dcf_results.pv_fcf],
    ['PV of Terminal Value:', data.dcf_results.pv_terminal],
  ];

  const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary');

  // Projections Sheet
  const projectionsData = [
    ['Year', 'Revenue', 'EBITDA', 'EBIT', 'Tax', 'NOPAT', 'CapEx', 'NWC Change', 'FCF'],
    ...data.dcf_results.projections.map((proj: any) => [
      proj.Year,
      proj.Revenue,
      proj.EBITDA,
      proj.EBIT,
      proj.Tax,
      proj.NOPAT,
      proj.Capex,
      proj.NWC_Change,
      proj.FCF,
    ]),
  ];

  const projectionsWS = XLSX.utils.aoa_to_sheet(projectionsData);
  XLSX.utils.book_append_sheet(wb, projectionsWS, 'Projections');

  // Generate file
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, `${data.ticker}_DCF_Analysis_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportScenariosToExcel(data: any) {
  const wb = XLSX.utils.book_new();

  // Summary Sheet
  const summaryData = [
    ['AlphaForge - Scenario Analysis'],
    [''],
    ['Company:', data.company_name],
    ['Ticker:', data.ticker],
    ['Current Price:', data.current_price],
    ['Analysis Date:', new Date().toLocaleDateString()],
    [''],
    ['SCENARIO COMPARISON'],
    ['', 'Bear Case', 'Base Case', 'Bull Case'],
    ['Fair Value', data.scenarios.bear.value_per_share, data.scenarios.base.value_per_share, data.scenarios.bull.value_per_share],
    ['Upside/Downside', `${data.scenarios.bear.upside}%`, `${data.scenarios.base.upside}%`, `${data.scenarios.bull.upside}%`],
    [''],
    ['ASSUMPTIONS'],
    ['Revenue Growth', 
      `${(data.scenarios.bear.assumptions.revenue_growth * 100).toFixed(1)}%`,
      `${(data.scenarios.base.assumptions.revenue_growth * 100).toFixed(1)}%`,
      `${(data.scenarios.bull.assumptions.revenue_growth * 100).toFixed(1)}%`
    ],
    ['EBITDA Margin',
      `${(data.scenarios.bear.assumptions.ebitda_margin * 100).toFixed(1)}%`,
      `${(data.scenarios.base.assumptions.ebitda_margin * 100).toFixed(1)}%`,
      `${(data.scenarios.bull.assumptions.ebitda_margin * 100).toFixed(1)}%`
    ],
    ['WACC',
      `${(data.scenarios.bear.assumptions.wacc * 100).toFixed(1)}%`,
      `${(data.scenarios.base.assumptions.wacc * 100).toFixed(1)}%`,
      `${(data.scenarios.bull.assumptions.wacc * 100).toFixed(1)}%`
    ],
  ];

  const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWS, 'Scenarios');

  // Base Case Projections
  const projectionsData = [
    ['Year', 'Revenue', 'EBITDA', 'EBIT', 'Tax', 'NOPAT', 'CapEx', 'NWC Change', 'FCF'],
    ...data.base_case.projections.map((proj: any) => [
      proj.Year,
      proj.Revenue,
      proj.EBITDA,
      proj.EBIT,
      proj.Tax,
      proj.NOPAT,
      proj.Capex,
      proj.NWC_Change,
      proj.FCF,
    ]),
  ];

  const projectionsWS = XLSX.utils.aoa_to_sheet(projectionsData);
  XLSX.utils.book_append_sheet(wb, projectionsWS, 'Base Projections');

  // Generate file
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, `${data.ticker}_Scenario_Analysis_${new Date().toISOString().split('T')[0]}.xlsx`);
}
