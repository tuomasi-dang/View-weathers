from flask import Flask as _Flask, flash
from flask import request, session
from flask import render_template
from flask.json import JSONEncoder as _JSONEncoder, jsonify
import decimal

from flask_apscheduler import APScheduler

import service.users_data as user_service
import service.weathers_data as weathers_data
import service.view_data as view_data
import service.version_data as version_data
import service.slog_data as slog_data
from spider.GetWeather import online


class JSONEncoder(_JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return float(o)
        super(_JSONEncoder, self).default(o)


class Flask(_Flask):
    json_encoder = JSONEncoder


import os

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = os.urandom(24)


# -------------前台可视化大数据分析相关服务接口start-----------------
# 系统默认路径前台跳转
@app.route('/')
def main_page():
    return render_template("main.html")


# -------------前台可视化大数据分析相关服务接口end-----------------

# -------------后台管理模块相关服务接口start-----------------
# 登录
@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        account = request.form.get('account')
        password = request.form.get('password')
        if not all([account, password]):
            flash('参数不完整')
            return "300"
        res = user_service.get_user(account, password)
        if res and res[0][0] > 0:
            session['is_login'] = True
            session['role'] = res[0][1]
            return "200"
        else:
            return "300"


# 登录页面跳转
@app.route('/admin')
def admin():
    if session.get("is_login"):
        if session.get('role') == 0:
            return render_template('index.html')
        else:
            return render_template('index1.html')
    else:
        return render_template('login.html')


@app.route('/logout')
def logout():
    try:
        session.pop("is_login")
        return render_template('login.html')
    except Exception:
        return render_template('login.html')


# 后台首页面跳转
@app.route('/html/welcome')
def welcome():
    return render_template('html/welcome.html')


# 后台注册跳转
@app.route('/html/reg')
def html_reg():
    return render_template('reg.html')


# -----------------用户管理模块START-----------------

# 用户管理页面
@app.route('/html/user')
def user_manager():
    return render_template('html/user.html')


# 获取用户数据分页
@app.route('/user/list', methods=["POST"])
def user_list():
    get_data = request.form.to_dict()
    page_size = get_data.get('page_size')
    page_no = get_data.get('page_no')
    param = get_data.get('param')
    data, count, page_list, max_page = user_service.get_user_list(int(page_size), int(page_no), param)
    return jsonify({"data": data, "count": count, "page_no": page_no, "page_list": page_list, "max_page": max_page})


# 注册用户数据
@app.route('/user/reg', methods=["POST"])
def user_reg():
    get_data = request.form.to_dict()
    name = str(get_data.get('username'))
    account = str(get_data.get('account'))
    password = str(get_data.get('password'))
    company = "平台注册"
    phone = " "
    mail = " "
    type = 1
    return user_service.add_user(name, account, password, company, phone, mail, type)


# 添加用户数据
@app.route('/user/add', methods=["POST"])
def user_add():
    get_data = request.form.to_dict()
    name = get_data.get('name')
    account = get_data.get('account')
    password = get_data.get('password')
    company = get_data.get('company')
    phone = get_data.get('phone')
    mail = get_data.get('mail')
    type = get_data.get('type')
    return user_service.add_user(name, account, password, company, phone, mail, type)


# 修改用户数据
@app.route('/user/edit', methods=["PUT"])
def user_edit():
    get_data = request.form.to_dict()
    id = get_data.get('id')
    name = get_data.get('name')
    password = get_data.get('password')
    company = get_data.get('company')
    phone = get_data.get('phone')
    mail = get_data.get('mail')
    type = get_data.get('type')
    user_service.edit_user(id, name, password, company, phone, mail, type)
    return '200'


# 删除用户数据
@app.route('/user/delete', methods=["DELETE"])
def user_delete():
    get_data = request.form.to_dict()
    id = get_data.get('id')
    user_service.del_user(id)
    return '200'


# -----------------用户管理模块END-----------------

# -----------------系统版本管理模块START-----------------

# 系统版本管理页面
@app.route('/html/version')
def version_manager():
    return render_template('html/version.html')


# 获取系统版本
@app.route('/version/show', methods=["POST"])
def version_show():
    res = version_data.get_sys_version()
    return jsonify({"data": res})


# 获取系统版本数据分页
@app.route('/version/list', methods=["POST"])
def version_list():
    get_data = request.form.to_dict()
    page_size = get_data.get('page_size')
    page_no = get_data.get('page_no')
    param = get_data.get('param')
    data, count, page_list, max_page = version_data.get_sys_version_list(int(page_size), int(page_no), param)
    return jsonify({"data": data, "count": count, "page_no": page_no, "page_list": page_list, "max_page": max_page})


# 新增系统版本数据
@app.route('/version/add', methods=["POST"])
def sys_version_add():
    get_data = request.form.to_dict()
    name = get_data.get('name')
    version = get_data.get('version')
    return version_data.add_sys_version(name, version)


# 修改系统版本数据
@app.route('/version/edit', methods=["PUT"])
def version_edit():
    get_data = request.form.to_dict()
    id = get_data.get('id')
    name = get_data.get('name')
    version = get_data.get('version')
    version_data.edit_sys_version(id, name, version)
    return '200'


# 删除系统版本数据
@app.route('/version/delete', methods=["DELETE"])
def version_delete():
    get_data = request.form.to_dict()
    id = get_data.get('id')
    version_data.del_sys_version(id)
    return '200'


# -----------------系统版本管理模块END-----------------

# -------------前台天气大数据页面相关服务接口start-----------------

# 城市天气数量统计
@app.route('/main/total')
def get_total_data():
    return view_data.get_weathers_total_data()


# 城市空气SQL数量统计
@app.route('/main/aqi')
def get_AQI_data():
    return view_data.get_AQI_total_data()


# 城市风力分布统计
@app.route('/main/ws')
def get_ws_data():
    return view_data.get_ws_total_data()


# 城市风向分布统计
@app.route('/main/wd')
def get_wd_data():
    return view_data.get_wd_total_data()


# 广州实时气温以及风俗变化
@app.route('/main/bgt')
def get_bg_data():
    return view_data.get_bg_total_data()


# 获取轮播数据
@app.route('/main/qgsk')
def get_qgsk_data():
    return view_data.get_qg_total_data()


# -------------前台天气大数据页面相关服务接口end-----------------

# -------------天气数据管理相关服务接口Start-----------------
# 天气数据管理页面
@app.route('/html/weather')
def new():
    return render_template('html/weathers.html')
@app.route('/html/tuijian',methods=["GET"])
def newTUIJAN():
    return render_template('html/tuijian.html')

# 获取天气数据分页
@app.route('/weather/list', methods=["POST"])
def weathers_list():
    get_data = request.form.to_dict()
    page_size = get_data.get('page_size')
    page_no = get_data.get('page_no')
    param = get_data.get('param')
    data, count, page_list, max_page = weathers_data.get_weathers_list(int(page_size), int(page_no), param)
    return jsonify({"data": data, "count": count, "page_no": page_no, "page_list": page_list, "max_page": max_page})


# 修改天气数据
@app.route('/weather/edit', methods=["POST"])
def old_edit():
    get_data = request.form.to_dict()
    id = get_data.get('id')
    temp = get_data.get('temp')
    wd = get_data.get('wd')
    ws = get_data.get('ws')
    wse = get_data.get('wse')
    sd = get_data.get('sd')
    weather = get_data.get('weather')
    weathers_data.edit_weathers(id, temp, wd, ws, wse, sd, weather)
    return '200'


# 修改天气数据
@app.route('/weather/del', methods=["PUT"])
def old_del():
    get_data = request.form.to_dict()
    id = get_data.get('id')
    weathers_data.del_weathers(id)
    return '200'


# -------------天气数据管理相关服务接口end-----------------


from concurrent.futures import ThreadPoolExecutor

# ----------------------爬虫/爬虫日志模块-开始----------------------
from concurrent.futures import ThreadPoolExecutor


# 爬虫日志页面
@app.route('/html/slog')
def slog_manager():
    return render_template('html/slog.html')


# 获取爬虫日志数据分页
@app.route('/slog/list', methods=["POST"])
def slog_list():
    get_data = request.form.to_dict()
    page_size = get_data.get('page_size')
    page_no = get_data.get('page_no')
    param = get_data.get('param')
    data, count, page_list, max_page = slog_data.get_slog_list(int(page_size), int(page_no), param)
    return jsonify({"data": data, "count": count, "page_no": page_no, "page_list": page_list, "max_page": max_page})


# 修改爬虫日志数据
@app.route('/slog/edit', methods=["PUT"])
def slog_edit():
    get_data = request.form.to_dict()
    id = get_data.get('id')
    log = get_data.get('log')
    slog_data.edit_slog(id, log)
    return '200'


# 删除爬虫日志数据
@app.route('/slog/delete', methods=["DELETE"])
def slog_delete():
    get_data = request.form.to_dict()
    id = get_data.get('id')
    slog_data.del_slog(id)
    return '200'


# 后台调用爬虫
@app.route('/spider/start', methods=["POST"])
def run_spider():
    executor = ThreadPoolExecutor(2)
    executor.submit(online())
    return '200'


# 爬虫自动运行
def job_function():
    print("爬虫任务执行开始！")
    executor = ThreadPoolExecutor(2)
    executor.submit(online())


def task():
    scheduler = APScheduler()
    scheduler.init_app(app)
    # 定时任务，每隔10s执行1次
    scheduler.add_job(func=job_function, trigger='interval', seconds=1800, id='my_cloud_spider_id')
    scheduler.start()


# 写在main里面，IIS不会运行
task()
# ----------------------爬虫/爬虫日志模块-结束----------------------
if __name__ == '__main__':
    # 端口号设置
    app.run(host="127.0.0.1", port=5000)
