import pandas as pd
class FinancialReport:

    _file = None
    def __init__(self):
        pass

    def setFile(self,file):
        if file is None or not file.__contains__(".xlsx"):
            return
        self._file = pd.read_excel(file)




    def setTimePeriod(self):
        self.starting = self._file['Starting date']
        self.ending = self._file['Ending date']


    def setReportId(self):
        self.reportId = self._file['Report id']

    def setCompanyId(self):
        self.companyId = self._file['Company id']

    def setCompanyRevenue(self):
        self.company_revenue = self._file['Company revenue']

    def setTurnOver(self):
        self.turnover = self._file['Turn over']

    def setProductSales(self):
        self.p_sales = self._file['Product sales']

    def setFixedCosts(self):
        self.fixed_costs = self._file['Fixed costs']

    def setNetAssets(self):
        self.netAssets = self._file['Net assets']

    def getJson(self):
        return dict(
            {'report_id':self.reportId,
             'company_id':self.companyId,
             'starting_period':self.starting,
             'ending_period':self.ending,
             'company_revenue':self.company_revenue,
             'turnover':self.turnover,
             'fixed_costs':self.fixed_costs,
             'net_assets':self.netAssets
             }
        )
    def getFile(self):
        return self._file

