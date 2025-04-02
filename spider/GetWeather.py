import json
import requests
import xlwt
import datetime
import os
import time
from utils import dbUtil


class GetWeather:
    def __init__(self):
        self.baseUrl = r"http://d1.weather.com.cn/sk_2d/"
        self.headers = {'Accept': "*/*",
                        'Accept-Encoding': 'gzip, deflate',
                        'Accept-Language': 'keep-alive',
                        'Connection': '',
                        'Cookie': 'f_city=北京|101010100|; Hm_lvt_080dabacb001ad3dc8b9b9049b36d43b=1637305568,1637734650,1639644011,1639710627; Hm_lpvt_080dabacb001ad3dc8b9b9049b36d43b=1639723697'.encode(
                            "utf-8").decode("latin1"),
                        'Host': 'd1.weather.com.cn',
                        'Referer': 'http://www.weather.com.cn/',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36', }
        self.loadList = []
        self.cityList = []  # 格式为：列表里面的子列表都是一个省份的所有城市，子列表里所有元素都是字典，每个字典有两项
        self.cityDict = {}
        self.result = xlwt.Workbook(encoding='utf-8', style_compression=0)
        self.sheet = self.result.add_sheet('result', cell_overwrite_ok=True)
        self.cityRow = 0
        self.totalGet = 0

        current_path = os.path.dirname(__file__)
        with open(current_path + "/CITY.txt", 'r', encoding='UTF-8') as load_f:
            loadList = json.load(load_f)  # 34个省份
            for i in range(0, 4):
                self.cityList.append(loadList[i])
            for i in range(4, 34):
                for j in loadList[i]['cityList']:
                    self.cityList.append(j)
            for i in self.cityList:
                if 'districtList' in i.keys():
                    self.cityDict.setdefault(i['cityName'], i['cityId'] + "01")  # 省
                else:
                    self.cityDict.setdefault(i['provinceName'], i['id'] + "0100")  # 直辖市
        print(len(self.cityDict))

    def __getWeatherInfo__(self):
        db = dbUtil()
        count = 0
        for city, id in self.cityDict.items():
            try:
                self.totalGet = self.totalGet + 1
                self.sheet.write(self.cityRow, 0, city)  # 写当前城市名
                PageUrl = self.baseUrl + id + ".html?_" + str(int(time.time() * 1000))
                response = requests.get(PageUrl, headers=self.headers, allow_redirects=False)
                response.encoding = "utf-8"
                self.htmlResult = response.text
                data = json.loads(self.htmlResult.replace("var dataSK=", ""))
                nameen = data["nameen"]  # 城市拼音
                cityname = data["cityname"]  # 城市名称
                temp = data["temp"]  # 当前温度
                WD = data["WD"]  # 风向
                WS = data["WS"].replace("级", "")  # 风力
                wse = data["wse"].replace("km/h", "")  # 风速
                sd = data["sd"].replace("%", "")  # 湿度
                weather = data["weather"]  # 天气
                record_date = data["date"]  # 时间
                record_time = data["time"]  # 时分
                aqi = data["aqi"]  # 时分
                judge_sql = "select count(id) from `weather` where nameen = '" + nameen + "' and cityname='" + cityname + "' and record_date='" + record_date + "' and record_time='" + record_time + "'";
                sql = "INSERT INTO `weather` VALUES (null, '" + nameen + "', '" + cityname + "', '" + record_date + "', '" + record_time + "', " + str(
                    temp) + ", '" + WD + "', " + WS + ", " + wse + ", " + sd + ", '" + weather + "', " + aqi + ", '" + time.strftime(
                    "%Y-%m-%d %H:%M:%S", time.localtime()) + "',0);"
                i = db.query_noargs(judge_sql)[0][0]
                if int(i) > 0:
                    print("跳过：", judge_sql)
                    continue
                update_sql = "update `weather` set is_old=1 where nameen = '" + nameen + "' and cityname='" + cityname + "'";
                print("插入：", sql)
                count += 1
                db.query_noargs(update_sql)
                db.query_noargs(sql)
            except Exception as e:
                print(e)
                continue
        t = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        sql = "insert into slog VALUES (NULL, \"【爬虫启动】爬取数据全国天气数据运行成功,获取数据：" + str(count) + "条\",\"" + t + "\")"
        db.query_noargs(sql)
        db.close_commit()

    def __main__(self):
        print(datetime.datetime.now())
        self.__getWeatherInfo__()
        print(datetime.datetime.now())


# 后台调用爬虫
def online():
    weather = GetWeather()
    weather.__main__()
    return 200
