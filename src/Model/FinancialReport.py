
import pandas as pd

class FinancialReport:

    _file = None
    # _growthRate = 0
    _year = 0
    _comp_revenue = .0
    _fixed_costs = 0
    # _product_sales = 0
    def __init__(self ,file):
        if file is None or not file.__contains__(".csv"):
            return
        else:
            self._file = pd.read_csv(file)

    def setYear(self):
        self.year = self._file['Year']

    def setCompRevenue(self):
        self.comp_revenue = self._file['Company Revenue']


    def setFixedCosts(self):
        self.fixed_costs = self._file['Fixed Costs']


    def setNetWorth(self):
        self._networth = self._file['Net worth']

    def getYear(self):
        return self.year

    def getCompRevenue(self):
        return self.comp_revenue

    def getNetWorth(self):
        return self._networth

    def getFixedCosts(self):
        return self.fixed_costs
    def getJson(self):
        return dict({
            'year' :self.getYear(),
            'comp_revenue' :self.getCompRevenue(),
            'fixed_costs' :self.getFixedCosts(),
            'net_worth':self.getNetWorth()
        })
