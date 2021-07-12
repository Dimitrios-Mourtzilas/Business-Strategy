
import csv

from Model.Database import *
class Company:

    def __init__(self):
        pass


    def getToJson(self,database):
        data_list = database.fetchCompanyByKey("CodeByte")
        return data_list[0]

    def exportSpreadsheet(self):
        self.csv_file = open("company.csv","w")
        self.csv_wrtier = csv.writer(self.csv_file)




