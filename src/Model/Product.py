


class Product:

    def __init__(self):
        pass

    def setProductId(self,pro_id):
        self.pro_id = pro_id

    def setProductDesc(self,product_desc):
        self.product_desc = product_desc

    def negativePrice(self,price):
        return price < 0

    def setProductPrice(self,price):
        if self.negativePrice(price):
            return
        self.price= price

    def setProductSales(self,sales):
        if not float(sales):
            return
        self.sales = sales

    def getJsonData(self):
        return dict({
            'product_id':self.pro_id,
            'product_desc':self.product_desc,
            'product_price':self.price,
            'product_sales':self.sales
        })