# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
import sys

from PyQt5.QtCore import QThread
from PyQt5.QtWidgets import QApplication,QMainWindow

from src.GUI.FIleDialog import FileDialog
from src.GUI.LoginWindow import *
from src.Model.Database import Database
from src.Model.User import *
from src.Model.FinancialReport import *
import pandas as pd
def main():

    mainFile = FileDialog()
    mainFile.setDialog()

    #excel_file = pd.read_excel("../company.xlsx")
    #print(excel_file)
    #financialReport = FinancialReport(excel_file)
    #loginWindow = QMainWindow()
    #loginUi = Ui_loginWindow()
    #loginUi.setupUi(loginWindow)
    #loginWindow.show()
    #exit(app.exec())


if __name__ == "__main__":
    main()
