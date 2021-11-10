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
from src.Model.Database import *
from src.Model.User import *
from src.Model.Company import *
from src.Model.Employee import *
def main():

    user = User()
    user.setUserName("root")
    user.setUserPassword("root")
    database =Database()
    if not database.establishConnection(user):
        exit(1)
    employee = Employee()
    employee.setEmpId(2806)
    employee.setEmpName("Dimtirios")
    employee.setEmpSurname("Mourtzilas")
    employee.setEmpSalary(1900)
    employee.setEmpAge(22)
    employee.setEmpEmail("some@gmail.com")
    employee.setEmpPhone("6975123265")
    database.saveEmployee(employee)


if __name__ == "__main__":
    main()
