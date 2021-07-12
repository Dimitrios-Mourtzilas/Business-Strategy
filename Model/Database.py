from mysql.connector import connect, Error
import json
import csv

class Database:


    def __init__(self,host,port,auth_plugin):
        self.host=host
        self.port=port
        self.auth_plugin=auth_plugin

    def setHost(self,host="localhost"):
        self.host = host

    def setPort(self,port=3306):
        self.port = port

    def setAuthPlugin(self,auth_plugin="mysql_native_password"):
        self.auth_plugin = auth_plugin

    def getHost(self):
        return self.host

    def getPort(self):
        return self.port

    def getAuthPlugin(self):
        return self.auth_plugin

    def establishConnection(self, user):
        if user is None:
            return
        self.user_data = user.getUserData()
        self.user_name = self.user_data['user_name']
        self.user_password = self.user_data['user_password']
        try:
            self.con = connect(host=self.getHost(), user=self.user_name, passwd=self.user_password, port=self.getPort(),
                               auth_plugin=self.getAuthPlugin())
            print("SUcess ")
        except Error as e:
            print(e)


    def fetchAllEmployees(self):
        self.cursor.execute("select *from employee")
        return self.cursor.fetchall()

    def fetchAllCompanies(self):
        self.cursor = self.con.cursor()
        self.cursor.execute("use business_model")
        self.cursor.execute("select *from company")
        return self.cursor.fetchall()


    def fetchCompanyByKey(self,compKey=""):
        self.cursor = self.con.cursor()
        self.cursor.execute("use business_model")
        self.cursor.execute("select *from company inner join financialReport on financialReport.compName = companu.compName where compName like %s", ('%' + 'CodeByte' + '%',))
        return self.cursor.fetchall()





