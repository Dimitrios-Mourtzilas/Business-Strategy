import sqlite3

class Database:
    _con = None
    _cursor = None
    def __init__(self):
        pass

    def establishConnection(self):
        self._con = sqlite3.connect('business_model.db')
        self._cursor = self._con.cursor()
        return self._con


    def fetchAllEmployees(self):
        self._cursor.execute("select *from employee")
        return self._cursor.fetchall()

    def fetchAllCompanies(self):
        self._cursor.execute("select *from company")
        return self._cursor.fetchall()

    def fetchCompanyByKey(self, compKey=""):
        self._cursor.execute(
            "select *from company inner join financialReport on financialReport.compName = companu.compName where compName like ?",
            ('%' + compKey + '%',))
        return self._cursor.fetchall()

    def saveEmployee(self, employee):
        if employee is None:
            return
        self.employee = employee
        for values in self.employee.getJson():
            self._cursor.execute("""
            insert into employee(empId,empName,empSurname,empAge,empSalary,empPhone)
            values(?,?,?,?,?,?)""", (values['empId'],values['empName'],values['empSurname'],values['empAge'],values['empSalary']))
        self._con.commit()

    def saveCompany(self, company):
        if company is None:
            return
        self.company = company
        for values in self.company.getJson():
            self._cursor.execute(
                """
                insert into company(compName,compCity,compCountry,year_founded)
                values(?,?,?,?)
                """
                , (values['compName'], values['compCity'], values['compCountry'], values['year_founded']))
        self._con.commit()

    def saveFinancialReport(self, financialReport):
        if financialReport is None:
            return
        else:
            self.financialReport = financialReport
            for values in self.financialReport.getJson():
                self._cursor.execute(
                    """
                    insert into financialreport(
                    reportId,starting_period,ending_period,companyId,turn_over,fixed_costs,net_assets
                    ) values(?,?,?,?,?,?,?)
                    """,(values['reportId'],values['starting_period'],values['ending_period'],values['companyId'],values['turn_over'],values['fixed_costs'],values['net_assets']))
            self._con.commit()