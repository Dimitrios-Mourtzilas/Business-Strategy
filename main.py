# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
import sys

from src.GUI.LoginWindow import *
from PyQt5.QtWidgets import QMainWindow, QApplication


def main():

    app = QApplication(sys.argv)
    loginWindow = Ui_loginWindow()
    loginWindow.setupUi()
    loginWindow.runUi()
    exit(app.exec())



if __name__ == "__main__":
    main()
