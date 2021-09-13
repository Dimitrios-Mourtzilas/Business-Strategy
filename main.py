# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
import sys

from PyQt5.QtCore import QThread
from PyQt5.QtWidgets import QApplication, QMainWindow
from src.GUI.MainWindow import *
from src.Algorithm.DecisionTree import DecisionTree
from src.Algorithm.DecisionTree import DecisionTree

from src.GUI.FIleDialog import FileDialog
from src.GUI.LoginWindow import *
from src.Model.Company import Company
from src.Model.Database import Database
from src.Model.User import *
from src.GUI.MainWindow import *
from src.Model.FinancialReport import *
import pandas as pd


def main():
    database = Database()
    database.establishConnection()
    try:
        file = pd.read_csv('company.csv')
        if file is None:
            raise FileNotFoundError('File not found')
        report = FinancialReport(file)
        # database = Database()
        # database.establishConnection()
        # database.saveFinancialReport(report)
        #
        dtr = DecisionTree(report)
        dtr.analyzeData()
    except FileNotFoundError as e:
        print(e)
        exit(1)


if __name__ == "__main__":
    main()
