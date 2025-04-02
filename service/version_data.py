from utils import dbUtil
import datetime


# 系统版本展示业务
def get_sys_version():
    db = dbUtil()
    sql = "select * from sys_version order by  id"
    data = []
    res = db.query(sql)
    for a, b, c in res:
        item = [a, b, c]
        data.append(item)
    return data


# 系统版本新增业务
def add_sys_version(name, version):
    db = dbUtil()
    t = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    sql = "insert into sys_version VALUES (NULL, '" + name + "', '" + version + "')"
    db.query(sql)
    db.close()
    return "200"


# 获取系统版本分页数据
def get_sys_version_list(page_size, page_no, param):
    db = dbUtil()
    param = param.replace("\\", "")
    count_sql = "select count(*) from sys_version where " + param
    count_res = db.query(count_sql)[0][0]
    start = page_size * (page_no - 1)
    start = 0 if start < 0 else start
    sql = "select * from  sys_version where" + param + "order by id desc limit " + str(start) + "," + str(
        page_size)
    res = db.query(sql)
    data_page = []
    if count_res % page_size == 0:
        max_page = int(count_res / page_size)
    else:
        max_page = int(count_res / page_size) + 1
    if max_page <= 5:
        page_list = [i for i in range(1, max_page + 1, 1)]
    elif page_no + 2 > max_page:
        page_list = [i for i in range(max_page - 5, max_page + 1, 1)]
    elif page_no - 2 < 1:
        page_list = [i for i in range(1, 6, 1)]
    else:
        page_list = [i for i in range(page_no - 2, page_no + 3, 1)]
    for a, b, c in res:
        item = [a, b, c]
        data_page.append(item)
    db.close()
    return data_page, count_res, page_list, max_page


# 修改系统版本信息
def edit_sys_version(id, name, version):
    db = dbUtil()
    sql = "update  `sys_version` set sys_name = '" + name + "',sys_version='" + version + "' where id=" + id
    res = db.query(sql)
    db.close()
    return res


# 删除系统版本信息
def del_sys_version(id):
    db = dbUtil()
    sql = "delete from  `sys_version` where id=" + id
    res = db.query(sql)
    db.close()
    return res
