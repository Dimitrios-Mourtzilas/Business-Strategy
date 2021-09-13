import json

import pandas as pd

class FinancialReport:

    _file = None
    _growthRate = 0
    def __init__(self,file):
        if file is None or not file.__contains__(".xlsx") or not file.__contains__('.csv'):
            return
        else:
            if file.__contains__('.csv'):
                self._file = pd.read_csv(file)
            else:
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

    def setFixedCosts(self):
        self.fixed_costs = self._file['Fixed costs']

    def setNetAssets(self):
        self.netAssets = self._file['Net assets']

    def getToJson(self):
        return json.dumps(
            {'report_id':self.reportId,
             'starting_period':self.starting,
             'ending_period':self.ending,
             'company_id':self.companyId,
             'company_revenue':self.company_revenue,
             'turnover':self.turnover,
             'fixed_costs':self.fixed_costs,
             'net_assets':self.netAssets
             }
        )