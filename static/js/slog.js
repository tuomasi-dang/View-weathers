page_no = 1;
all_page_param = ' 1=1 ';
layui.use(['form', 'layer', 'laydate'], function () {

    $ = layui.jquery;
    var form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate;
    //执行一个laydate实例
    laydate.render({
        elem: '#start' //指定元素
    });

    //执行一个laydate实例
    laydate.render({
        elem: '#end' //指定元素
    });

//启动爬虫
    window.spider = function () {
        let index = layer.load();
        $.ajax({
            url: "/spider/start",
            method: "POST",
            success: function (obj) {
                layer.close(index);
                get_slog_data(page_no)
                layer.msg("运行成功！", {icon: 6})
            },
            error: function (xhr, type, errorThrown) {
            }
        });
    }

//监听提交
    form.on('submit(edit)', function (data) {
        $.ajax({
            url: "/slog/edit",
            data: data.field,
            method: "PUT",
            success: function (obj) {
                if (obj == "200") {
                    layer.closeAll();
                    layer.msg("修改成功！", {icon: 6})
                    get_slog_data(page_no)
                } else {
                    layer.msg("修改失败！", {icon: 5})
                }
            },
            error: function (xhr, type, errorThrown) {

            }
        });
        return false;
    });

    // 爬虫日志编辑
    window.slog_edit = function (title, a, b) {
        w = '520px'
        he = '420px'
        $('#id').val(a);
        $('#log').val(b);
        layer.open({
            type: 1,
            area: [w, he],
            fix: false, //不固定
            maxmin: true,
            shadeClose: true,
            shade: 0.4,
            title: title,
            content: $('#slog-form')
        });
    }
});
get_slog_data(page_no);
max_page = 0;

function get_slog_data(no) {
    page_no = no;
    $.ajax({
        url: "/slog/list",
        data: {"page_size": 10, "page_no": page_no, "param": all_page_param},
        method: "POST",
        success: function (obj) {
            page_data = obj.data;
            page_list = obj.page_list;
            max_page = obj.max_page;
            count = obj.count;
            show_data(page_data, page_no, page_list, count, max_page)
        },
        error: function (xhr, type, errorThrown) {

        }
    })
}

function show_data(page_data, page_no, page_list, count, page) {
    list_data = '';
    for (var i = 0; i < page_data.length; i++) {
        item = page_data[i];
        list_data = list_data + '<tr>' +
            '<td>' + (i + 1) + '</td>' +
            '<td>' + item[1] + '</td>' +
            '<td>' + item[2] + '</td>' +
            '<td class="td-manage">' +
            ' <a title="编辑"  onclick="slog_edit(\'编辑\',' + item[0] + ',\'' + item[1] + '\')" href = "javascript:;" > ' +
            '  <i class="layui-icon">&#xe63c;</i>' +
            '  </a>' +
            '        <a title="删除" onclick="member_del(this,\'' + item[0] + '\')" href="javascript:;">' +
            '  <i class="layui-icon">&#xe640;</i>' +
            '              </a>' +
            '            </td>' +
            '          </tr>'
    }
    if (page_no == 1) {
        page_str = ''
    } else {
        page_str = '<span class="prev" onclick="get_slog_data(' + (page_no - 1) + ')">&lt;&lt;</span>';
    }
    page_str = '<span>共' + page + '页，' + count + '条数据</span>' + page_str
    for (var i = 0; i < page_list.length; i++) {
        item = page_list[i];
        if (item == page_no) {
            page_str = page_str + '<span class="current">' + item + '</span>'
        } else {
            page_str = page_str + '<span class="num" onclick="get_slog_data(' + item + ')">' + item + '</span>'
        }
    }
    if (page_no != max_page) {
        page_str = page_str + ' <span class="next" onclick="get_slog_data(' + (page_no + 1) + ')">&gt;&gt;</span>'
    }
    $("#slog_data").html(list_data);
    $("#page_list").html(page_str);

}


/*删除*/
function member_del(obj, id) {
    layer.confirm('确认要删除吗？', function (index) {
        //发异步删除数据
        $(obj).parents("tr").remove();
        $.ajax({
            url: "/slog/delete",
            data: {"id": id},
            method: "DELETE",
            success: function (obj) {
                layer.msg('已删除!', {icon: 1, time: 1000});
            }
        })

    });
}

/*查询*/
function get_search() {
    param = ' 1=1 ';
    log_s = $("#log_s").val();

    if (log_s != null && log_s != '') {
        param = param + " and log LIKE '%%" + log_s + "%%'";
    }
    all_page_param = param;
    get_slog_data(page_no)
}

