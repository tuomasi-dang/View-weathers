getVersion()
layui.use('layer', function () {
    var layer = layui.layer
});

function spider() {
    let index = layer.load();
    $.ajax({
        url: "/spider/start",
        method: "POST",
        success: function (obj) {
            layer.closeAll();
            layer.msg("运行成功！", {icon: 6})

        },
        error: function (xhr, type, errorThrown) {
        }
    });
}

function getVersion() {
    $.ajax({
        url: "/version/show",
        method: "POST",
        success: function (obj) {
            data = obj.data
            str = ""
            for (let i = 0; i < data.length; i++) {
                str = str + "       <tr>\n" +
                    "                    <th>" + data[i][1] + "</th>\n" +
                    "                    <td>" + data[i][2] + "</td>\n" +
                    "                </tr>"
            }
            $("#version").html(str);

        }
    });
}