
class Supplier:

    def __init__(self):
        pass

    _commodity = None

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

    def setCommodity(self,commodity):
        try:
            if not isinstance(commodity, Commodity):
                raise Exception('object is not instance of Commodity')
            self._commodity = commodity
        except Exception as e:
            print(e)
                    
    def getSupplierPhoneNumber(self):
        return self.phone
    
    def getSupplierEmail(self):
        return self.email
    
    def getCommodity(self):
        return self._commodity
    
    def setSupplierEmail(self,email=""):
        self.email = email
    
    def setSupplierPhoneNumber(self,phone):
        self.phone = phone

    def getJsonData(self):
        return {
                'supplier_id':self.getSupplierId(),
                'supplier_name':self.getSupplierName(),
                'supplier_city':self.getSupplierCity(),
                'country_code':self.getCountryCode(),
                'supplierPhoneNumber':self.getSupplierPhoneNumber(),
                'supplierEmail':self.getSupplierEmail(),
                'commodity':self.getCommodity()
            }

