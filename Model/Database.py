from mysql.connector import connect, Error
import json
import csv
from Model import *
import Model.User
class Database:

    def __init__(self):
        pass
    def establishConnection(self,user):
        try:
            self.con = connect(host="localhost",user=user.getUserName(),passwd=user.getUserPassword(),port=3306,auth_plugin="mysql_native_password")
            print("SUces")
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

    def fetchCompanyByKey(self, compKey=""):
        self.cursor = self.con.cursor()
        self.cursor.execute("use business_model")
        self.cursor.execute(
            "select *from company inner join financialReport on financialReport.compName = companu.compName where compName like %s",
            ('%' + 'CodeByte' + '%',))
        return self.cursor.fetchall()

    def saveEmployee(self, employee):
        if employee is None:
            return
        self.employee = employee
        for values in self.employee.getEmpData():
            self.cursor.execute("""
            insert into employee(empId,empName,empSurname,empAge,empSalary,empPhone)
            values(%d,%s,%s,%d,%f,%s)""", (values['empId']), values['empName'], values['empSurname'], values['empAge'],
                                values['empSalary'], values('empPhone'))
        self.con.commit()

    # def saveCompany(self, company):
    #     if company is None:
    #         return
    #     self.company = company
    #     for comp_values, emp_values in self.company.getToJson(self), self.employee.getEmpData():
    #         self.cursor.execute("""
    #                 insert into company(compName,compCity,compCountry,year_founded,employees,empId)
    #                 values(%s,%s,%s,%s,%d,%d)
    #                 """, (
    #             comp_values['compName'], comp_values['compSurname'], comp_values['compCity'],
    #             comp_values['compCountry'],
    #             comp_values['year_founded'], comp_values['employees']), (emp_values['empId']))
    #     self.con.commit()
