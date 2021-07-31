

from PyQt5.QtWidgets import QMainWindow, QLabel, QPushButton, QFileDialog, QAction

class MainWindow(QMainWindow):

    def __init__(self):
        super().__init__()


    def setupUi(self):
        self.setWindowTitle("Main Window")
        self.import_button = QPushButton("Import excel file")
        self.import_button.clicked.connect(self.openDialog)
        self.layout().addWidget(self.import_button)

    def runUi(self):
        self.show()

    def dialogWindow(self):
        self.saveFile = QAction("&Save File",self)
        self.saveFile.setShortcut("Ctrl+S")
        self.saveFile.setStatusTip("Save File")
        self.saveFile.triggered.connect(self.openDialog)

    def openDialog(self):
        self.file_dialog = QFileDialog()
        self.file_dialog.show()






