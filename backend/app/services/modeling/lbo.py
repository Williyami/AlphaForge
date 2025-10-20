"""
LBO (Leveraged Buyout) Model Calculator
"""

import numpy as np
from typing import Dict, List
from app.schemas.lbo import LBOInputs, LBOOutputs, LBOReturns

class LBOModel:
    """Leveraged Buyout financial model"""
    
    def __init__(self, inputs: LBOInputs):
        self.inputs = inputs
        self.projections = []
        
    def calculate_sources_and_uses(self) -> Dict:
        """Calculate sources and uses of funds"""
        purchase_price = self.inputs.purchase_price
        debt_amount = purchase_price * self.inputs.debt_percent
        equity_amount = purchase_price * (1 - self.inputs.debt_percent)
        
        # Assume 2% transaction fees
        transaction_fees = purchase_price * 0.02
        total_uses = purchase_price + transaction_fees
        
        return {
            "sources": {
                "debt": debt_amount,
                "equity": equity_amount,
                "total": debt_amount + equity_amount
            },
            "uses": {
                "purchase_price": purchase_price,
                "transaction_fees": transaction_fees,
                "total": total_uses
            }
        }
    
    def project_financials(self) -> List[Dict]:
        """Project financial statements over hold period"""
        projections = []
        debt_balance = self.inputs.purchase_price * self.inputs.debt_percent
        
        for year in range(1, self.inputs.hold_period + 1):
            # Revenue and EBITDA
            revenue = self.inputs.base_revenue * (1 + self.inputs.revenue_growth) ** year
            ebitda = revenue * self.inputs.ebitda_margin
            
            # Interest expense
            interest = debt_balance * self.inputs.interest_rate
            
            # EBT and taxes
            ebt = ebitda - interest
            taxes = max(0, ebt * self.inputs.tax_rate)
            net_income = ebt - taxes
            
            # CapEx and NWC
            capex = revenue * self.inputs.capex_percent
            nwc_change = revenue * self.inputs.nwc_percent
            
            # Free Cash Flow
            fcf = net_income + interest - capex - nwc_change
            
            # Management fees (on initial equity)
            initial_equity = self.inputs.purchase_price * (1 - self.inputs.debt_percent)
            mgmt_fee = initial_equity * self.inputs.management_fees
            fcf_after_fees = fcf - mgmt_fee
            
            # Debt paydown (use all FCF to pay down debt)
            debt_paydown = min(fcf_after_fees, debt_balance)
            debt_balance = max(0, debt_balance - debt_paydown)
            
            # Equity value at this point
            enterprise_value = ebitda * self.inputs.exit_multiple
            equity_value = enterprise_value - debt_balance
            
            projections.append({
                "year": year,
                "revenue": revenue,
                "ebitda": ebitda,
                "interest": interest,
                "ebt": ebt,
                "taxes": taxes,
                "net_income": net_income,
                "capex": capex,
                "nwc_change": nwc_change,
                "fcf": fcf,
                "management_fees": mgmt_fee,
                "fcf_after_fees": fcf_after_fees,
                "debt_paydown": debt_paydown,
                "debt_balance": debt_balance,
                "equity_value": equity_value
            })
        
        return projections
    
    def calculate_returns(self, projections: List[Dict]) -> LBOReturns:
        """Calculate investment returns (IRR, MOIC, etc.)"""
        # Entry equity
        entry_equity = self.inputs.purchase_price * (1 - self.inputs.debt_percent)
        
        # Exit equity (from final year)
        final_year = projections[-1]
        exit_equity = final_year["equity_value"]
        
        # Total return
        total_return = exit_equity - entry_equity
        
        # MOIC (Multiple on Invested Capital)
        moic = exit_equity / entry_equity if entry_equity > 0 else 0
        
        # Cash-on-Cash
        cash_on_cash = moic  # Same as MOIC in this simplified model
        
        # IRR calculation
        # Cash flows: -entry_equity at t=0, +exit_equity at t=hold_period
        cash_flows = [-entry_equity] + [0] * (self.inputs.hold_period - 1) + [exit_equity]
        irr = self._calculate_irr(cash_flows)
        
        return LBOReturns(
            entry_equity=float(entry_equity),
            exit_equity=float(exit_equity),
            total_return=float(total_return),
            irr=float(irr),
            moic=float(moic),
            cash_on_cash=float(cash_on_cash)
        )
    
    def _calculate_irr(self, cash_flows: List[float]) -> float:
        """Calculate Internal Rate of Return using numpy"""
        try:
            return float(np.irr(cash_flows))
        except:
            # Fallback: approximate IRR
            moic = abs(cash_flows[-1] / cash_flows[0])
            years = len(cash_flows) - 1
            return (moic ** (1/years)) - 1
    
    def create_debt_schedule(self, projections: List[Dict]) -> List[Dict]:
        """Create debt paydown schedule"""
        debt_schedule = []
        
        for proj in projections:
            debt_schedule.append({
                "year": proj["year"],
                "beginning_balance": proj["debt_balance"] + proj["debt_paydown"],
                "interest": proj["interest"],
                "principal_paydown": proj["debt_paydown"],
                "ending_balance": proj["debt_balance"]
            })
        
        return debt_schedule
    
    def run(self) -> LBOOutputs:
        """Run complete LBO model"""
        # Calculate sources and uses
        sources_uses = self.calculate_sources_and_uses()
        
        # Project financials
        projections = self.project_financials()
        
        # Calculate returns
        returns = self.calculate_returns(projections)
        
        # Create debt schedule
        debt_schedule = self.create_debt_schedule(projections)
        
        return LBOOutputs(
            projections=projections,
            returns=returns.dict(),
            sources_and_uses=sources_uses,
            debt_schedule=debt_schedule
        )
