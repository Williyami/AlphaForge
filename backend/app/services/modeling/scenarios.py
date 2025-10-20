"""
Scenario Analysis Service
Generates Bull, Base, and Bear case valuations
"""

from typing import Dict
from app.services.modeling.dcf import DCFModel
from app.schemas.analysis import DCFInputs, ScenarioResult

class ScenarioAnalysis:
    """Generate multiple valuation scenarios"""
    
    def __init__(self, base_inputs: DCFInputs):
        self.base_inputs = base_inputs
    
    def generate_scenarios(self) -> Dict[str, ScenarioResult]:
        """Generate Bull, Base, and Bear scenarios"""
        
        scenarios = {}
        
        # Base Case (current assumptions)
        base_model = DCFModel(self.base_inputs)
        base_results = base_model.run()
        base_upside = self._calculate_upside(base_results.value_per_share)
        
        scenarios['base'] = ScenarioResult(
            scenario='Base Case',
            value_per_share=base_results.value_per_share,
            upside=base_upside,
            enterprise_value=base_results.enterprise_value,
            equity_value=base_results.equity_value,
            assumptions={
                'revenue_growth': self.base_inputs.revenue_growth,
                'ebitda_margin': self.base_inputs.ebitda_margin,
                'wacc': self.base_inputs.wacc,
                'terminal_growth': self.base_inputs.terminal_growth_rate
            }
        )
        
        # Bull Case (optimistic assumptions)
        bull_inputs = self._create_bull_case()
        bull_model = DCFModel(bull_inputs)
        bull_results = bull_model.run()
        bull_upside = self._calculate_upside(bull_results.value_per_share)
        
        scenarios['bull'] = ScenarioResult(
            scenario='Bull Case',
            value_per_share=bull_results.value_per_share,
            upside=bull_upside,
            enterprise_value=bull_results.enterprise_value,
            equity_value=bull_results.equity_value,
            assumptions={
                'revenue_growth': bull_inputs.revenue_growth,
                'ebitda_margin': bull_inputs.ebitda_margin,
                'wacc': bull_inputs.wacc,
                'terminal_growth': bull_inputs.terminal_growth_rate
            }
        )
        
        # Bear Case (pessimistic assumptions)
        bear_inputs = self._create_bear_case()
        bear_model = DCFModel(bear_inputs)
        bear_results = bear_model.run()
        bear_upside = self._calculate_upside(bear_results.value_per_share)
        
        scenarios['bear'] = ScenarioResult(
            scenario='Bear Case',
            value_per_share=bear_results.value_per_share,
            upside=bear_upside,
            enterprise_value=bear_results.enterprise_value,
            equity_value=bear_results.equity_value,
            assumptions={
                'revenue_growth': bear_inputs.revenue_growth,
                'ebitda_margin': bear_inputs.ebitda_margin,
                'wacc': bear_inputs.wacc,
                'terminal_growth': bear_inputs.terminal_growth_rate
            }
        )
        
        return scenarios
    
    def _create_bull_case(self) -> DCFInputs:
        """Create optimistic scenario"""
        bull_inputs = self.base_inputs.copy()
        
        # Increase growth and margins
        bull_inputs.revenue_growth = min(self.base_inputs.revenue_growth * 1.5, 0.25)  # Cap at 25%
        bull_inputs.ebitda_margin = min(self.base_inputs.ebitda_margin * 1.2, 0.45)   # Cap at 45%
        bull_inputs.wacc = max(self.base_inputs.wacc - 0.01, 0.06)  # Lower WACC (less risk)
        bull_inputs.terminal_growth_rate = min(self.base_inputs.terminal_growth_rate + 0.005, 0.04)
        
        return bull_inputs
    
    def _create_bear_case(self) -> DCFInputs:
        """Create pessimistic scenario"""
        bear_inputs = self.base_inputs.copy()
        
        # Decrease growth and margins
        bear_inputs.revenue_growth = max(self.base_inputs.revenue_growth * 0.5, 0.02)  # Min 2%
        bear_inputs.ebitda_margin = max(self.base_inputs.ebitda_margin * 0.8, 0.15)   # Min 15%
        bear_inputs.wacc = min(self.base_inputs.wacc + 0.02, 0.15)  # Higher WACC (more risk)
        bear_inputs.terminal_growth_rate = max(self.base_inputs.terminal_growth_rate - 0.005, 0.015)
        
        return bear_inputs
    
    def _calculate_upside(self, fair_value: float) -> float:
        """Calculate upside/downside percentage"""
        current_price = self.base_inputs.current_price
        if current_price > 0:
            return round(((fair_value - current_price) / current_price) * 100, 2)
        return 0.0
