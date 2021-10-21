

class Commodity:

    def __init__(self):
        pass

    def setCommodityId(self,com_id=0):
        self.com_id = com_id
    
    def setCommodityDesc(self,com_desc=""):
        self.com_desc = com_desc
    
    def setCommodityQnt(self,com_qnt=0):
        try:
            if com_qnt <0:
                raise Exception("Negative number given")
            self.com_qnt = com_qnt
        except Exception as e:
            print(e)
            return
        
    def getCommodityId(self):
        return self.com_id
    
    def getCommodityDesc(self):
        return self.com_desc
    
    def getCommodityQnt(self):
        return self.com_qnt
    
    def getToJson():
        return dict({
            'com_id':self.getCommodityId(),
            'com_desc':self.getCommodityDesc(),
            'com_qnt':self.getCommodityQnt()
        })
    
    