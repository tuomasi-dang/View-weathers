page_no = 1;
all_page_param = ' 1=1 ';
layui.use(['form', 'layer', 'laydate'], function () {

    $ = layui.jquery;
    var form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate;
    //执行一个laydate实例


//监听提交
    form.on('submit(edit)', function (data) {
        console.log(JSON.stringify(data.field));
        $.ajax({
            url: "/weather/edit",
            data: data.field,
            method: "POST",
            success: function (obj) {
                layer.closeAll();
                layer.msg("修改成功！", {icon: 6})
                get_new_data(page_no)
            },
            error: function (xhr, type, errorThrown) {

            }
        });

        return false;
    });

});
get_new_data(page_no);
max_page = 0;

function get_new_data(no) {
    page_no = no;
    $.ajax({
        url: "/weather/list",
        data: {"page_size": 10, "page_no": page_no, "param": all_page_param},
        method: "POST",
        success: function (obj) {
            page_data = obj.data;
            page_list = obj.page_list;
            max_page = obj.max_page;
            show_data(page_data, page_no, page_list)
        },
        error: function (xhr, type, errorThrown) {

        }
    })
}

function show_data(page_data, page_no, page_list) {
    list_data = '';
    for (var i = 0; i < page_data.length; i++) {
        item = page_data[i];
        list_data = list_data + '<tr>' +
            '<td>' + (i + 1) + '</td>' +
            '<td>' + item[2] + '</td>' +
            '<td>' + item[3] + " " + item[4] + '</td>' +
            '<td>' + item[5] + '</td>' +
            '<td>' + item[6] + '</td>' +
            '<td>' + item[7] + '</td>' +
            '<td>' + item[8] + '</td>' +
            '<td>' + item[9] + '</td>' +
            '<td>' + item[10] + '</td>' +
            '<td>' + item[11] + '</td>' +
            '<td class="td-manage">' +
            ' <a title="编辑"  onclick="x_weather_edit(\'编辑\',' + item[0] + ',\'' + item[1] + '\',\'' + item[2] + '\',\'' + item[3] + '\',\'' + item[4] + '\',' + item[5] + ',\'' + item[6] + '\',' + item[7] + ',' + item[8] + ',' + item[9] + ',\'' + item[10] + '\',' + item[11] + ')" href="javascript:;">' +
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
        page_str = '<span class="prev" onclick="get_new_data(' + (page_no - 1) + ')">&lt;&lt;</span>';
    }
    for (var i = 0; i < page_list.length; i++) {
        item = page_list[i];
        if (item == page_no) {
            page_str = page_str + '<span class="current">' + item + '</span>'
        } else {
            page_str = page_str + '<span class="num" onclick="get_new_data(' + item + ')">' + item + '</span>'
        }
    }
    if (page_no != max_page) {
        page_str = page_str + ' <span class="next" onclick="get_new_data(' + (page_no + 1) + ')">&gt;&gt;</span>'
    }

    $("#weather_data").html(list_data);
    $("#page_list").html(page_str);

}


function x_weather_edit(title, a, b, c, d, e, f, g, h, i, j, k, l) {
    w = 600;
    he = 550;
    $('#id').val(a);
    $('#city_name').val(c);
    $('#record_date').val(d);
    $('#record_time').val(e);
    $('#temp').val(f);
    $('#wd').val(g);
    $('#ws').val(h);
    $('#wse').val(i);
    $('#sd').val(j);
    $('#weather').val(k);
    $('#aqi').val(l);
    layer.open({
        type: 1,
        area: [w + 'px', he + 'px'],
        fix: false, //不固定
        maxmin: true,
        shadeClose: true,
        shade: 0.4,
        title: title,
        content: $('#weather-edit')
    });
}

/*删除*/
function member_del(obj, id) {
    layer.confirm('确认要删除吗？', function (index) {
            $(obj).parents("tr").remove();
            //发异步删除数据
            $.ajax({
                url: " /weather/del",
                data: {"id": id},
                method: "PUT",
                success: function (obj) {
                    layer.msg('已删除!' + id, {icon: 1, time: 1000});
                }
            });
        }
    )
    ;
}

/*查询*/
function get_search() {
    param = ' 1=1 ';
    cityName = $("#cityName").val();
    if (cityName != null && cityName != '') {
        param = param + " and cityname LIKE '%%" + cityName + "%%'";
    }
    all_page_param = param;
    get_new_data(page_no)
}