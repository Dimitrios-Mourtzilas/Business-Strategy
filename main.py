# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
import sys

from PyQt5.QtWidgets import QApplication

from src.GUI.LoginWindow import *

def main():
    app = QApplication(sys.argv)
    window = LoginWindow()
    window.setGUI()
    window.runGUI()
    exit(app.exec())


if __name__ == "__main__":
    main()

