from utils import dbUtil


# 获取爬虫日志分页数据
def get_slog_list(page_size, page_no, param):
    db = dbUtil()
    param = param.replace("\\", "")
    count_sql = "select count(*) from slog where " + param
    count_res = db.query(count_sql)[0][0]
    start = page_size * (page_no - 1)
    start = 0 if start < 0 else start
    sql = "select * from  slog where" + param + "order by create_time desc limit " + str(start) + "," + str(page_size)
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
        item = [a, b, str(c)]
        data_page.append(item)
    db.close()
    return data_page, count_res, page_list, max_page


# 修改爬虫日志信息
def edit_slog(id, log):
    db = dbUtil()
    sql = "update  `slog` set log = '" + log + "' where id=" + id
    res = db.query(sql)
    db.close()
    return res


# 删除爬虫日志信息
def del_slog(id):
    db = dbUtil()
    sql = "delete from  `slog` where id=" + id
    res = db.query(sql)
    db.close()
    return res
