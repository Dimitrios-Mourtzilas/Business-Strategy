

import pandas as pd

class FinancialReport:

    _file = None
    def __init__(self,file):
        if file is None or not file.__contains__(".xlsx"):
            return
        else:
            self._file=file

    def setYear(self):
        self.year = self._file['Year']


    def setCompRevenue(self):
        self.comp_revenue = self._file['Revenue']


    def setProductSales(self):
        self.sales = self._file['Products Sold']

    def setGrowth(self):
        self.growth_pointer = self._file['Growth Rate']

    def getYear(self):
        return self.year

    def getCompRevenue(self):
        return self.comp_revenue

    def getProductsSales(self):
        return self.sales

    def getGrowth(self):
        return self.growth_pointer

    def getToJson(self):
        return dict({
            'year':self.getYear(),
            'comp_revenue':self.getCompRevenue(),
            'product_sales':self.getProductsSales(),
            'growth_rate':self.getGrowth()
        })

