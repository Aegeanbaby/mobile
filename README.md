在谷歌模拟器下测试(文件经压缩测试无误)
	1.解决各屏适配 (rem 最小像素比)需重新加载
	2.解决fixed抖动问题 换用绝对定位
	3.解决js加载过快 采用动态加载js 
	4.优化transition卡顿问题(采用translateZ backface transform-style 换用硬件加速)
项目要点:
	1.原生js实现(index.js)
	2.自己封装swipe函数(common.js) 实现自动轮播 图片加载(mv选项卡)
	3.运用es6新特性 模板字符串 Object.assign
	4.使用两种方法 实现滑动效果 tween函数和transition贝塞尔曲线
	5.使用scss编写css代码
	6.自己模拟滚动条滑动效果
	7.简单gulpfile.js构建
 
未解决问题：文字抖动

gulp:gulp-rev-append为文件加版本号

