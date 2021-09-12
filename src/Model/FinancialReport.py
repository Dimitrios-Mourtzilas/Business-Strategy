

import pandas as pd

class FinancialReport:

    _file = None
    _growthRate = 0
    def __init__(self,file):
        if file is None or not file.__contains__(".xlsx"):
            return
        else:
            self._file = pd.read_excel(file)

    def setYear(self):
        self.year = self._file['Year']

    def setCompRevenue(self):
        self.comp_revenue = self._file['Company Revenue']

    def setTimePeriod(self):
        self.time_period = self._file['Time Period']

    def setFixedCosts(self):
        self.fixed_costs = self._file['Fixed Costs']

    def setProductSales(self):
        self.product_sales = self._file['Product Sales']

    def setGrowthRate(self):
        self.growthRate= self._file['Growth Rate']

    def getYear(self):
        return self.year

    def getCompRevenue(self):
        return self.comp_revenue

    def getProductsSales(self):
        return self.product_sales

    def getGrowth(self):
        return self.growthRate

    def getTimePeriod(self):
        return self.time_period

    def getFixedCosts(self):
        return self.fixed_costs
    def getJson(self):
        return dict({
            'year':self.getYear(),
            'comp_revenue':self.getCompRevenue(),
            'product_sales':self.getProductsSales(),
            'time_period':self.getTimePeriod(),
            'fixed_costs':self.getFixedCosts(),
            'growth_rate':self.getGrowth()
        })

