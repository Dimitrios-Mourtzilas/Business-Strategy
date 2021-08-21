from mysql.connector import connect, Error


class Database:

    _con = None
    _cursor = None
    def __init__(self, **kwargs):

        if "user_name" in kwargs and "user_password" in kwargs:
            self.user_name = kwargs["user_name"]
            self.user_password = kwargs["user_password"]
        else:
            return



    def establishConnection(self):
        self._con = connect(host="localhost",user=self.user_name,passwd=self.user_password,port=3306,auth_plugin="mysql_native_password")
        self._cursor = self._con.cursor()
        self._cursor.execute("use business_model")
        return self._con

    def fetchAllEmployees(self):
        self._cursor.execute("select *from employee")
        return self._cursor.fetchall()

    def fetchAllCompanies(self):
        self._cursor.execute("select *from company")
        return self._cursor.fetchall()

    def fetchCompanyByKey(self, compKey=""):
        self._cursor.execute(
            "select *from company inner join financialReport on financialReport.compName = companu.compName where compName like %s",
            ('%' + compKey + '%',))
        return self._cursor.fetchall()

    def saveEmployee(self, employee):
        if employee is None:
            return
        self.employee = employee
        for values in self.employee.getEmpData():
            self._cursor.execute("""
            insert into employee(empId,empName,empSurname,empAge,empSalary,empPhone)
            values(%d,%s,%s,%d,%f,%s)""", (values['empId']), values['empName'], values['empSurname'], values['empAge'],
                                values['empSalary'], values('empPhone'))
        self._con.commit()

    def saveCompany(self, company):
        if company is None:
            return
        self.company = company
        for values in self.company.getJsonData():
            self._cursor.execute(
                """
                insert into company(compName,compCity,compCountry,year_founded)
                values(%s,%s,%s,%s)
                """
                , (values['compName'], values['compCity'], values['compCountry'], values['year_founded']))
        self._con.commit()


    def saveFinancialReport(self,financialReport):
        if financialReport is None:
            return
        else:
            self.financialReport = financialReport
            for values in self.financialReport.getToJson():
                self._cursor.execute(

                """
                insert into financialReport(compRevenue,time_period,productSales,fixed_costs,year)
                values(%f,%s,%f,%f,%s)
                """
                ,values['comp_revenue'],values['time_period'],values['product_sales'],values['fixed_costs'],values['year'])
            self._con.commit()


