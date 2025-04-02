from flask import jsonify
from utils import dbUtil

# 获取天气城市数量统计
def get_weathers_total_data():
    db = dbUtil()
    xyt_sql = "SELECT COUNT(*) FROM weather WHERE is_old=0 and weather like '%雨%'"
    qt_sql = "SELECT COUNT(*) FROM weather WHERE is_old=0 and weather like '%晴%'"
    dy_sql = "SELECT COUNT(*) FROM weather WHERE is_old=0 and weather like '%多云%' "
    xt_sql = "SELECT COUNT(*) FROM weather WHERE is_old=0 and weather like '%雪%' "
    wt_sql = "SELECT COUNT(*) FROM weather WHERE is_old=0 and weather like '%雾%' "
    cm_sql = "SELECT COUNT(*) FROM weather WHERE is_old=0 and ( weather like '%霾%' OR weather like '%尘%') "
    xyt = db.query_noargs(xyt_sql)[0][0]
    qt = db.query_noargs(qt_sql)[0][0]
    dy = db.query_noargs(dy_sql)[0][0]
    xt = db.query_noargs(xt_sql)[0][0]
    wt = db.query_noargs(wt_sql)[0][0]
    cm = db.query_noargs(cm_sql)[0][0]
    db.close_commit()
    return jsonify({"xyt": xyt, "qt": qt, "dy": dy, "xt": xt, "wt": wt, "cm": cm})


"""
AQI：
0-50良好
51-100:中等
101-150：偏差，对敏感人群不健康
151-200：差，不健康
201-300：极差，非常不健康
300+：有毒
"""


# 获取城市空气质量统计
def get_AQI_total_data():
    db = dbUtil()
    lh_sql = "SELECT COUNT(id) FROM weather WHERE aqi<=50 AND is_old=0"
    zd_sql = "SELECT COUNT(id) FROM weather WHERE aqi>50 AND aqi<=100 AND is_old=0"
    pc_sql = "SELECT COUNT(id) FROM weather WHERE aqi>100 AND aqi<=150 AND is_old=0"
    c_sql = "SELECT COUNT(id) FROM weather WHERE aqi>150 AND aqi<=200 AND is_old=0"
    jc_sql = "SELECT COUNT(id) FROM weather WHERE aqi>200 AND aqi<=300 AND is_old=0"
    yd_sql = "SELECT COUNT(id) FROM weather WHERE aqi>300 AND is_old=0"
    lh = db.query_noargs(lh_sql)[0][0]
    zd = db.query_noargs(zd_sql)[0][0]
    pc = db.query_noargs(pc_sql)[0][0]
    c = db.query_noargs(c_sql)[0][0]
    jc = db.query_noargs(jc_sql)[0][0]
    yd = db.query_noargs(yd_sql)[0][0]
    db.close_commit()
    return jsonify([{"time": "良好", "value": lh, "name": "空气质量"},
                    {"time": "中等", "value": zd, "name": "空气质量"},
                    {"time": "偏差", "value": pc, "name": "空气质量"},
                    {"time": "较差", "value": c, "name": "空气质量"},
                    {"time": "极差", "value": jc, "name": "空气质量"},
                    {"time": "有毒", "value": yd, "name": "空气质量"}])


# 获取城市风力质量统计
def get_ws_total_data():
    db = dbUtil()
    ws_sql = "SELECT COUNT(id), ws FROM weather WHERE is_old=0 GROUP BY ws"
    ws = db.query_noargs(ws_sql)
    d = []
    for val, lv in ws:
        lv = str(lv) + "级"
        i = {"name": lv, "value": val}
        d.append(i)
    db.close_commit()
    return jsonify(d)


# 获取城市风向统计
def get_wd_total_data():
    db = dbUtil()
    ws_sql = "SELECT COUNT(id), wd FROM weather WHERE is_old=0 GROUP BY wd"
    ws = db.query_noargs(ws_sql)
    d = []
    for val, lv in ws:
        lv = str(lv)
        i = {"name": lv, "value": val}
        d.append(i)
    db.close_commit()
    return jsonify(d)


# 获取城市空气质量统计
def get_bg_total_data():
    db = dbUtil()
    bg_sql = "SELECT record_time,temp, wse FROM weather WHERE cityname='广州' AND  to_days(create_time) = to_days(now());"
    bg = db.query_noargs(bg_sql)
    d = []
    x = []
    for rt, temp, wse in bg:
        it = {"time": rt, "value": temp, "name": "温度"}
        iw = {"time": rt, "value": wse, "name": "风速"}
        d.append(it)
        d.append(iw)
        x.append(rt)
    data = {"d": d, "x": x}
    db.close_commit()
    return jsonify(data)


# 获取轮播数据
def get_qg_total_data():
    db = dbUtil()
    qg_sql = "SELECT cityname,weather ,temp,ws,wd,aqi FROM weather WHERE is_old=0"
    qg = db.query_noargs(qg_sql)
    d = []
    for cityname, weather, temp, ws, wd, aqi in qg:
        it = {"城市": cityname, "天气": weather, "温度": temp, "风级": (str(ws) + '级'), "风向": wd, "空气质量": aqi}
        d.append(it)
    db.close_commit()
    return jsonify(d)
