/*!
 * @param  {JSON}{
 * 		parent : 滑动元素父级
 * 		scroll : 滑动元素
 * 		dir : 滑动方向
 * 		callBack : 回调函数(可传)
 * }
 */
function swipe(json) {

	/*!
	 * 参数默认值
	 * @type {Object}
	 */
	var def = {
		parent : document.body,
		scroll : document.body.children[0],
		dir : 1,
	};

	/**
	 * 运动函数 t 当前次数 b初始值 c目标差值 d总次数
	 * @type {Object}
	 */
	var Tween = {
		easeOut: function(t, b, c, d) {
			return -c * ((t = t / d - 1) * t * t * t - 1) + b;
		},
		backOut: function(t, b, c, d, s) {
			if (typeof s == 'undefined') {
				s = 1.70158;
			}
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		}
	};

	// 默认值与参数合并
	var results = deepCopy(def,json);

	/*!
	 * client 可视区宽度或高度
	 * min 可滑动最小值
	 * attr 移动属性值 translateX translateY
	 */
	var client,
		min,
		attr;

	// 依据给定方向设值
	if (results.dir) {

		client = results.parent.clientHeight;
		min = (client - results.scroll.offsetHeight) > 0 ? 0 : client - results.scroll.offsetHeight;
		attr = "translateY";
	} else {

		client = results.parent.clientWidth;
		min = client - results.scroll.offsetWidth;
		attr = "translateX";
	}
	
	/*!
	 * startPos 元素起始位置
	 * dis 运动差值
	 * last 手指上次移动位置
	 * starTime 手指第一次触屏时间
	 * disTime 时间差值
	 * start 手指初始坐标对象
	 */
	var startPos = 0,
		dis = 0;
		last = 0;
		starTime = 0;
		disTime = 0;
		start = null;

	// 判断用户竖向 横向滑动 阻止用户中途转向
	var isDir = true,
		isFirst = true;

	transform(results.scroll, attr, 0);
	transform(results.scroll, "translateZ", 0.01);

	// 绑定三次事件
	results.parent.addEventListener("touchstart", function(e) {

		// 运动过程中 如果用户点击停止运动
		clearInterval(results.scroll.timer);
		// 手指位置
		start = {
			x: e.changedTouches[0].pageX,
			y: e.changedTouches[0].pageY
		}

		// 重置初始值
		isDir = true;
		isFirst = true;

		// 记录手指触碰当前位置 时间点
		last = results.dir ? start.Y : start.x;
		starTime = new Date().getTime();

		// 重置
		dis = 0;
		disTime = 0;

		results.callBack&&results.callBack.start();
		startPos = transform(results.scroll, attr);
	}, false);
	results.parent.addEventListener("touchmove", function(e) {

		// 手指移动坐标对象
		var end = {
			x: e.changedTouches[0].pageX,
			y: e.changedTouches[0].pageY
		};

		/*!
		 * disX 手指横向差值
		 * disY 手指竖向差值
		 * over 超出运动范围值
		 * step 超出运动范围 减小比例
		 * target 目标位置
		 * endTime 手指滑动时间
		 */
		var disX = end.x - start.x,
			disY = end.y - start.y,
			step = 1,
			over = 0,
			target = 0,
			endTime = new Date().getTime();

		// 判断用户是否第一次拖动
		if (isFirst) {

			isFirst = false;
			if (results.dir) {

				if (Math.abs(disY) < Math.abs(disX)) isDir = false;
			} else {

				if (Math.abs(disY) > Math.abs(disX)) isDir = false;
			}
		}

		// 计算目标位置
		target = results.dir ? startPos + disY : startPos + disX;

		// 橡皮筋效果
		if (target > 0) {

			step = 1 - target / client;
			target = step * target;
		} else if (target < min) {

			over = min - target;
			step = 1 - over / client;
			translateX = min - parseInt(over * step);
		}


		if (isDir) {

			// 计算用户滑动差值与时间差值
			dis = results.dir ? end.y - last : end.x - last;
			disTime = endTime - starTime;

			// 更新上次位置 时间
			last = results.dir ? end.y : end.x;
			lastT = endTime;

			results.callBack && results.callBack.in();
			transform(results.scroll, attr, target);
		}
	}, false);
	results.parent.addEventListener("touchend", function() {

		/**
		 * buf 计算缓冲距离
		 * pos 记录当前位置
		 * target 计算目标点
		 * type 指定运动类型
		 */
		var buf = (dis / disTime) * 1500;
			pos = transform(results.scroll, attr);
			target = buf + pos;
			type = "easeOut";

		// 限制运动范围
		if (target > 0) {

			target = 0;
			type = "backOut";
		}
		if (target < min) {

			target = min;
			type = "backOut";
		}

		tweenMove(target, 1000, type);
	}, false);

	// 运动函数
	function tweenMove(target, time, type) {

		// 对应Tween t b c d 注释33行
		var t = 0;
		var b = transform(results.scroll, attr);
		var c = target - b;
		var d = Math.ceil(time / 20);

		clearInterval(results.scroll.timer)
		results.scroll.timer = setInterval(function() {

			t++;
			if (t > d) {

				clearInterval(results.scroll.timer);
				results.callBack && results.callBack.end();
			} else {

				var y = Tween[type](t, b, c, d);
				transform(results.scroll, attr, y);
				results.callBack && results.callBack.in();
			}
		}, 20);
	}
}

/**
 * 深拷贝
 * @param  {Object} des 对象
 * @param  {Object} src 对象
 * @return {Object} des 合并后对象
 */
function deepCopy(des,src){

	var des = des || {};

	for(var key in src){

		if(typeof src[key] === "Object"){

			des[key] = (src[key.constructor === "Array"]) ? [] : {};
			deepCopy(des[key],src[key]);
		}else{

			des[key] = src[key];
		}
	}

	return des;
}

/*!
 * 该函数提供两种功能 3参设置值 2参获取值
 * @param  {Object} DOM对象
 * @param  {String} 属性值
 * @param  {Number} 具体数值
 */
function transform(obj, attr, val) {

	var str = "";

	// 创建对象保存attr val 方便下次获取
	if (!obj.transform) {

		obj.transform = {};
	}

	if (val !== undefined) {

		obj.transform[attr] = val;

		// 组合字符串
		for (var key in obj.transform) {

			switch (key) {

				case "translateX":
				case "translateY":
				case "translateZ":
					str += key + "(" + obj.transform[key] + "px)";
					break;
				case "rotateX":
				case "rotateY":
				case "rotateZ":
				case "skewX":
				case "skewY":
				case "skewZ":
					str += key + "(" + obj.transform[key] + "deg)";
					break;
				case "scale":
				case "scaleX":
				case "scaleY":
					str += key + "(" + obj.transform[key] + ")";
					break;
			}
		}

		obj.style.transform = str;

	} else {

		// 返回值判断 scale返回1 其他返回0
		if (!obj.transform[attr]) {

			if (attr === "scale") return 1;
			return 0;
		}
		return obj.transform[attr];
	}
}