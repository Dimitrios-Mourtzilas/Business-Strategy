# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
import sys

from PyQt5.QtCore import QThread
from PyQt5.QtWidgets import QApplication, QMainWindow
<<<<<<< HEAD
from src.GUI.MainWindow import *
from src.Algorithm.DecisionTree import DecisionTree
||||||| c9902fa

=======
from src.Algorithm.DecisionTree import DecisionTree

>>>>>>> 04a797b66ad0d914163c4df4a82c2366dd0e408d
from src.GUI.FIleDialog import FileDialog
from src.GUI.LoginWindow import *
from src.Model.Database import Database
from src.Model.User import *
from src.GUI.MainWindow import *
from src.Model.FinancialReport import *
import pandas as pd


def main():
<<<<<<< HEAD

    window = QMainWindow()
    main_window = MainWindow()
    main_window.setupUi(window)

||||||| c9902fa
    app = QApplication(sys.argv)
    window = MainWindow()
    window.setupUi()
    window.runUi()
    exit(app.exec())
=======

    file = open("company.csv", "r+")
    dtr = DecisionTree(file)
    dtr.trainData()
    # app = QApplication(sys.argv)
    # mainWindow = MainWindow()
    # mainWindow.setupUi()
    # mainWindow.runUi()
    # exit(app.exec())
>>>>>>> 04a797b66ad0d914163c4df4a82c2366dd0e408d


if __name__ == "__main__":
    main()
