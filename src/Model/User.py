
class User:

    def __init__(self, user_name ,user_password ,**kwargs):
        self.user_name = user_name
        self.user_password = user_password
        self.kwargs = kwargs

    def getUserName(self):
        return self.user_name

    def getUserPassword(self):
        return self.user_password

    def getToJson(self):
        return dict(
            {
                'user_name': self.getUserName(),
                'user_password': self.getUserPassword()
            }
        )
