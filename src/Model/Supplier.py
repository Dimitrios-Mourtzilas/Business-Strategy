

class Supplier:

    def __init__(self):
        pass

    def setSupplierId(self,supplierId):
        self.supplierId = supplierId

    def setSupplierName(self,supplierName):
        self.supplierName = supplierName

    def setSupplierCity(self,supplierCity):
        self.supplierCity = supplierCity

    def setCountryCode(self,country_code):
        self.country_code = country_code

    def getSupplierId(self):
        return self.supplierId

    def getSupplierName(self):
        return self.supplierName

    def getSupplierCity(self):
        return self.supplierCity

    def getCountryCode(self):
        return self.country_code


    def getJsonData(self):
        return dict(
            {
                'supplier_id':self.supplierId,
                'supplier_name':self.supplierName,
                'supplier_city':self.supplierCity,
                'country_code':self.country_code
            }
        )

