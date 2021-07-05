# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
from PyQt5 import QtWidgets

from GUI.loginWindow import Ui_MainWindow
from Model.Database import *
from Model.Company import *

from Model.User import *
from Model.Database import *
import csv
import sys


def findName(array,name):
    if array is not(array):
        return
    for names in array:
        if names.__eq__(name):
            return names
    return None
def main():
    app = QtWidgets.QApplication(sys.argv)
    MainWindow = QtWidgets.QMainWindow()
    ui = Ui_MainWindow()
    ui.setupUi(MainWindow)
    database = Database("localhost",3306,"mysql_native_password")
    user = User("root","root")
    ui.connectToDB()
    MainWindow.show()
    sys.exit(app.exec_())



if __name__ == "__main__":
    main()

