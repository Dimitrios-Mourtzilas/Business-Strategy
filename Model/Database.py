from mysql.connector import connect, Error
import json
import csv

class Database:

    def __init__(self, host, port, auth_plugin):
        self.host = host
        self.port = port
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
            print("Failed to connect")

    def fetchCompData(self):
        self.cursor.execute('use business_model')
        self.cursor.execute("""select JSON_OBJECT(
        'comp_name',compName) from company;
        """)
        return self.cursor.fetchall()

    # def addCompany(self,company):
    #     query = """
    #     insert into company(compName,compCity,compCountry,compRevenue,year_founded)
    #     values(company.getName(),company.getCity(),company.getCountry(),company.getRevenue(),company.getYear_founded())
    #     """
    #     self.cursor.execute(query)

    def exportSpreadsheet(self):
        self.header_list = ['Year','Company Name','City','Country','Revenue']
        self.csv_file = open("company.csv","w")
        self.writer = csv.writer(self.csv_file,header=self.header_list)
        self.writer.writerow()

    def fetchEmployee(self):
        self.cursor = self.con.cursor()
        self.cursor.execute("use business_model")
        self.cursor.execute("select count(empId) from employee")
        