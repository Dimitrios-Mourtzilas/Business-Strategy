class Company:

    def __init__(self):
        pass

    _product = None
    _employee = None
    _employee_list = []


    def setCompName(self,compName):
        self.compName = compName

    def setCompCity(self,compCity):
        self.compCity = compCity

    def setCompCountry(self,compCountry):
        self.compCountry = compCountry

    def setYearFounded(self,year_founded):
        self.year_founded = year_founded



    def addProduct(self,product):
        if product is None:
            return
        self._product=product

    def setEmployees(self,employee_list):
        self._employee_list.extend(employee_list)
        
    def setEmployee(self,employee):
        self._employee=employee

    def getToJson(self,database):
        data_list = database.fetchCompanyByKey("CodeByte")
        return data_list[0]





