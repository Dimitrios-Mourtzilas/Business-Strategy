# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.


# from PyQt5.QtWidgets import QApplication, QMainWindow
from src.GUI.LoginWindow import *
# from src.Model.Company import Company
# from src.Model.Database import Database
# from src.Model.User import *
# from src.Model.FinancialReport import *
# import pandas as pd
# import numpy as np
# from sklearn.model_selection import train_test_split
# from sklearn.tree import DecisionTreeRegressor
# from sklearn.metrics import accuracy_score
# import matplotlib.pyplot as plt
import sys
from PyQt5.QtWidgets import QApplication
import sys
from src.Algorithm.DecisionTree import *
def main():
    report = 'company_financial_statement.xlsx'
    dec = DecisionTree()
    dec.setReport(report)
    print(dec.trainData())
    # app = QApplication(sys.argv)
    # loginWindow = LoginWindow()
    # loginWindow.setupUi()
    # loginWindow.runUi()
    # exit(app.exec())

if __name__ == "__main__":
    main()
