# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.


from src.GUI.LoginWindow import *

from PyQt5.QtWidgets import QApplication
import sys

from src.GUI.LoginWindow import *
def main():
    
    
    app = QApplication(sys.argv)
    login_window = Ui_loginWindow()
    login_window.setupUi()
    login_window.runUi()
    exit(app.exec_())

if __name__ == "__main__":
    main()
