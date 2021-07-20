
class User:

    def __init__(self, user_name ,user_password ,**kwargs):
        self.user_name = user_name
        self.user_password = user_password
        self.kwargs = kwargs

    def setUserName(self,user_name):
        self.user_name = user_name

    def setUserPassword(self,user_password):
        self.user_password = user_password

    def getUserName(self):
        return self.user_name

    def getUserPassword(self):
        return self.user_password

    def getToJson(self):
        return dict(
            {
                'userName': self.getUserName(),
                'userPassword': self.getUserPassword()
            }
        )
