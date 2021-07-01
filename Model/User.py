


class User:

    def __init__(self,user_name,password):
        self.name = user_name
        self.password = password

    def getUsername(self):
        return self.name

    def getPassword(self):
        return self.password

    def getUserData(self):

        return dict(
            {
                'user_name':self.getUsername(),
                'user_password':self.getPassword()
            }
        )

