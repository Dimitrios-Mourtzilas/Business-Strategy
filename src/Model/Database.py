import sqlite3
from src.Model.File import *
from src.Model.FinancialReport import *
from src.Model.Company import *
from hashlib import md5
import json

class Database:
    _con = None
    _cursor = None
    _pos = 0

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
 
 
    def runRandomQuery(self,query,param=None):
        self.query = query
        try:
            if param == None:
                if not self._cursor.execute(self.query):
                    raise Exception('Could not execute query')
            else:
                if not self._cursor.execute(self.query,param):
                    raise Exception('Could not execute query')
            self._cursor.execute("commit;")
        except Exception as e:
            print(e)
            
    
    def fetchUsers(self):
        return self._cursor.execute("select *from user").fetchall()

    def saveCompany(self, company):
        if not isinstance(company,Company):
            return

        self.company = company
        for values in self.company.getJson():
            self._cursor.execute(
                """
                insert into company(company_id,company_name,company_city,country_code,employees,year_founded)
                values(?,?,?,?,?,?)
                """
                ,)
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
        try:
            self.file = file
            self.data = json.load(self.file.getJson())
            self.len = len(self.data) -1 
            print(self.data[self.len]['file_id'])
            self._cursor.execute("insert into files"+
                "(file_id,file_name,file_size,date_added)"+
                "values(?,?,?,?)",(self.data[self.len]['file_id'],self.data[self.len]['file_name'],self.data[self.len]['file_size'],self.data[self.len]['date_added']))
            self._cursor.execute("commit;")
            return True
        except Exception as e:
            print(e)
            return False
        
    def fetchAllFiles(self):
        return self._cursor.execute("select *from files").fetchall()


    def fetchUser(self,user_id):
        return self._cursor.execute("select *from user where user_id = ?",(user_id,))
    
    def setPos(self,pos):
        self._pos +=pos
    
    def getPos(self):
        return self._pos

    def saveUser(self,user):
        if user is None:
            return
        self.user = user
        self.user_data = json.load(self.user.getJson())
        self.len = len(self.user_data) -1 
        try:
            self._cursor.execute('''
            insert into user
            (user_id,first_name,last_name,user_name,user_password,phone_number,email_address)
            values(?,?,?,?,?,?,?)
            ''',(self.user_data[self.len]['user_id'],self.user_data[self.len]['first_name'],self.user_data[self.len]['last_name'],
            self.user_data[self.len]['user_name'],self.user_data[self.len]['user_password'],self.user_data[self.len]['phone_number'],self.user_data[self.len]['email_address']))
            self._cursor.execute("commit;")
            return True

        except Exception as e:
            print(e)
            return False

    
    def deleteUser(self,user_id):
        self._cursor.execute("delete from user where user_id =" + user_id)
        self._cursor.execute("commit")

    def closeConnection(self):
        self._cursor.close()
        self._con.close()