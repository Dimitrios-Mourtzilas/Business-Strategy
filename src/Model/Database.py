import sqlite3
from src.Model.User import *

class Database:
    _con = None
    _cursor = None
    def __init__(self):
        self._con = sqlite3.connect("business_model.db")
        self._cursor = self._con.cursor()
        
    def establishConnection(self,user):
        if not isinstance(user,User):
            return False
        self.user = user
        self.userName = self.user.getUserName()
        self.userPassword = self.user.getUserPassword()
        self.user_data = self._cursor.execute('select user_name, user_password from user').fetchall()
        if self.userName.__eq__(self.user_data[0][1]):
            return True
        return False

    def fetchAllEmployees(self):
        self._cursor.execute("select *from employee")
        return self._cursor.fetchall()

    def fetchAllCompanies(self):
        self._cursor.execute("select *from company")
        return self._cursor.fetchall()

    def fetchCompanyByKey(self, compKey=""):
        self._cursor.execute(
            "select *from company inner join financialReport on financialReport.compName = company.compName where compName like ?",
            ('%' + compKey + '%',))
        return self._cursor.fetchall()

    def saveEmployee(self, employee):
        if employee is None:
            return
        self.employee = employee
        for values in self.employee.getJson():
            self._cursor.execute("""
            insert into employee(empId,empName,empSurname,empAge,empSalary,empPhone)
            values(?,?,?,?,?,?,?)""", (values['empId']), values['empName'], values['empSurname'], values['empAge'],
                                values['empSalary'], values['empEmail'],values('empPhone'))

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
                insert into financialReport(reportId,company_id,starting_date,ending_date,product_sales,turn_over,fixed_costs,net_assets)
                values(?,?,?,?,?,?,?,?)
                """
                ,values['report_id'],values['company_id'],values['starting_period'],values['ending_period'],values['product_sales'],values['turnover'],values['fixed_costs'],values['net_assets'])
            self._con.commit()
    
    def fetchAllUsers(self):
        self._cursor.execute('select *from user')
        return self._cursor.fetchall()
        


