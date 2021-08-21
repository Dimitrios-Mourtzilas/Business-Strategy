

from sklearn.tree import DecisionTreeRegressor, DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import numpy as np
import pandas as pd

class DecisionTree:


    def __init__(self,financialReport):
        if financialReport is None:
            return
        else:
            self.col = 0
            self.finance = financialReport
            for value in financialReport.getToJson():
                self.X = pd.DataFrame(self.finance)
                self.col+=1


    def analyzeData(self):
        self.dtr = DecisionTreeRegressor()



