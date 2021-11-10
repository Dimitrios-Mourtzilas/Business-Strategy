import sqlite3

from src.Model.Product import Product
from src.Model.User import *
from hashlib import md5

class Database:
    _con = None
    _cursor = None

    def __init__(self):
        self._con = sqlite3.connect("business_model.db")
        self._cursor = self._con.cursor()

    def establishConnection(self,user):
        self.user = user
        self.userName = self.user.getUserName()
        self.userPassword = self.user.getUserPassword()
        self.user_data = self._cursor.execute("select user_name, user_password from user").fetchall()
        for values in self.user_data:
            if self.userName.__eq__(values[0]) and self.userPassword.__eq__(values[1]):
                return True
        return False

    def fetchAllEmployees(self):
        self._cursor.execute("select *from employee")
        return self._cursor.fetchall()


    def saveEmployee(self, employee):
        if employee is None:
            return
        self.employee = employee
        for values in self.employee.getJson():
            self._cursor.execute("""
            insert into employee(empId,empName,empSurname,empAge,empSalary,empEmail,empPhone)
            values(?,?,?,?,?,?,?)""", (values['empId'], values['empName'], values['empSurname'], values['empAge'],
                                     values['empSalary'], values['empEmail'], values('empPhone')))


        self._con.commit()

    def saveCompany(self, company):
        if company is None:
            return
        self.company = company
        for values in self.company.getJson():
            self._cursor.execute(
                """
                insert into company(company_id,company_name,company_city,country_code,year_founded,empId,clientId,supplierId,productId)
                values(?,?,?,?,?,?,?,?,?)
                """
                , (values['companyId'], values['companyName'], values['companyCity']+
                   values['countryCode'], values['yearFounded'], values['empId'], values['clientId'],+
                   values['supplierId'], values['productId']))
        self._con.commit()

    def saveProdcut(self,product):
        if not isinstance(product,Product):
            return
        self.product = product
        for values in self.product.getJsonData():
            self._cursor.execute(
                """
                insert into product(productId, product_desc, product_price, products_sold)VALUES
                (?,?,?,?)
                """,( values['productId'], values['productDesc'],values['productPrice'], values['productsSold'])
            )
        self._con.commit()

    def saveFinancialReport(self, financialReport):
        if financialReport is None:
            return
        else:
            self.financialReport = financialReport
            for values in self.financialReport.getJson():
                self._cursor.execute(
                    """
                insert into financialReport(reportId,starting_period,ending_period,companyId,turn_over,fixed_costs,net_assets)
                values(?,?,?,?,?,?,?)
                """ , (values['report_id'], values['starting_period'], values['ending_period'],values['companyId'],
                    values['product_sales'], values['turnover'], values['fixed_costs'], values['net_assets']))

            self._con.commit()

    def fetchAllUsers(self):
        self._cursor.execute('select *from user')
        return self._cursor.fetchall()
    

