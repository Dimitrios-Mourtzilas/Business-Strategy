# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
import sys

from PyQt5.QtCore import QThread
from PyQt5.QtWidgets import QApplication, QMainWindow
# from src.GUI.MainWindow import *
from src.Algorithm.DecisionTree import DecisionTree
from src.GUI.FIleDialog import FileDialog
from src.GUI.LoginWindow import *
from src.Model.Company import Company
from src.Model.Database import Database
from src.Model.User import *
from src.Model.FinancialReport import *
import pandas as pd



def main():

    app = QApplication(sys.argv)
    loginWindow = Ui_loginWindow()
    loginWindow.setupUi()
    loginWindow.runUi()
    exit(app.exec())




if __name__ == "__main__":
    main()
