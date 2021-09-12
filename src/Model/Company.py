class Company:

    def __init__(self):
        pass

    _employee = None
    _product = None
    _product_list =[]
    def setCompName(self,compName):
        self.compName = compName

    def setCompCity(self,compCity):
        self.compCity = compCity

    def setProduct(self,product):
        self._product=product

    def setProducts(self,products):
        if not isinstance(products,list):
            return "list excepted"
        else:
            for value in products:
                self._product_list.append(value)

    def getProducts(self):
        return self._product_list

    def setCompCountry(self,compCountry):
        self.compCountry = compCountry

    def setYearFounded(self,year_founded):
        self.year_founded = year_founded

    def getCompName(self):
        return self.compName

    def getCompCity(self):
        return self.compCity

    def getCompCountry(self):
        return self.compCountry

    def getYearFounded(self):
        return self.year_founded

    def getJson(self):
        return dict({
            'compName':self.getCompName(),
            'compCity':self.getCompCity(),
            'compCountry':self.getCompCountry(),
            'year_founded':self.getYearFounded(),
        })

    







