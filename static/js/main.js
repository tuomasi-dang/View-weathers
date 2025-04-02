//左上时间
timer()
// 中间数字统计
center_num();
//中间空气质量分布统计
center_kqzlfm();
//右下风力分布统计
right_qgws();
//右上全国风向分布图
right_qgfx();
//左上广州气温变化图
left_bgt();
//左下全国实况轮播
left_qgsk();

function timer() {
    const dom = document.querySelector(
        "#timer-title"
    )
    const loadTime = () => {
        dom.innerHTML = dayjs()
            .locale("zh-cn")
            .format("YYYY年MM-DD dddd HH:mm:ss.SSS A")
    }
    loadTime()

    setInterval(loadTime, 1000)
}

function center_num() {
    function format_four_num(num) {
        s = '';
        if (num.toString().length < 4) {
            for (let i = num.toString().length; i < 4; i++) {
                s = s + '0'
            }
        }
        return s + num;
    }

    $.ajax({
        url: "/main/total",
        method: "get",
        success: function (obj) {
            let cm = format_four_num(obj.cm);
            let qt = format_four_num(obj.qt);
            let dy = format_four_num(obj.dy);
            let xt = format_four_num(obj.xt);
            let wt = format_four_num(obj.wt);
            let xyt = format_four_num(obj.xyt);
            cubeflop({
                data: wt,
                id: "wt-main",
                height: 60,
                duration: 300,
                backgroundColor: "rgba(8, 21, 39, 1)",
                color: "rgba(61, 156, 255, 1)",
            });
            cubeflop({
                data: xt,
                id: "xt-main",
                height: 60,
                duration: 300,
                backgroundColor: "rgba(8, 21, 39, 1)",
                color: "rgba(61, 156, 255, 1)",
            });

            cubeflop({
                data: xyt,
                id: "xyt-main",
                height: 60,
                duration: 300,
                backgroundColor: "rgba(8, 21, 39, 1)",
                color: "rgba(61, 156, 255, 1)",
            });

            cubeflop({
                data: qt,
                id: "qt-main",
                height: 60,
                duration: 300,
                backgroundColor: "rgba(8, 21, 39, 1)",
                color: "rgba(61, 156, 255, 1)",
            });

            cubeflop({
                data: dy,
                id: "dy-main",
                height: 60,
                duration: 300,
                backgroundColor: "rgba(8, 21, 39, 1)",
                color: "rgba(61, 156, 255, 1)",
            });
            cubeflop({
                data: cm,
                id: "cm-main",
                height: 60,
                duration: 300,
                backgroundColor: "rgba(8, 21, 39, 1)",
                color: "rgba(61, 156, 255, 1)",
            });
        },
        error: function (xhr, type, errorThrown) {
        }
    });
}

function center_kqzlfm() {

    $.ajax({
        url: "/main/aqi",
        method: "get",
        success: function (obj) {
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(
                document.getElementById("kqzlfm-table")
            )
            // 指定图表的配置项
            let option = {
                grid: {
                    top: 15,
                    left: 15,
                    right: 15,
                    bottom: 15,
                    containLabel: true,
                },
                title: {
                    text: "",
                    show: false,
                    target: "blank",
                    textStyle: {
                        color: "#fff",
                        fontStyle: "normal",
                        fontWeight: "normal",
                        fontSize: 14,
                        lineHeight: 30,
                        textBorderColor: "",
                        textBorderWidth: 1,
                        textBorderType: "solid",
                        textBorderDashOffset: 1,
                        textShadowColor: "transparent",
                        textShadowBlur: 1,
                        textShadowOffsetX: 1,
                        textShadowOffsetY: 1,
                        overflow: "none",
                    },
                    padding: 1,
                    itemGap: 10,
                    z: 10,
                    left: "auto",
                    top: "auto",
                    right: "auto",
                    bottom: "auto",
                    backgroundColor: "transparent",
                    borderColor: "",
                    borderWidth: "",
                    borderRadius: 1,
                    shadowBlur: 0,
                    shadowColor: "",
                    shadowOffsetX: "",
                    shadowOffsetY: "",
                    subtext: "",
                    sublink: "",
                    subtarget: "blank",
                    subtextStyle: {
                        color: "#ffffff",
                        fontStyle: "normal",
                        fontWeight: "normal",
                        fontSize: 12,
                        lineHeight: 0,
                        textBorderColor: "",
                        textBorderWidth: 0,
                        textBorderType: "solid",
                        textBorderDashOffset: 0,
                        textShadowColor: "transparent",
                        textShadowBlur: 0,
                        textShadowOffsetX: 0,
                        textShadowOffsetY: 0,
                        overflow: "none",
                    },
                },
                legend: {
                    show: false,
                    top: "top",
                    left: "right",
                    orient: "horizontal",
                    itemWidth: 25,
                    itemHeight: 10,
                    itemGap: 10,
                    icon: "circle",
                    textStyle: {color: "#ffffff", fontSize: 12, lineHeight: 14},
                },
                xAxis: {
                    show: true,
                    axisLabel: {
                        show: true,
                        color: "#A9AEB2",
                        fontSize: 12,
                        margin: 20,
                        height: "14px",
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {color: "#181919", type: "solid", width: 1},
                    },
                    axisTick: {
                        show: false,
                        lineStyle: {color: "#181919", type: "solid", width: 1},
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {color: "#181919", type: "dashed", width: 1},
                    },
                    data: [],
                },
                yAxis: {
                    show: true,
                    name: "单位",
                    nameTextStyle: {
                        color: "A3A7A9",
                        fontSize: 12,
                        padding: [0, 40, 0, 0],
                    },
                    axisLabel: {
                        show: true,
                        margin: 8,
                        color: "rgba(194, 194, 194, 1)",
                        fontSize: 12,
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {color: "#181919", type: "solid", width: 1},
                    },
                    axisTick: {
                        show: false,
                        lineStyle: {color: "#181919", type: "solid", width: 1},
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {color: "#181919", type: "dashed", width: 1},
                    },
                },
                color: [
                    {
                        type: "linear",
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {offset: 0, color: "#399efe"},
                            {offset: 0.82, color: "#06f6f0"},
                        ],
                    },
                    "rgba(6,246,240,1)",
                    "rgba(102,200,255,1)",
                ],
                series: [
                    {
                        z: 2,
                        type: "pictorialBar",
                        data: [],
                        symbol: "diamond",
                        symbolOffset: [0, "50%"],
                        useSeriesStyle: false,
                        itemStyle: {normal: {borderWidth: 0}},
                    },
                    {
                        z: 3,
                        type: "pictorialBar",
                        useSeriesStyle: false,
                        symbolPosition: "end",
                        data: [],
                        symbol: "diamond",
                        symbolOffset: [0, "-50%"],
                        itemStyle: {normal: {borderWidth: 0}},
                    },
                ],
            }
            let seriesStyle = {
                showBackground: false,
                backgroundStyle: {color: "#0F2024", opacity: 1},
                itemStyle: {
                    shadowBlur: 0,
                    shadowColor: "#5c1717",
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    borderRadius: 0,
                    borderColor: "#292929",
                    borderWidth: 0,
                    borderType: "dotted",
                },
                barWidth: 24,
                label: {
                    show: true,
                    position: "top",
                    color: "#3D9CFF",
                    fontSize: 12,
                    lineHeight: 16,
                },
                barGap: "50%",
            }

            // 指定图表的数据
            let data = obj

            //数据处理 开始
            let xKey = "time"
            let yKey = "value"
            let sKey = "name"
            let seriesArr = []
            let dataColumn = []
            data.forEach((item) => seriesArr.push(item[sKey]))
            seriesArr = [...new Set(seriesArr)]
            let complexSeries = []
            if (xKey && xKey) {
                data.forEach((item) => dataColumn.push(item[xKey]))
                dataColumn = [...new Set(dataColumn)]

                function calcOffset(index) {
                    const ofe = 70
                    const length = seriesArr.length
                    const startX = -(ofe * (length - 1))
                    const offsetX = startX + ofe * index * 2
                    return offsetX + "%"
                }

                seriesArr.forEach((item, index) => {
                    let arr = []
                    data.forEach((oitem) => {
                        if (oitem[sKey] === item) {
                            arr.push({
                                name: oitem[xKey],
                                value: oitem[yKey],
                            })
                        }
                    })
                    complexSeries.push({
                        name: item,
                        data: arr,
                        type: "bar",
                    })
                    let copyStyleSeries = deepCopy(option.series)
                    copyStyleSeries[0].data = arr
                    copyStyleSeries[1].data = arr

                    copyStyleSeries[0].symbolSize = [
                        seriesStyle.barWidth,
                        seriesStyle.barWidth * 0.5,
                    ]
                    copyStyleSeries[1].symbolSize = [
                        seriesStyle.barWidth,
                        seriesStyle.barWidth * 0.5,
                    ]
                    copyStyleSeries[0].symbolOffset = [calcOffset(index), "50%"]
                    copyStyleSeries[1].symbolOffset = [calcOffset(index), "-50%"]
                    complexSeries.push(...copyStyleSeries)
                })
            }
            let seriesObj = complexSeries.map((item) => {
                if (item.useSeriesStyle != false) {
                    return (item = Object.assign(item, seriesStyle))
                } else {
                    return (item = item)
                }
            })

            option.yAxis.type = "value"
            option.xAxis.type = "category"
            option.xAxis.data = dataColumn
            // 数据处理完
            option.series = seriesObj

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option)
        }
    })
}

function right_qgws() {
    $.ajax({
        url: "/main/ws",
        method: "get",
        success: function (obj) {
            /**
             * 处理数据 | 返回 series xAxis
             * 1.拿到需要的对象
             * 2.给对象添加相应的数据
             * 3.初始化series
             * 4.返回series xAxis
             */
            function handlerData(data) {
                const option = deepCopy({
                    grid: {
                        top: 15,
                        left: 15,
                        right: 15,
                        bottom: 15,
                        containLabel: true,
                    },
                    title: {
                        text: "",
                        show: false,
                        target: "blank",
                        textStyle: {
                            color: "#fff",
                            fontStyle: "normal",
                            fontWeight: "normal",
                            fontSize: 14,
                            lineHeight: 30,
                            textBorderColor: "",
                            textBorderWidth: 1,
                            textBorderType: "solid",
                            textBorderDashOffset: 1,
                            textShadowColor: "transparent",
                            textShadowBlur: 1,
                            textShadowOffsetX: 1,
                            textShadowOffsetY: 1,
                            overflow: "none",
                        },
                        padding: 1,
                        itemGap: 10,
                        z: 10,
                        left: "auto",
                        top: "auto",
                        right: "auto",
                        bottom: "auto",
                        backgroundColor: "transparent",
                        borderColor: "",
                        borderWidth: "",
                        borderRadius: 1,
                        shadowBlur: 0,
                        shadowColor: "",
                        shadowOffsetX: "",
                        shadowOffsetY: "",
                        subtext: "",
                        sublink: "",
                        subtarget: "blank",
                        subtextStyle: {
                            color: "#ffffff",
                            fontStyle: "normal",
                            fontWeight: "normal",
                            fontSize: 12,
                            lineHeight: 0,
                            textBorderColor: "",
                            textBorderWidth: 0,
                            textBorderType: "solid",
                            textBorderDashOffset: 0,
                            textShadowColor: "transparent",
                            textShadowBlur: 0,
                            textShadowOffsetX: 0,
                            textShadowOffsetY: 0,
                            overflow: "none",
                        },
                    },
                    color: [
                        "rgba(114,182,255,1)",
                        "rgba(79,164,255,1)",
                        {
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            type: "linear",
                            global: false,
                            colorStops: [
                                {offset: 0, color: "rgba(61, 156, 255, 0.9)"},
                                {offset: 1, color: "rgba(61, 156, 255, 0)"},
                            ],
                        },
                    ],
                    legend: {
                        show: false,
                        top: "top",
                        left: "center",
                        orient: "horizontal",
                        itemWidth: 8,
                        itemHeight: 8,
                        itemGap: 10,
                        icon: "rect",
                        textStyle: {color: "#ffffff", fontSize: 12, lineHeight: 14},
                    },
                    xAxis: {
                        type: "category",
                        data: [],
                        axisLine: {show: false, lineStyle: {color: "white"}},
                        offset: 20,
                        splitLine: {
                            show: false,
                            lineStyle: {color: "#181919", type: "dashed", width: 1},
                        },
                        axisTick: {
                            show: false,
                            lineStyle: {color: "#181919", type: "solid", width: 1},
                        },
                        axisLabel: {
                            show: true,
                            color: "#ffffff",
                            fontSize: 12,
                            margin: 8,
                        },
                    },
                    yAxis: {
                        show: true,
                        type: "value",
                        axisLabel: {
                            show: true,
                            color: "rgba(241, 248, 255, 0.7)",
                            fontSize: 12,
                            margin: 8,
                        },
                        axisLine: {
                            show: false,
                            lineStyle: {color: "#01FCE3", type: "solid", width: 1},
                        },
                        axisTick: {
                            show: false,
                            lineStyle: {color: "#01FCE3", type: "solid", width: 1},
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                color: "rgba(241, 248, 255, 0.1)",
                                type: "dashed",
                                width: 1,
                            },
                        },
                    },
                })
                const xAxis = deepCopy({
                    type: "category",
                    data: [],
                    axisLine: {show: false, lineStyle: {color: "white"}},
                    offset: 20,
                    splitLine: {
                        show: false,
                        lineStyle: {color: "#181919", type: "dashed", width: 1},
                    },
                    axisTick: {
                        show: false,
                        lineStyle: {color: "#181919", type: "solid", width: 1},
                    },
                    axisLabel: {
                        show: true,
                        color: "#ffffff",
                        fontSize: 12,
                        margin: 8,
                    },
                })
                const seriesStyle = deepCopy({
                    type: "pictorialBar",
                    symbolSize: [40, 10],
                    symbolOffset: [0, -6],
                    symbolPosition: "end",
                    z: 12,
                    label: {
                        show: true,
                        position: "top",
                        fontSize: 22,
                        fontWeight: "bold",
                        color: "rgba(61, 156, 255, 1)",
                    },
                    itemStyle: {
                        shadowBlur: 0,
                        shadowColor: "#5c1717",
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        borderRadius: 0,
                        borderColor: "#292929",
                        borderWidth: 0,
                        borderType: "dotted",
                    },
                    data: [],
                })
                const seriesStyle2 = deepCopy({
                    name: "",
                    type: "pictorialBar",
                    symbolSize: [40, 10],
                    symbolOffset: [0, 7],
                    z: 12,
                    data: [],
                })
                const seriesStyle3 = deepCopy({
                    name: "",
                    type: "pictorialBar",
                    symbolSize:
                        "function (d) {        return d > 0 ? [50, 15] : [0, 0];      }",
                    symbolOffset: [0, 12],
                    z: 10,
                    itemStyle: {
                        color: "transparent",
                        shadowBlur: 0,
                        shadowColor: "transparent",
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        borderRadius: [0, 0, 0, 0],
                        borderColor: "#2EA9E5",
                        borderWidth: 1,
                        borderType: "solid",
                    },
                    data: [],
                })
                const seriesStyle4 = deepCopy({
                    name: "",
                    type: "pictorialBar",
                    symbolSize: [70, 20],
                    symbolOffset: [0, 18],
                    z: 10,
                    itemStyle: {
                        shadowBlur: 0,
                        shadowColor: "transparent",
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        borderRadius: [0, 0, 0, 0],
                        color: "transparent",
                        borderColor: "#19465D",
                        borderType: "solid",
                        borderWidth: 2,
                    },
                    data: [],
                })
                const seriesStyle5 = deepCopy({
                    type: "bar",
                    barWidth: "40",
                    barGap: "10%",
                    barCateGoryGap: "10%",
                    itemStyle: {
                        shadowBlur: 0,
                        shadowColor: "transparent",
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        borderRadius: [0, 0, 0, 0],
                        borderColor: "#19465D",
                        borderType: "solid",
                        borderWidth: 0,
                        opacity: 1,
                    },
                    data: [],
                })

                let yData = []
                const series = []

                data.forEach((item) => {
                    yData.push(item["value"])
                    xAxis.data.push(item["name"])
                })

                seriesStyle.data = yData
                seriesStyle2.data = yData
                seriesStyle3.data = yData
                seriesStyle4.data = yData
                seriesStyle5.data = yData

                series.push(
                    seriesStyle,
                    seriesStyle2,
                    seriesStyle3,
                    seriesStyle4,
                    seriesStyle5
                )
                return {series, xAxis}
            }

            /**
             * 合并Option
             */
            function mergeOption(series, xAxis) {
                const component = {
                    id: "e1ffcece-c516-4d34-bdf7-1160a8c9f049",
                    name: "全国风力分布",
                    version: "v1.0.0",
                    alias: "StereoHistogram",
                    thumbnail: "images/widgets/chart/bar/StereoHistogram.png",
                    width: 700,
                    height: 400,
                    pnode: {type: "bar", pnode: {type: "chart"}},
                    option: {
                        grid: {
                            top: 30,
                            left: 15,
                            right: 15,
                            bottom: 30,
                            containLabel: true,
                        },
                        title: {
                            text: "",
                            show: false,
                            link: "http://weitu.yunzhisec.com",
                            target: "blank",
                            textStyle: {
                                color: "#fff",
                                fontStyle: "normal",
                                fontWeight: "normal",
                                fontSize: 14,
                                lineHeight: 30,
                                textBorderColor: "",
                                textBorderWidth: 1,
                                textBorderType: "solid",
                                textBorderDashOffset: 1,
                                textShadowColor: "transparent",
                                textShadowBlur: 1,
                                textShadowOffsetX: 1,
                                textShadowOffsetY: 1,
                                overflow: "none",
                            },
                            padding: 1,
                            itemGap: 10,
                            z: 10,
                            left: "auto",
                            top: "auto",
                            right: "auto",
                            bottom: "auto",
                            backgroundColor: "transparent",
                            borderColor: "",
                            borderWidth: "",
                            borderRadius: 1,
                            shadowBlur: 0,
                            shadowColor: "",
                            shadowOffsetX: "",
                            shadowOffsetY: "",
                            subtext: "",
                            sublink: "",
                            subtarget: "blank",
                            subtextStyle: {
                                color: "#ffffff",
                                fontStyle: "normal",
                                fontWeight: "normal",
                                fontSize: 12,
                                lineHeight: 0,
                                textBorderColor: "",
                                textBorderWidth: 0,
                                textBorderType: "solid",
                                textBorderDashOffset: 0,
                                textShadowColor: "transparent",
                                textShadowBlur: 0,
                                textShadowOffsetX: 0,
                                textShadowOffsetY: 0,
                                overflow: "none",
                            },
                        },
                        color: [
                            "rgba(114,182,255,1)",
                            "rgba(79,164,255,1)",
                            {
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                type: "linear",
                                global: false,
                                colorStops: [
                                    {offset: 0, color: "rgba(61, 156, 255, 0.9)"},
                                    {offset: 1, color: "rgba(61, 156, 255, 0)"},
                                ],
                            },
                        ],
                        legend: {
                            show: false,
                            top: "top",
                            left: "center",
                            orient: "horizontal",
                            itemWidth: 8,
                            itemHeight: 8,
                            itemGap: 10,
                            icon: "rect",
                            textStyle: {color: "#ffffff", fontSize: 12, lineHeight: 14},
                        },
                        xAxis: {
                            type: "category",
                            data: [],
                            axisLine: {show: false, lineStyle: {color: "white"}},
                            offset: 20,
                            splitLine: {
                                show: false,
                                lineStyle: {color: "#181919", type: "dashed", width: 1},
                            },
                            axisTick: {
                                show: false,
                                lineStyle: {color: "#181919", type: "solid", width: 1},
                            },
                            axisLabel: {
                                show: true,
                                color: "#ffffff",
                                fontSize: 12,
                                margin: 8,
                            },
                        },
                        yAxis: {
                            show: true,
                            type: "value",
                            axisLabel: {
                                show: true,
                                color: "rgba(241, 248, 255, 0.7)",
                                fontSize: 12,
                                margin: 8,
                            },
                            axisLine: {
                                show: false,
                                lineStyle: {color: "#01FCE3", type: "solid", width: 1},
                            },
                            axisTick: {
                                show: false,
                                lineStyle: {color: "#01FCE3", type: "solid", width: 1},
                            },
                            splitLine: {
                                show: false,
                                lineStyle: {
                                    color: "rgba(241, 248, 255, 0.1)",
                                    type: "dashed",
                                    width: 1,
                                },
                            },
                        },
                    },
                    source: [
                        {
                            name: "default",
                            source: {
                                type: "static",
                                filter: {isFilter: false, filterId: -1},
                                isAutoUpdate: false,
                                autoUpdateTime: 60,
                                mapping: [
                                    {
                                        name: "name",
                                        required: true,
                                        description: "名称",
                                        type: "string",
                                        mapping: "name",
                                    },
                                    {
                                        name: "value",
                                        required: true,
                                        description: "值",
                                        type: "number",
                                        mapping: "value",
                                    },
                                ],
                                static: [
                                    {value: 2861, name: "AA"},
                                    {value: 4120, name: "BB"},
                                    {value: 4765, name: "CC"},
                                    {value: 3240, name: "DD"},
                                    {value: 4210, name: "EE"},
                                ],
                                api: {
                                    sourcesId: -1,
                                    requestType: "GET",
                                    requestHeader: {token: null},
                                    getParam: "",
                                    postParam: {},
                                    requestUrl: "",
                                    cookie: false,
                                },
                                mysql: {sourcesId: -1, database: -1, sql: ""},
                                elasticsearch: {sourcesId: -1, query: {index: "_all"}},
                                mongodb: {sourcesId: -1, query: {}, collection: -1},
                                csv: {},
                            },
                        },
                    ],
                }
                const {option} = deepCopy(component)
                option.series = series
                option.xAxis = xAxis
                return {option}
            }

            /**
             * 设置option
             * 1. 初始化echarts
             * 2. 处理数据 | 返回：series | xAxis
             * 3. 合并组装option
             * 4. setOption
             */
            function setOption() {
                const data = obj
                const myChart = echarts.init(
                    document.getElementById(
                        "qgws-table"
                    )
                )
                const {series, xAxis} = handlerData(data)
                const {option} = mergeOption(series, xAxis)
                // setOption
                myChart.setOption(option)
            }

            setOption()

        }
    })
}

//右上全国风向分布图
function right_qgfx() {
    $.ajax({
        url: "/main/wd",
        method: "get",
        success: function (obj) {
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(
                document.getElementById("qgfx-table")
            )
            // 指定图表的配置项
            let option = {
                grid: {
                    top: 15,
                    left: 15,
                    right: 15,
                    bottom: 15,
                    containLabel: true,
                },
                title: {
                    text: "",
                    show: false,
                    target: "blank",
                    textStyle: {
                        color: "#fff",
                        fontStyle: "normal",
                        fontWeight: "normal",
                        fontSize: 14,
                        lineHeight: 30,
                        textBorderColor: "",
                        textBorderWidth: 1,
                        textBorderType: "solid",
                        textBorderDashOffset: 1,
                        textShadowColor: "transparent",
                        textShadowBlur: 1,
                        textShadowOffsetX: 1,
                        textShadowOffsetY: 1,
                        overflow: "none",
                    },
                    padding: 1,
                    itemGap: 10,
                    z: 10,
                    left: "auto",
                    top: "auto",
                    right: "auto",
                    bottom: "auto",
                    backgroundColor: "transparent",
                    borderColor: "",
                    borderWidth: "",
                    borderRadius: 1,
                    shadowBlur: 0,
                    shadowColor: "",
                    shadowOffsetX: "",
                    shadowOffsetY: "",
                    subtext: "",
                    sublink: "",
                    subtarget: "blank",
                    subtextStyle: {
                        color: "#ffffff",
                        fontStyle: "normal",
                        fontWeight: "normal",
                        fontSize: 12,
                        lineHeight: 0,
                        textBorderColor: "",
                        textBorderWidth: 0,
                        textBorderType: "solid",
                        textBorderDashOffset: 0,
                        textShadowColor: "transparent",
                        textShadowBlur: 0,
                        textShadowOffsetX: 0,
                        textShadowOffsetY: 0,
                        overflow: "none",
                    },
                },
                color: ["#E8AA2E", "#FFE45E", "#5151FA", "#3D9CFF"],
                tooltip: {trigger: "item"},
                series: [
                    {
                        itemStyle: {
                            borderWidth: 0,
                            borderColor: "#FFE768",
                            shadowColor: "#FFE768",
                            borderRadius: 0,
                            shadowBlur: 0,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                        },
                        label: {
                            show: true,
                            position: "outside",
                            formatter: null,
                            fontSize: 14,
                            lineHeight: 22,
                            color: "#ffffff",
                        },
                        labelLine: {
                            length: 15,
                            length2: 15,
                            show: true,
                            color: "#00ffff",
                            lineStyle: {width: 1, type: "solid"},
                        },
                        radius: ["48%", "60%"],
                        type: "pie",
                    },
                ],
            }
            option.series[0].label.formatter = (params) => {
                return parseInt(params.percent) + "%" + "\n" + params.name
            }
            // 指定图表的数据
            let data = obj
            //映射
            data = data.map((item) => {
                return {value: item["value"], name: item["name"]}
            })
            option.series[0].data = data
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option)
        }
    })
}

//广州信息统计
function left_bgt() {
    $.ajax({
        url: "/main/bgt",
        method: "get",
        success: function (obj) {

            const myChart = echarts.init(
                document.getElementById("bgt-table")
            )
            // 指定图表的配置项
            let option = {
                grid: {
                    top: 15,
                    left: 15,
                    right: 15,
                    bottom: 15,
                    containLabel: true,
                },
                title: {
                    text: "广州信息统计",
                    show: false,
                    target: "blank",
                    textStyle: {
                        color: "#fff",
                        fontStyle: "normal",
                        fontWeight: "bolder",
                        fontSize: 18,
                        lineHeight: 30,
                        textBorderColor: "",
                        textBorderWidth: 1,
                        textBorderType: "solid",
                        textBorderDashOffset: 1,
                        textShadowColor: "transparent",
                        textShadowBlur: 1,
                        textShadowOffsetX: 1,
                        textShadowOffsetY: 1,
                        overflow: "none",
                    },
                    padding: 1,
                    itemGap: 10,
                    z: 10,
                    left: "center",
                    top: "top",
                    right: "auto",
                    bottom: "auto",
                    backgroundColor: "transparent",
                    borderColor: "",
                    borderWidth: "",
                    borderRadius: 1,
                    shadowBlur: 0,
                    shadowColor: "",
                    shadowOffsetX: "",
                    shadowOffsetY: "",
                    subtext: "",
                    sublink: "",
                    subtarget: "blank",
                    subtextStyle: {
                        color: "#ffffff",
                        fontStyle: "normal",
                        fontWeight: "normal",
                        fontSize: 12,
                        lineHeight: 0,
                        textBorderColor: "",
                        textBorderWidth: 0,
                        textBorderType: "solid",
                        textBorderDashOffset: 0,
                        textShadowColor: "transparent",
                        textShadowBlur: 0,
                        textShadowOffsetX: 0,
                        textShadowOffsetY: 0,
                        overflow: "none",
                    },
                },
                legend: {
                    show: false,
                    top: 10,
                    left: "center",
                    orient: "horizontal",
                    itemWidth: 16,
                    itemHeight: 2,
                    itemGap: 10,
                    icon: "roundRect",
                    textStyle: {color: "#ffffff", fontSize: 12},
                },
                xAxis: {
                    show: true,
                    axisLabel: {
                        show: true,
                        color: "rgba(241, 248, 255, 0.7)",
                        fontSize: 12,
                        margin: 8,
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: "rgba(241, 248, 255, 0.1)",
                            type: "solid",
                            width: 1,
                        },
                    },
                    axisTick: {
                        show: false,
                        lineStyle: {color: "#01FCE3", type: "solid", width: 1},
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {color: "#cccccc", type: "solid", width: 1},
                    },
                    smooth: false,
                    type: "category",
                    data: obj.x,
                },
                yAxis: {
                    show: true,
                    axisLabel: {
                        show: true,
                        color: "rgba(241, 248, 255, 0.7)",
                        fontSize: 12,
                        margin: 8,
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {color: "#01FCE3", type: "solid", width: 1},
                    },
                    axisTick: {
                        show: false,
                        lineStyle: {color: "#01FCE3", type: "solid", width: 1},
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "rgba(241, 248, 255, 0.1)",
                            type: "dashed",
                            width: 1,
                        },
                    },
                    type: "value",
                },
                color: ["#3D9CFF", "#43E8F3"],
                series: [
                    {
                        name: "温度",
                        type: "line",
                        yAxisIndex: 0,
                        data: [120, 132, 101, 134, 90, 230, 210],
                    },
                    {
                        name: "风速",
                        type: "line",
                        yAxisIndex: 0,
                        data: [140, 112, 171, 134, 120, 250, 260],
                    },
                ],
            }
            let seriesStyle = {
                label: {
                    show: false,
                    position: "top",
                    color: "#FFFFFF",
                    fontSize: 12,
                    offset: [0, 0],
                },
                areaStyle: {
                    opacity: 0,
                    shadowBlur: 6,
                    shadowColor: "#85a5ff",
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                },
                showSymbol: false,
                symbol: "circle",
                symbolSize: 20,
                symbolOffset: [0, 0],
                step: false,
                lineStyle: {
                    opacity: 1,
                    type: "line",
                    width: 3,
                    shadowBlur: 20,
                    shadowOffsetX: 2,
                    shadowOffsetY: 5,
                },
                smooth: true,
            }
            // 指定图表的数据
            let data = obj.d

            let sKey = "name"
            let xKey = "time"
            let yKey = "value"
            let seriesArr = data.map((item) => item[sKey])
            seriesArr = [...new Set(seriesArr)]
            option.series = []
            seriesArr.forEach((item, index) => {
                const datas = data
                    .filter((oitem) => oitem[sKey] === item)
                    .map((_item) => {
                        return {name: _item[xKey], value: _item[yKey]}
                    })
                option.series.push({
                    name: item,
                    data: datas,
                    type: "line",
                    ...seriesStyle,
                })
            })
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option)
        }
    })
}

function left_qgsk() {
    $.ajax({
        url: "/main/qgsk",
        method: "get",
        success: function (obj) {
            const source = {
                name: "default",
                source: {
                    type: "static",
                    filter: {isFilter: false, filterId: -1},
                    isAutoUpdate: false,
                    autoUpdateTime: 60,
                    mapping: [],
                    static: [
                        {
                            name: "轮播",
                            age: 18,
                            love: "打球",
                            address: "郑州市",
                            email: "854338015@qq.com",
                        },
                    ],
                    api: {
                        sourcesId: -1,
                        requestType: "GET",
                        requestHeader: {token: null},
                        getParam: "",
                        postParam: {},
                        requestUrl: "",
                        cookie: false,
                    },
                    mysql: {sourcesId: -1, database: -1, sql: ""},
                    elasticsearch: {sourcesId: -1, query: {index: "_all"}},
                    mongodb: {sourcesId: -1, query: {}, collection: -1},
                    csv: {},
                },
            }
            let option = {
                theader: {
                    align: "center",
                    height: 40,
                    fontSize: 12,
                    fontColor: "rgba(255, 255, 255, 1)",
                    backgroundColor: "rgba(71, 16, 122, 0)",
                },
                tbody: {
                    align: "center",
                    height: 35,
                    fontSize: 12,
                    fontColor: "rgba(222, 222, 222, 0.9)",
                    backgroundColor: "rgba(9, 15, 45, 0)",
                },
                border: {show: true, width: 0, color: "rgba(79, 141, 170, 1)"},
                table: {
                    stripe: true,
                    stripeColor: "rgba(27, 61, 97, 0.24)",
                    cellpadding: 0,
                    cellspacing: 0,
                    borderCollapse: "collapse",
                },
                defaultOption: {
                    step: 0.6,
                    limitMoveNum: 5,
                    hoverStop: true,
                    direction: 1,
                    openWatch: true,
                    singleHeight: 32,
                    singleWidth: 0,
                    waitTime: 1000,
                },
            }
            let data = obj

            //映射
            let show = true
            let stripe = true
            if (data.length) {
                const thList = Object.keys(data[0])
                let thdom = document.querySelector(
                    "#qgsk-table .thead-tr"
                )
                let thstr = ""
                for (let i = 0; i < thList.length; i++) {
                    if (show) {
                        thstr += `<td class="has-border" style="text-indent: 10px;text-align: center">${thList[i]}</td>`
                    } else {
                        thstr += `<td class="no-border" style="text-indent: 10px;text-align: center">${thList[i]}</td>`
                    }
                }
                thdom.innerHTML = thstr
                let tbodydom = document.querySelector(
                    "#qgsk-table tbody"
                )
                let tbodystr = ""
                for (let i = 0; i < data.length; i++) {
                    let trstr = '<tr style="text-align: center">'
                    for (let j = 0; j < thList.length; j++) {
                        if (show) {
                            trstr += `<td class="has-border">${data[i][thList[j]]}</td>`
                        } else {
                            trstr += `<td class="no-border">${data[i][thList[j]]}</td>`
                        }
                    }
                    trstr += "</tr>"
                    tbodystr += trstr
                }
                tbodydom.innerHTML = tbodystr
                let tbodydom2 = document.querySelector(
                    "#qgsk-tabletbody"
                )
                let tbodystr2 = ""
                for (let i = 0; i < data.length; i++) {
                    let trstr = ""
                    if (stripe) {
                        trstr = '<li class="li stripe" style="text-align: center">'
                    } else {
                        trstr = '<li class="li" style="text-align: center">'
                    }
                    for (let j = 0; j < thList.length; j++) {
                        if (show) {
                            trstr += `<div style="text-indent: 10px;display: table-cell;box-sizing: border-box;word-break: break-all;border: 0px solid  rgba(79, 141, 170, 1);">${
                                data[i][thList[j]]
                            }</div>`
                        } else {
                            trstr += `<div style="text-indent: 10px;display: table-cell;box-sizing: border-box;border: none;word-break: break-all;">${
                                data[i][thList[j]]
                            }</div>`
                        }
                    }
                    trstr += "</li>"
                    tbodystr2 += trstr
                }
                tbodydom2.innerHTML = tbodystr2
                let optionScroll = JSON.parse(JSON.stringify(option.defaultOption))
                delete optionScroll.step
                seamscroll.init({
                    dom: document.getElementById(
                        "qgsk-tabletbody"
                    ),
                    ...optionScroll,
                })
            }
        }
    })
}