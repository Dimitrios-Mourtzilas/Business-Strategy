# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.

from Model.Database import *
from Model.Company import *

from Model.User import *
from Model.Database import *
def main():

    user_name = input("Give user_name")
    user_password = input("Give password")
    user = User(user_name, user_password)
    database = Database("localhost",3306,"mysql_native_password")
    database.establishConnection(user)

if __name__ == "__main__":
    main()
