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


//监听提交
    form.on('submit(edit)', function (data) {
        let id = data.field.id;
        if (id != undefined && id > 0) {
            $.ajax({
                url: "/user/edit",
                data: data.field,
                method: "PUT",
                success: function (obj) {
                    if (obj == "200") {
                        layer.closeAll();
                        layer.msg("修改成功！", {icon: 6})
                        get_user_data(page_no)
                    } else {
                        layer.msg("修改失败，账号不能重复！", {icon: 5})
                    }
                },
                error: function (xhr, type, errorThrown) {

                }
            });
        } else {
            $.ajax({
                url: "/user/add",
                data: data.field,
                method: "POST",
                success: function (obj) {
                    if (obj == "200") {
                        layer.closeAll();
                        layer.msg("添加成功！", {icon: 6})
                        get_user_data(page_no)
                    } else {
                        layer.msg("添加失败，账号不能重复！", {icon: 5})
                    }
                },
                error: function (xhr, type, errorThrown) {
                }
            });
        }
        return false;
    });

    // 用户编辑
    window.user_edit = function (title, a, b, c, d, e, f, g, h) {
        w = '520px'
        he = '520px'
        $('#id').val(a);
        $('#name').val(b);
        $('#account').val(c);
        $('#account').attr('disabled', 'disabled')
        $('#password').val(d);
        $('#company').val(e);
        $('#phone').val(f);
        $('#mail').val(g);
        $('#type').val(h);
        form.render("select")
        layer.open({
            type: 1,
            area: [w, he],
            fix: false, //不固定
            maxmin: true,
            shadeClose: true,
            shade: 0.4,
            title: title,
            content: $('#user-form')
        });
    }

// 用户添加
    window.user_add = function () {
        w = '520px'
        he = '520px'
        $('#id').val("");
        $('#name').val("");
        $('#account').val("");
        $('#account').removeAttr('disabled');
        $('#password').val("");
        $('#company').val("");
        $('#phone').val("");
        $('#mail').val("");
        $('#type').val(1);
        form.render("select")
        layer.open({
            type: 1,
            area: [w, he],
            fix: false, //不固定
            maxmin: true,
            shadeClose: true,
            shade: 0.4,
            title: "新增",
            content: $('#user-form')
        });

    }

});
get_user_data(page_no);
max_page = 0;

function get_user_data(no) {
    page_no = no;
    $.ajax({
        url: "/user/list",
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
            '<td>' + item[3] + '</td>' +
            '<td>' + item[4] + '</td>' +
            '<td>' + item[5] + '</td>' +
            '<td>' + item[6] + '</td>' +
            '<td>' + (item[7] == 0 ? '管理员' : '普通用户') + '</td>' +
            '<td class="td-manage">' +
            ' <a title="编辑"  onclick="user_edit(\'编辑\',' + item[0] + ',\'' + item[1] + '\',\'' + item[2] + '\',\'' + item[3] + '\',\'' + item[4] + '\',\'' + item[5] + '\',\'' + item[6] + '\',' + item[7] + ')" href="javascript:;">' +
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
        page_str = '<span class="prev" onclick="get_user_data(' + (page_no - 1) + ')">&lt;&lt;</span>';
    }
    page_str = '<span>共' + page + '页，' + count + '条数据</span>' + page_str
    for (var i = 0; i < page_list.length; i++) {
        item = page_list[i];
        if (item == page_no) {
            page_str = page_str + '<span class="current">' + item + '</span>'
        } else {
            page_str = page_str + '<span class="num" onclick="get_user_data(' + item + ')">' + item + '</span>'
        }
    }
    if (page_no != max_page) {
        page_str = page_str + ' <span class="next" onclick="get_user_data(' + (page_no + 1) + ')">&gt;&gt;</span>'
    }
    $("#user_data").html(list_data);
    $("#page_list").html(page_str);

}


/*删除*/
function member_del(obj, id) {
    layer.confirm('确认要删除吗？', function (index) {
        //发异步删除数据
        $(obj).parents("tr").remove();
        $.ajax({
            url: "/user/delete",
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
    name_s = $("#name_s").val();
    account_s = $("#account_s").val();
    company_s = $("#company_s").val();
    phone_s = $("#phone_s").val();
    mail_s = $("#mail_s").val();

    if (name_s != null && name_s != '') {
        param = param + " and name LIKE '%%" + name_s + "%%'";
    }
    if (account_s != null && account_s != '') {
        param = param + " and account LIKE '%%" + account_s + "%%'";
    }
    if (company_s != null && company_s != '') {
        param = param + " and company LIKE '%%" + company_s + "%%'";
    }
    if (phone_s != null && phone_s != '') {
        param = param + " and phone LIKE '%%" + phone_s + "%%'";
    }
    if (mail_s != null && mail_s != '') {
        param = param + " and mail LIKE '%%" + mail_s + "%%'";
    }
    all_page_param = param;
    get_user_data(page_no)
}