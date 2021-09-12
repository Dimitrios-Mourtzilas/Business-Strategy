


class Employee:

    def __init__(self):
        pass

    def setEmpId(self,emp_id):
        self.emp_id = emp_id

    def setEmpName(self,empName):
        self.empName =empName

    def setEmpSurname(self,empSurname):
        self.empSurname =empSurname

    def setEmpAge(self,empAge):
        if not int(empAge):
            return
        self.empAge=empAge

    def setEmpSalary(self,empSalary):
        if empSalary <0 or not float(empSalary):
            return
        self.empSalary=empSalary


    def setEmpEmail(self,email=""):
        self.email=email

    def setEmpPhone(self,emp_phone):
        if emp_phone.__eq__(""):
            return
        self.empPhone=emp_phone

    def getJson(self):
        return dict(
            {
                'emp_id':self.emp_id,
                'emp_name':self.empName,
                'emp_surname':self.empSurname,
                'emp_age':self.empAge,
                'emp_salary':self.empSalary,
                'emp_email':self.email,
                'emp_phone':self.empPhone
            }
        )
