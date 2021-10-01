import json
class User:


    def __init__(self,**kwargs):
        self.kwargs = kwargs

    def setUserName(self,user_name):
        self.user_name = user_name

    def setUserPassword(self,user_password):
        self.user_password = user_password

    def getJson(self):
        return dict({
            'user_name':self.user_name,
            'user_password':self.user_password
        })
    
    def getUserName(self):
        return self.user_name
    def getUserPassword(self):
        return self.user_password
