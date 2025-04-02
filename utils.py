import time
import pymysql


class dbUtil():
    def __init__(self):
        conn, cursor = self.get_conn()
        self.conn = conn
        self.cursor = cursor

    def get_time(self):
        time_str = time.strftime("%Y{}%m{}%d{} %X")
        return time_str.format("年", "月", "日")

    def get_conn(self):
        # 建立连接
        conn = pymysql.connect(host="127.0.0.1", port=3306, user="root", password="123456", db="weathers",
                               charset="utf8")
        # c创建游标A
        cursor = conn.cursor()
        return conn, cursor

    def close_commit(self):
        self.conn.commit()
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.close()

    def close(self):
        self.conn.commit()
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.close()

    def query(self, sql, *args):
        self.cursor.execute(sql, args)
        res = self.cursor.fetchall()
        return res

    def query_noargs(self, sql):
        self.cursor.execute(sql)
        res = self.cursor.fetchall()
        return res
