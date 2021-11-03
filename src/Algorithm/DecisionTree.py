import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import accuracy_score



from src.Model.FinancialReport import *
class DecisionTree:
    _report = None
    _x_array = []
    _y_array = []
    def __init__(self,**kwargs):
        pass

    def setReport(self,report):
        if not isinstance(report,FinancialReport) and not report.__contains__('.xlsx'):
            return
        self._report = report

    def trainData(self):
        self.data = pd.read_excel(self._report)
        for i in range(6,16):
            self._x_array.append(self.data.iloc[:27,i])
            self.y_array.append(self.data.iloc[28,i])
        self.x_train,self.x_test,self.y_train,self.y_test = train_test_split(self._x_array[0],self._y_array[0])
        
