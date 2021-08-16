from PyQt5.QtWidgets import QDialog, QPushButton, QFileDialog, QVBoxLayout


class FileDialog(QDialog):

    def __init__(self):
        super().__init__()
        self.setLayout(QVBoxLayout())


    def setDialog(self):
        self.ok_button = QPushButton()
        self.ok_button.setText("Open")
        self.ok_button.clicked.connect(self.openDialog)
        self.layout().addWidget(self.ok_button)


    def openDialog(self):
        self.file_dialog = QFileDialog()
        self.file_dialog.show()