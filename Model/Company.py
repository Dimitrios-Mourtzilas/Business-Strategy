
import json

class Company:

    def __init__(self):
        pass

    def setData(self,name,city,country,revenue,year_founded):
        self.name = name
        self.city = city
        self.country = country
        self.year_founded = year_founded

    def getName(self):
        return self.name

    def getCity(self):
        return self.city

    def getCountry(self):
        return self.country
    def getRevenue(self):
        return self.revenue
    def getYear_founded(self):
        return self.year_founded

    def getToJson(self):
        return dict(
            {'comp_name':self.getName(),
             'comp_city':self.getCity(),
             'comp_country':self.getCountry(),
             'comp_revenue':self.getRevenue(),
             'year_founded':self.getYear_founded()
             }
        )


s