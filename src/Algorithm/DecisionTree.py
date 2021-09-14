
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor

class DecisionTree:


    _report = None
    def __init__(self):
        pass

    def setReport(self,report):

        if report is None:
            return
        self._report = report


    def analyzeData(self):

        self.data = pd.read_excel(self._report.getFile())
        self.d = pd.DataFrame(self.data)
        self.X = np.array(self.d.iloc[: ,1:2]).reshape(-1 ,1)
        self.y = np.array(self.d.iloc[: ,len(self.d.columns ) -1]).reshape(-1 ,1).reshape(-1 ,1)
        print(self.X)
        print(self.X.shape)
        print('\n')
        print(self.y)
        print(self.y.shape)
        dtr = DecisionTreeRegressor()
        x_train ,x_test ,y_train ,y_test= train_test_split(self.X ,self.y ,test_size=.2)
        plt.scatter(x_train ,y_train ,color='blue')
        plt.scatter(x_test ,y_test ,color='red')
        dtr.fit(x_train ,y_train)
        y_pred = dtr.predict(y_test)
        plt.scatter(y_test ,y_pred ,color='green')
        plt.show()
