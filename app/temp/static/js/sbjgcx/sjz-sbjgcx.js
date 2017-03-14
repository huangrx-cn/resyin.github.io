/**
 * Created by HUANG on 2016/12/9.
 */

// 创建 BaiDu Map 实例
var map = new BMap.Map("map");

// 初始化 Map
!function() {
	map.enableScrollWheelZoom();
	map.addControl(new BMap.ScaleControl());
	map.addControl(new BMap.OverviewMapControl());
	map.addControl(new BMap.MapTypeControl());
	map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
	map.setCurrentCity("石家庄");
}();

// 工具类
var Util = {

	/**
	 * 设置Map容器的高度
	 */
	setMapHeight : function() {
		var mapBoxHeight = $(window).height() - $('#pageHeader').height()
				- $('#pageMiddle').height() - 38;
		$('#mapBox').css({
			height : mapBoxHeight + 'px'
		});
	}
};

// 页面加载完成后
$(document).ready(function() {
	Util.setMapHeight();
});

// 搜索与地图展示
!function() {

	// 搜索模块
	// 检索关键词
	var keyword = "",
	// 当前页码
	page = 0,
	// 存储检索出来的结果的坐标数组
	points = [],
	// 麻点图层
	customLayer = null;
	// 新建麻点图图层对象
	customLayer = new BMap.CustomLayer(4392);
	// 将麻点图添加到地图当中
	map.addTileLayer(customLayer);
	// 给麻点图添加点击麻点回调函数
	customLayer.addEventListener('hotspotclick', hotspotclickCallback);
	// 麻点图的回调函数
	function hotspotclickCallback(e) {
		var customPoi = e.customPoi, str = [];
		str.push("address = " + customPoi.address);
		str.push("phoneNumber = " + customPoi.phoneNumber);
		var content = '<p style="width:280px;margin:0;line-height:20px;">地址：'
				+ customPoi.address + '</p>';

		// 创建检索信息窗口对象
		var searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
			title : customPoi.title, // 标题
			width : 300, // 宽度
			height : 50, // 高度
			enableAutoPan : true, // 自动平移
			enableSendToPhone : true, // 是否显示发送到手机按钮
			searchTypes : [ BMAPLIB_TAB_SEARCH, // 周边检索
			BMAPLIB_TAB_TO_HERE, // 到这里去
			BMAPLIB_TAB_FROM_HERE // 从这里出发
			]
		});
		var point = new BMap.Point(customPoi.point.lng, customPoi.point.lat);
		// 打开信息窗口
		searchInfoWindow.open(point);
	}

	// 搜索按钮动作
	$('#searchBtn').bind('click', function() {
		keyword = $('#keyword').val();
		searchAction(keyword);
	});

	// 搜索
	function searchAction(keyword, page) {
		page = page || 0;
		// 过滤条件
		var filter = [];
		var url = "http://api.map.baidu.com/geosearch/v2/local?callback=?";
		$.getJSON(url, {
			'q' : keyword, // 检索关键字
			'page_index' : page, // 页码
			'filter' : filter.join('|'), // 过滤条件
			'region' : '', // 地区代码
			'scope' : '2', // 显示详细信息
			'geotable_id' : 159771, // 数据表id
			'ak' : 'Xb2RG9I9L68EGvTM2tzEV6mScYkysIjX' // 秘钥
		}, function(e) {
			renderMap(e, page + 1);
		});
	}

	// 渲染地图
	function renderMap(res, page) {
		var content = res.contents;
		$('#mapList').html('');
		map.clearOverlays();
		points.length = 0;
		if (content.length == 0) {
			$('#mapList')
					.append(
							$('<p style="border-top:1px solid #DDDDDD;padding-top:10px;text-align:center;text-align:center;font-size:18px;" class="text-warning">抱歉，没有找到您搜索的地点，请重新搜索</p>'));
			return;
		}
		$.each(content,
				function(i, item) {
					var point = new BMap.Point(item.location[0],
							item.location[1]), marker = new BMap.Marker(point);
					points.push(point);

					// 列表数据
					var tr = $(
							"<tr>" + "<td width='75%'>" + item.title + "<br/>"
									+ item.address + "</td></tr>").click(
							showInfo);
					$('#mapList').append(tr);
					marker.addEventListener('click', showInfo);

					// 选点数据
					function showInfo() {
						var content = "<p>地址：" + item.address + "</p>"
								+ "<p>电话：" + item.office_telephone + "</p>"
								+ "<p>传真：" + item.office_fax + "</p>";
//								+ "<p>部门：" + item.yl_name + "</p>" + "<p>部门电话："
//								+ item.yl_telephone + "</p>";

						// 创建检索信息窗口对象
						var searchInfoWindow = new BMapLib.SearchInfoWindow(
								map, content, {
									title : item.title, // 标题
									width : 290, // 宽度
									panel : "panel", // 检索结果面板
									enableAutoPan : true, // 自动平移
									enableSendToPhone : false,
									searchTypes : [
									// BMAPLIB_TAB_SEARCH, //周边检索
									// BMAPLIB_TAB_TO_HERE, //到这里去
									// BMAPLIB_TAB_FROM_HERE //从这里出发
									]
								});
						searchInfoWindow.open(marker);
					}
					map.addOverlay(marker);
				});

		/**
		 * 分页
		 */
		var pagecount = Math.ceil(res.total / 10);
		if (pagecount > 76) {
			pagecount = 76; // 最大页数76页
		}
		function PageClick(pageclickednumber) {
			pageclickednumber = parseInt(pageclickednumber);
			$("#pager").pager({
				pagenumber : pageclickednumber,
				pagecount : pagecount,
				showcount : 3,
				buttonClickCallback : PageClick
			});
			searchAction(keyword, pageclickednumber - 1);
		}

		$("#mapPager").pager({
			pagenumber : page,
			pagecount : pagecount,
			showcount : 3,
			buttonClickCallback : PageClick
		});

		map.setViewport(points);
	}
	;

	// 初始化
	searchAction(keyword);
}();
