from mysql.connector import connect, Error
import json


class Database:

    def __init__(self, host,port, auth_plugin):
        self.host = host
        self.port = port
        self.auth_plugin = auth_plugin

    def getHost(self):
        return self.host

    def getPort(self):
        return self.port

    def getAuthPlugin(self):
        return self.auth_plugin

    def establishConnection(self,user):

        if user is None:
            return
        self.user_data = user.getUserData()
        self.user_name = self.user_data['user_name']
        self.user_password = self.user_data['user_password']
        try:
            self.con = connect(host=self.getHost(),user=self.user_name,passwd=self.user_password,port=self.getPort(),auth_plugin=self.getAuthPlugin())
            print("SUcess ")
        except Error as e:
            print("Failed to connect")

    def fetchCompData(self):
        self.cursor = self.con.cursor()
        self.cursor.execute('use business_model')
        self.cursor.execute('select *from company')
        return self.cursor.fetchall()


    # def addCompany(self,company):
    #     query = """
    #     insert into company(compName,compCity,compCountry,compRevenue,year_founded)
    #     values(company.getName(),company.getCity(),company.getCountry(),company.getRevenue(),company.getYear_founded())
    #     """
    #     self.cursor.execute(query)

