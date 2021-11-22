import sqlite3
from src.Model.File import File
from src.Model.Product import Product
from src.Model.User import *
from hashlib import md5
import json


class Database:
    _con = None
    _cursor = None
    _id = 0
    def __init__(self):
        self._con = sqlite3.connect("business_model.db")
        self._cursor = self._con.cursor()

    
    def establishConnection(self,user_name="",user_password=""):
        self.user_name = user_name
        self.user_password = user_password
        self.user_data = self._cursor.execute("select user_name, user_password from user").fetchall()
        for values in self.user_data:
            if self.user_name.__eq__(values[0]) and self.user_password.__eq__(values[1]):
                return True
        return False
    
    def getConnection(self):
        return self
 
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
                                     values['empSalary'], values['empEmail'], values['empPhone']))


        self._con.commit()

    def runRandomQuery(self,query,param=None):
        self.query = query
        try:
            if param == None:
                if not self._cursor.execute(self.query):
                    raise Exception('Could not execute query')
                print("Query sucesssflly exetued")
            else:
                if not self._cursor.execute(self.query,param):
                    raise Exception('Could not execute query')
                print("Query sucesssflly exetued")
        except Exception as e:
            print(e)
            

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
    
    def saveFile(self,file):
        if not isinstance(file,File):
            return
        self.file = file
        for values in self.file.getJson():
            self._cursor.execute("insert into files"+
            "(file_nane,file_path,file_size,file_added)"+
            "values(?,?,?,?)",(values['file_name'],values['file_size'],values['file_path'],values['date_added']))
        self._cursor.commit()
    
    def fetchAllFiles(self):
        return self._cursor.execute("select *from files").fetchall()


    def fetchUser(self):
        return self._cursor.execute('select *form user ').fetchone()
    
    def saveUser(self,user):
        if not isinstance(user, User):
            return
        self.user = user
        self.user_data = json.load(self.user.getJson())
        print(self.user_data)
        self._cursor.execute('''
        
        insert into user
        (user_id,first_name,last_name,user_name,user_password,phone_number,email_address)
        values(?,?,?,?,?,?,?)
        ''',(self.user_data['user_id'],self.user_data['first_name'],self.user_data['last_name'],self.user_data['user_name'],
        self.user_data['user_password'],self.user_data['phone_number'],self.user_data['email_address']))

        self._cursor.execute('commit;')
        self.user_data['user_id'] +=1
        
    def closeConnection(self):
        self._cursor.close()
        self._con.close()