from mysql.connector import connect, Error


class Database:

    def __init__(self, **kwargs):

        if "user_name" in kwargs and "user_password" in kwargs:
            self.user_name = kwargs["user_name"]
            self.user_password = kwargs["user_password"]
        else:
            return


    _con = None


    def establishConnection(self):
        self._con = connect(host="localhost",user=self.user_name,passwd=self.user_password,port=3306,auth_plugin="mysql_native_password")
        return self._con

    def fetchAllEmployees(self):
        self.cursor.execute("select *from employee")
        return self.cursor.fetchall()

    def fetchAllCompanies(self):
        self.cursor.execute("use business_model")
        self.cursor.execute("select *from company")
        return self.cursor.fetchall()

    def fetchCompanyByKey(self, compKey=""):
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

    def saveCompany(self, company):
        if company is None:
            return
        self.company = company
        for values in self.company.getJsonData():
            self.cursor.execute(
                """
                insert into company(compName,compCity,compCountry,year_founded)
                values(%s,%s,%s,%s)
                """
                , (values['compName'], values['compCity'], values['compCountry'], values['year_founded']))
        self.con.commit()


