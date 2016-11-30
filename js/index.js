// 频道点击 菜单显示隐藏
(function(doc, win) {

	var menu = doc.querySelector(".top_menu");
	var tList = doc.querySelector(".top_list");
	var aBtn = menu.querySelector("a");

	// 菜单栏显示与隐藏
	aBtn.addEventListener("touchstart", function(e) {

		if (this.className === "close") {

			this.className = "";
			tList.style.display = "none";
		} else {

			this.className = "close";
			tList.style.display = "block";
		}
		// 阻止按钮事件冒泡
		e.stopPropagation();
	}, false);

	tList.addEventListener("touchstart", function(e) {

		// 阻止本身事件冒泡
		e.stopPropagation();
	}, false);

	// 点击屏幕其他区域 隐藏菜单栏
	doc.addEventListener("touchstart", function() {

		if (aBtn.className === "close") {

			aBtn.className = "";
			tList.style.display = "none";
		}
	}, false);
})(document, window);

// 导航菜单栏
(function(doc, win) {

	var oNav = doc.querySelector(".nav");
	var oUl = oNav.querySelector("ul");
	var aLi = oUl.querySelectorAll("li");

	// 计算ul的宽度
	var sum = 0;
	for (var i = 0; i < aLi.length; i++) {

		sum += aLi[i].offsetWidth;
	}

	// js计算不定宽度忽略小数
	oUl.style.width = sum + 1 + "px";

	// 调用滑动函数
	swipe({
		parent: oNav,
		scroll: oUl,
		dir: 0
	});
	// 第二种方式 运用transiton 贝塞尔曲线实现运动 
	// swipeBuce(oNav,oUl);
})(document, window);

// 滚动条
(function(doc, win) {

	var wrap = doc.querySelector(".wrap");
	var main = doc.querySelector(".main");
	var bar = doc.querySelector(".bar");
	var search = doc.querySelector(".search");
	var btn = doc.querySelector(".sear_btn");
	console.log(main.offsetHeight)

	// 设置bar高度
	var per = wrap.clientHeight / main.offsetHeight;
	var height = search.offsetHeight;
	bar.style.height = per * 100 + "%";

	transform(bar, "translateY", 0);

	// 回调函数
	var callBack = {
		start: function() {
			var top = transform(main, "translateY");
			if(top < 0){

				bar.style.opacity = 1;
			}
		},
		in : function() {
			var top = transform(main, "translateY");
			if (top < -30) {

				search.style.display = "none";
				search.hide = true;
			}
			transform(bar, "translateY", -top * per);
		},
		end: function() {
			var top = transform(main, "translateY");
			if (top > (-height / 2)) {

				search.style.display = "block";
				search.hide = false;
			}
			bar.style.opacity = 0;
		}
	}

	// 点击隐藏显示搜索按钮
	btn.onclick = function() {

		if (search.hide) {

			search.style.display = "block";
			search.hide = false;
		} else {

			search.style.display = "none";
			search.hide = true;
		}

	}
	swipe({
		parent: wrap,
		scroll: main,
		dir: 1,
		callBack: callBack
	});
})(document, window);

// 图片无缝轮播
(function(doc, win) {

	// 设置ul宽度
	var slider = doc.querySelector(".slider");
	var oUl = slider.querySelector("ul");
	// 复制html
	oUl.innerHTML += oUl.innerHTML;

	var aLi = oUl.querySelectorAll("li");
	var aSpan = slider.querySelectorAll("span");
	var len = aLi.length;
	var width = slider.offsetWidth;
	oUl.style.width = len + "00%";

	for (var i = 0; i < len; i++) {

		aLi[i].style.width = 1 / len * 100 + "%";
	}

	// ul起始位置 鼠标按下XY位置 鼠标移动XY位置 自增变量 定时器
	var startX = 0,
		tstartX = 0,
		tstartY = 0,
		estartX = 0,
		estartY = 0,
		iNow = 0,
		timer = null;

	// 判断用户竖向 横向滑动 阻止用户中途转向
	var isX = true,
		isFirst = true;

	transform(oUl, "translateX", 0);
	transform(oUl, "translateZ", 0.01);
	autoPlay();

	// 绑定手指滑动事件
	slider.addEventListener("touchstart", function(e) {

		clearInterval(timer);

		var points = e.changedTouches[0];
		tstartX = points.pageX;
		tstartY = points.pageY;
		isX = true;
		isFirst = true;

		// 无缝衔接
		if (iNow === 0) {
			transform(oUl, "translateX", -len / 2 * width);
		} else if (iNow === (len - 1)) {
			transform(oUl, "translateX", -(len / 2 - 1) * width);
		}

		startX = transform(oUl, "translateX");
	}, false);

	// 手指移动事件
	slider.addEventListener("touchmove", function(e) {

		// 如果y大于x 直接return
		if (!isX) return;

		var points = e.changedTouches[0];
		estartX = points.pageX;
		estartY = points.pageY;
		var disX = estartX - tstartX;
		var disY = estartY - tstartY;

		// 判断用户是否第一次拖动
		if (isFirst) {

			isFirst = false;
			if (Math.abs(disY) > Math.abs(disX)) isX = false;
		}
		if (isX) {

			oUl.style.transition = "none";
			transform(oUl, "translateX", startX + disX);
		}
	}, false);

	// 手指离开事件
	slider.addEventListener("touchend", function() {

		startX = transform(oUl, "translateX");
		iNow = -Math.round(startX / width);

		move();
		autoPlay();
	}, false);

	// 自动轮播
	function autoPlay() {

		timer = setInterval(function() {

			if (iNow === len - 1) {

				oUl.style.transition = "none";
				iNow = len / 2 - 1;
				transform(oUl, "translateX", -iNow * width);
			}

			// 设置延时器 防止程序过度加载动画失效
			setTimeout(function() {

				iNow++;
				move()
			}, 30);
		}, 2000);
	}

	// 运动函数
	function move() {

		oUl.style.transition = "1s";
		transform(oUl, "translateX", -iNow * width);
		for (var i = 0; i < len / 2; i++) {
			aSpan[i].className = "";
		}
		aSpan[iNow % (len / 2)].className = "active";
	}

})(document, window);

// 选项卡
(function(doc, win) {

	var aTab = doc.querySelectorAll(".tab");
	var width = doc.querySelector(".MV").offsetWidth;
	for (var i = 0; i < aTab.length; i++) {

		tabChange(aTab[i]);
	}

	function tabChange(tab) {

		var oNav = tab.querySelector("nav");
		var aBtn = oNav.querySelectorAll("a");
		var oContent = tab.querySelector(".content");
		var aUl = oContent.querySelectorAll("ul");

		// 设置宽度
		var len = aUl.length;
		oContent.style.width = len + "00%";
		for (var i = 0; i < len; i++) {

			aUl[i].style.width = 1 / len * 100 + "%";
		}

		transform(oContent,"translateZ",0.01);
		transform(oContent, "translateX", -width);

		// ul起始位置 鼠标按下XY位置 鼠标移动XY位置 自增变量
		var startX = 0,
			tstartX = 0,
			tstartY = 0,
			estartX = 0,
			estartY = 0,
			iNow = 0;

		// 判断用户竖向 横向滑动 阻止用户中途转向 是否正在加载
		var isX = true,
			isFirst = true,
			isLoad = false;

		// 绑定拖动事件
		oContent.addEventListener("touchstart", function(e) {

			// 加载过程限制用户拖动
			if (isLoad) return;

			var points = e.changedTouches[0];
			tstartX = points.pageX;
			tstartY = points.pageY;
			isX = true;
			isFirst = true;

			startX = transform(this, "translateX");
		}, false);
		oContent.addEventListener("touchmove", function(e) {

			if (isLoad) return;
			// 如果y大于x 直接return
			if (!isX) return;

			var points = e.changedTouches[0];
			estartX = points.pageX;
			estartY = points.pageY;
			var disX = estartX - tstartX;
			var disY = estartY - tstartY;

			// 判断用户是否第一次拖动
			if (isFirst) {

				isFirst = false;
				if (Math.abs(disY) > Math.abs(disX)) isX = false;
			}
			if (isX) {

				this.style.transition = "none";
				transform(this, "translateX", startX + disX);
			}

			// 用户滑动超过一半宽度 执行动画
			if (Math.abs(disX) > width / 2) {

				move(disX);
			}

		}, false);
		oContent.addEventListener("touchend", function() {

			if (isLoad) return;

			// 用户滑动小于一半宽度 回到原位置
			this.style.transition = ".5s";
			transform(this, "translateX", -width);
		}, false);

		// move
		function move(disX) {

			isLoad = true;

			// 判断用户拖动方向 -1右 1左
			var dir = disX / Math.abs(disX);
			var length = aBtn.length;
			iNow -= dir;

			// 更新选项卡
			for (var i = 0; i < length; i++) {

				aBtn[i].className = "";
			}

			if (iNow > length - 1) {

				iNow = 0;
			}
			if (iNow < 0) {

				iNow = length - 1;
			}
			aBtn[iNow].className = "active";

			// 计算目标位置
			var target = dir > 0 ? 5 : -(len - 1) * width - 5;

			oContent.style.transition = ".5s";
			transform(oContent, "translateX", target);

			// 动画结束
			oContent.addEventListener("webkitTransitionend", end, false);
			oContent.addEventListener("transitionend", end, false);
		}

		// 动画执行完成
		function end() {

			//  移除绑定事件
			oContent.removeEventListener("webkitTransitionend", end);
			oContent.removeEventListener("transitionend", end);

			// 模拟加载数据
			setTimeout(function() {

				oContent.style.transition = "none";
				transform(oContent, "translateX", -width);

				isLoad = false;
			}, 1000);
		}
	}
})(document, window);

// 贝塞尔曲线
function swipeBuce(parent, scroll) {

	var width = parent.clientWidth;
	minX = width - scroll.offsetWidth;
	startPos = 0,
		dis = 0;
	lastX = 0;
	starTime = 0;
	endTime = 0;
	disTime = 0;
	start = null;

	// 判断用户竖向 横向滑动 阻止用户中途转向
	var isX = true,
		isFirst = true;

	transform(scroll, "translateX", 0);

	// ul绑定事件
	parent.addEventListener("touchstart", function(e) {

		start = {
			x: e.changedTouches[0].pageX,
			y: e.changedTouches[0].pageY
		}

		isX = true;
		isFirst = true;

		lastX = start.x;
		starTime = new Date().getTime();

		dis = 0;
		disTime = 0;

		startPos = transform(scroll, "translateX");
	}, false);
	parent.addEventListener("touchmove", function(e) {

		var end = {
			x: e.changedTouches[0].pageX,
			y: e.changedTouches[0].pageY
		};
		var disX = end.x - start.x;
		var disY = end.Y - start.Y;
		var endTime = new Date().getTime();
		var step = 1;
		var over = 0;

		var translateX = startPos + disX;

		// 限制用户左右超出范围拖动
		if (translateX > 0) {

			step = 1 - translateX / width;
			translateX = step * translateX;
		} else if (translateX < minX) {

			over = minX - translateX;
			step = 1 - over / width;
			translateX = minX - parseInt(over * step);
		}

		// 判断用户是否第一次拖动
		if (isFirst) {

			isFirst = false;
			if (Math.abs(disY) > Math.abs(disX)) isX = false;
		}
		if (isX) {

			// 计算用户拖动距离 与时间差值
			dis = end.x - lastX;
			disT = endTime - starTime;

			// 更新上次位置 时间
			lastX = end.x;
			lastT = endTime;

			scroll.style.transition = "none";
			transform(scroll, "translateX", translateX);
		}
	}, false);
	parent.addEventListener("touchend", function() {

		// 计算缓冲速度
		var iSpeed = (dis / disT) * 1000;
		startPos = transform(scroll, "translateX");
		var target = startPos + iSpeed;

		// 设置运动函数 缓冲运动 http://cubic-bezier.com/#.11,.57,.25,1.15
		var transFun = "500ms cubic-bezier(.11,.57,.25,1.0)";

		// 限制运动范围
		if (target > 0) {

			target = 0;
			// 弹性运动
			transFun = "800ms cubic-bezier(.51,1.1,.84,1.45)";
		}
		if (target < minX) {

			target = minX;
			transFun = "800ms cubic-bezier(.51,1.1,.84,1.45)";
		}

		scroll.style.transition = transFun;
		transform(scroll, "translateX", target);
	}, false);
}