from utils import dbUtil


# 用户登录业务
def get_user(account, password):
    sql = "select id,type,name from user where account= '" + account + "' and password= '" + password + "'"
    db = dbUtil()
    res = db.query(sql)
    db.close()
    return res


# 用户注册业务
def add_user(name, account, password, company, phone, mail, type):
    db = dbUtil()
    # 判断账号是否存在
    exit_sql = "select count(id) from `user` where account='" + account + "'"
    exit_res = db.query(exit_sql)
    if exit_res[0][0] > 0:
        return "300"
    else:
        sql = "insert into `user` VALUES (NULL, '" + str(name) + "', '" + str(account) + "', '" + str(
            password) + "', '" + str(company) + "', '" + str(phone) + "', '" + str(mail) + "', " + str(type) + ", 1)"
        res = db.query(sql)
        db.close()
        return "200"

# 获取用户分页数据
def get_user_list(page_size, page_no, param):
    db = dbUtil()
    param = param.replace("\\", "")
    count_sql = "select count(*) from user where " + param
    count_res = db.query(count_sql)[0][0]
    start = page_size * (page_no - 1)
    start = 0 if start < 0 else start
    sql = "select * from  user where" + param + "order by id desc limit " + str(start) + "," + str(page_size)
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
    for a, b, c, d, e, f, g, h, i in res:
        item = [a, b, c, d, e, f, g, h, i]
        data_page.append(item)
    db.close()
    return data_page, count_res, page_list, max_page


# 修改用户信息
def edit_user(id, name, password, company, phone, mail, type):
    db = dbUtil()
    sql = "update  `user` set name = '" + name + "',password='" + password + "',company='" + company + "',phone='" + phone + "',mail='" + mail + "',type=" + type + " where id=" + id
    res = db.query(sql)
    db.close()
    return res


# 删除用户信息
def del_user(id):
    db = dbUtil()
    sql = "delete from  `user` where id=" + id
    res = db.query(sql)
    db.close()
    return res
