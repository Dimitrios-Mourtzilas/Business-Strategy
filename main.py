# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
import sys

<<<<<<< HEAD
from PyQt5.QtCore import QThread
from PyQt5.QtWidgets import QApplication, QMainWindow
from src.Algorithm.DecisionTree import DecisionTree
from src.GUI.FIleDialog import FileDialog
from src.GUI.LoginWindow import *
from src.Model.Company import Company
from src.Model.Database import Database
from src.Model.User import *
from src.Model.FinancialReport import *
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt


def main():
    app = QApplication(sys.argv)
    login_window = Ui_loginWindow()
    login_window.setupUi()
    login_window.show()
    exit(app.exec())
=======
# from PyQt5.QtCore import QThread
# from PyQt5.QtWidgets import QApplication, QMainWindow
# from src.Algorithm.DecisionTree import DecisionTree
# from src.GUI.FIleDialog import FileDialog
# from src.GUI.LoginWindow import *
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
import os

from PyQt5.QtWidgets import QApplication
>>>>>>> 38d0af6d7850c4683e94ad97c12ea6437a0a6d8c

from src.GUI.LoginWindow import Ui_loginWindow

<<<<<<< HEAD
=======

def main():

    app = QApplication(sys.argv)
    loginWindow = Ui_loginWindow()
    loginWindow.setupUi()
    loginWindow.runUi()
    exit(app.exec())

>>>>>>> 38d0af6d7850c4683e94ad97c12ea6437a0a6d8c
if __name__ == "__main__":
    main()
