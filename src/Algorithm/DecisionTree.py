

from sklearn.tree import DecisionTreeRegressor, DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import numpy as np
import pandas as pd
import matplotlib.pyplot  as plt

class DecisionTree:


<<<<<<< HEAD
    def __init__(self,):
        pass
||||||| c9902fa
    def __init__(self,financialReport):
        if financialReport is None:
            return
        else:
            self.col = 0
            self.finance = financialReport
            for value in financialReport.getToJson():
                self.X = pd.DataFrame(self.finance)
                self.col+=1

=======
    def __init__(self,financialReport):
        
        if financialReport is None:
            return
        else:
            self.report = financialReport
    def trainData(self):
        if self.report is None:
            return
        else:
            self.data = pd.read_csv(self.report)
            self.X = np.array(self.data.iloc[:,1:]).reshape(-1,1)
            self.y = np.array(self.data.loc['Total worth']).reshape(-1,1)
            self.x_train,self.x_test,self.y_train,self.y_test = train_test_split(self.X,self.y)
            self.dtr = DecisionTree()
            self.dtr.fit(self.x_train,self.y_train)
            self.y_pred = self.dtr.predict(self.y_test)
            

            
>>>>>>> 04a797b66ad0d914163c4df4a82c2366dd0e408d

<<<<<<< HEAD
    def analyzeData(self):

        self.data = pd.read_csv('../company.csv')
        self.d = pd.DataFrame(self.data)
        self.X = np.array(self.d.iloc[:,1:2]).reshape(-1,1)
        self.y = np.array(self.d.iloc[:,len(self.d.columns)-1]).reshape(-1,1).reshape(-1,1)
        print(self.X)
        print(self.X.shape)
        print('\n')
        print(self.y)
        print(self.y.shape)
        dtr = DecisionTreeRegressor()
        x_train,x_test,y_train,y_test= train_test_split(self.X,self.y,test_size=.2)
        plt.scatter(x_train,y_train,color='blue')
        plt.scatter(x_test,y_test,color='red')
        dtr.fit(x_train,y_train)
        y_pred = dtr.predict(y_test)
        plt.scatter(y_test,y_pred,color='green')
        plt.show()

||||||| c9902fa
    def analyzeData(self):
        self.dtr = DecisionTreeRegressor()
=======
>>>>>>> 04a797b66ad0d914163c4df4a82c2366dd0e408d



