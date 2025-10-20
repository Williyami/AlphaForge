"""
DCF (Discounted Cash Flow) Valuation Model
"""

import pandas as pd
import numpy as np
from typing import Dict

class DCFModel:
    """Discounted Cash Flow valuation model"""
    
    def __init__(self, inputs):
        self.inputs = inputs
        self.projections = None
        self.valuation = None
    
    def project_financials(self) -> pd.DataFrame:
        """Project financial statements"""
        years = range(1, self.inputs.projection_years + 1)
        
        projections = {
            'Year': years,
            'Revenue': [],
            'EBITDA': [],
            'EBIT': [],
            'Tax': [],
            'NOPAT': [],
            'Capex': [],
            'NWC_Change': [],
            'FCF': []
        }
        
        for year in years:
            revenue = self.inputs.base_revenue * (1 + self.inputs.revenue_growth) ** year
            ebitda = revenue * self.inputs.ebitda_margin
            ebit = ebitda - (revenue * self.inputs.da_percent)
            tax = ebit * self.inputs.tax_rate
            nopat = ebit - tax
            capex = revenue * self.inputs.capex_percent
            nwc_change = revenue * self.inputs.nwc_percent
            fcf = nopat + (revenue * self.inputs.da_percent) - capex - nwc_change
            
            projections['Revenue'].append(revenue)
            projections['EBITDA'].append(ebitda)
            projections['EBIT'].append(ebit)
            projections['Tax'].append(tax)
            projections['NOPAT'].append(nopat)
            projections['Capex'].append(capex)
            projections['NWC_Change'].append(nwc_change)
            projections['FCF'].append(fcf)
        
        self.projections = pd.DataFrame(projections)
        return self.projections
    
    def calculate_terminal_value(self) -> float:
        """Calculate terminal value"""
        final_fcf = self.projections['FCF'].iloc[-1]
        terminal_fcf = final_fcf * (1 + self.inputs.terminal_growth_rate)
        
        denominator = self.inputs.wacc - self.inputs.terminal_growth_rate
        if denominator <= 0:
            print(f"Warning: Invalid WACC, using default")
            denominator = 0.055
        
        terminal_value = terminal_fcf / denominator
        return terminal_value
    
    def calculate_enterprise_value(self) -> Dict:
        """Calculate enterprise value and equity value"""
        if self.inputs.wacc <= 0:
            wacc = 0.08
        else:
            wacc = self.inputs.wacc
            
        discount_factors = [(1 + wacc) ** year for year in self.projections['Year']]
        pv_fcf = sum(self.projections['FCF'] / discount_factors)
        
        terminal_value = self.calculate_terminal_value()
        pv_terminal = terminal_value / ((1 + wacc) ** self.inputs.projection_years)
        
        enterprise_value = pv_fcf + pv_terminal
        equity_value = enterprise_value - self.inputs.net_debt
        
        shares_outstanding = self.inputs.shares_outstanding if self.inputs.shares_outstanding > 0 else 1e9
        value_per_share = equity_value / shares_outstanding
        
        return {
            'pv_fcf': float(pv_fcf),
            'terminal_value': float(terminal_value),
            'pv_terminal': float(pv_terminal),
            'enterprise_value': float(enterprise_value),
            'equity_value': float(equity_value),
            'value_per_share': float(value_per_share)
        }
    
    def run(self):
        """Run complete DCF model"""
        from app.schemas.analysis import DCFOutputs
        
        if self.inputs.base_revenue <= 0:
            raise ValueError("Base revenue must be positive")
        
        self.project_financials()
        valuation = self.calculate_enterprise_value()
        
        return DCFOutputs(
            projections=self.projections.to_dict('records'),
            enterprise_value=valuation['enterprise_value'],
            equity_value=valuation['equity_value'],
            value_per_share=valuation['value_per_share'],
            pv_fcf=valuation['pv_fcf'],
            pv_terminal=valuation['pv_terminal']
        )