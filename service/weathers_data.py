from utils import dbUtil


# 获取天气分页数据
def get_weathers_list(page_size, page_no, param):
    db = dbUtil()
    param = param.replace("\\", "")
    count_sql = "select count(*) from weather where " + param
    count_res = db.query_noargs(count_sql)[0][0]
    start = page_size * (page_no - 1)
    start = 0 if start < 0 else start
    sql = "select * from weather where " + param + " order by id desc limit " + str(start) + "," + str(page_size)
    res = db.query_noargs(sql)
    data_page = []
    page_list = []
    max_page = 0
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
    for a, b, c, d, e, f, g, h, i, j, k, l, m, n in res:
        item = [a, b, c, d, e, f, g, h, i, j, k, l]
        data_page.append(item)
    db.close_commit()
    return data_page, count_res, page_list, max_page


# 修改天气情况
def edit_weathers(id, temp, wd, ws, wse, sd, weather):
    db = dbUtil()
    sql = "update weather set temp=" + temp + ",wd='" + wd + "',ws=" + ws + ",wse=" + wse + ",sd=" + sd + ",weather='" + weather + "' where id ='" + id + "'"
    res = db.query_noargs(sql)
    db.close_commit()
    return res


# 删除天气情况
def del_weathers(id):
    db = dbUtil()
    sql = "delete from weather where id =" + id,
    res = db.query_noargs(sql)
    db.close_commit()
    return res
