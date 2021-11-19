import json
class User:


    _user_name = ""
    _user_password =""
    _user_phone =""
    _email_address= ""

    def __init__(self):
        pass

    def setUserName(self,user_name):
        self._user_name = user_name


    def setUserPassword(self,user_password):
        self._user_password = user_password
    
    def setUserPhoneNumber(self,user_phone):
        self._phone = user_phone
    
    def setUserEmailAddress(self,user_address):
        self._address = user_address
    
    def getJson(self):
        return dict({
            'user_name':self.getUserName(),
            'user_password':self.getUserPassword(),
            'phone_number':self.getUserPhoneNumber(),
            'email_address':self.getUserEmailAddress()
        })
    
    
    def getUserName(self):
        return self._user_name
    def getUserPassword(self):
        return self._user_password
    
    def getUserPhoneNumber(self):
        return self._user_phone
    
    def getUserEmailAddress(self):
        return self._email_address
    
