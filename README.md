# 说明
一个完全由uniapp开发的浏览器，并支持添加运行外部脚本，自带一个脚本编辑器,拥有比较完整的浏览器体验。

不可替换为官方的webview.js的SDK，为了兼容问题，本应用对官方的SDK进行了比较大的修改，如果替换可能无法正常使用。

## 构建方式
使用HBuildx构建应用进行安装.

## 如何集成到自己的应用内
主要是/pages/browser页面，直接在自己的应用跳转的时候在URL地址上带上url参数，如：

```
uni.navigateTo({
				url:"/pages/browser?url=www.baidu.com",
				animationType:'fade-in'
		})
```
这是放在pages目录的前提下，放在其他地址的话，跳转的时候自行修改浏览器的目录地址

## 浏览器消息总线

浏览器执行操作时发出的各种事件，可以通过监听不同事件实现不同功能组合,通过uniapp的uni.$on()和uni.$emit()页面通信对事件进行监听


| 类型	| 说明				| 事件名			| 参数/返回值					|
| ----	|----				| ----				| ----					|
| $on	| 来自网页消息		| WEB-MESSAGE		| Object< T >				|
| $emit	|打开后台窗口		| OPEN-BG			| Object<{url:string}>	|
| $emit	|刷新网页			| RELOAD			| -						|
| $emit	|打开新窗口			| OPEN-NEW-WINDOW	| url:string			|
| $emit	|关闭某个窗口		| CLOSE-WINDOW		| index:number			|
| $emit	|关闭所有窗口		| CLOSE-WINDOW-ALL	| -						|
| $emit	|点击书签链接		| BOOK-MARK			|  Object<{url:string}>	|
| $emit	|切换后台窗口		| SWITCH-WEBVIEW	| Object<{index:number}>|
| $emit	|全屏				| FULL				| boolean				|
| $emit	|加载链接			| LOAD-URL			|  Object<{url:string}>	|
| $emit	|触发网页清除广告	| AD				| -						|
| $emit	|清除网页缓存				| CLEAR-CACHE				| -				|
| $on	|网页长按事件返回消息				| WEB-ACTION				| ```Object<any>```				|
																	



## 脚本开发

#### 示例
```
var myScript = function(){
	//我的脚本代码
}

if (window.webSDK) {
	myScript();
} else {
	document.addEventListener('SDK-READY', myScript, false);
}
```


## WEB-SDK方法
### 本地数据储存
### storage
storage本地数据储存持久化，不会因为用户清除网页数据而被清除，除非自己手动删除
```
const storage = webSDK.storage
```
#### 参数
无

#### 方法

+ setItem(key, value)
	>通过key，value储存一个对象到本地
	> * key
		>>类型：string
	> * value
		>>类型：string

+ getItem(key)
	>通过key获取储存的本地数据
	 * key
	 >>类型：string

+ removeItem(key)
	>通过key删除的本地数据
	 * key
	 >>类型：string

#### 示例
```
webSDK.storage.setItem('test','hello world')

const test = webSDK.storage.getItem('test')
```

## webview窗口对象
### current
current获取当前webview控制数据，可以修改浏览器样式，加载数据，跳转拦截，资源拦截等
```
const currentWebview = webSDK.current
```
#### 参数
无

#### 方法
方法太多，具体请查看安卓原生webview文档
* setCssText(text)
	>设置网页css内容
	>>text->类型：string
	>>CSS内容必须符合CSS语法格式，如"body{background:red;}"

* setBlockNetworkImage(bool)
	>是否关闭网页图片加载
	>bool->类型：Boolean

* overrideUrlLoading(options, callback)
	>拦截Webview窗口的URL请求
	>> options 类型：object
		>>> * effect: (String 类型 )拦截URL请求生效时机
可取值： "instant" - 表示立即生效，即调用overrideUrlLoading方法后立即生效； "touchstart" - 表示用户操作Webview窗口（触发touchstart事件）后生效，如果用户没有操作Webview窗口则不对URL请求操作进行拦截处理。 默认值为"instant"。

		>>> * mode: (String 类型 )拦截模式
可取值： "allow"表示满足match属性定义的条件时不拦截url继续加载，不满足match属性定义的条件时拦截url跳转并触发callback回调； "reject"表示满足match属性定义的提交时拦截url跳转并触发callback回调，不满足match属性定义的条件时不拦截url继续加载。 默认值为"reject"。
		>>> * match: (String 类型 )区配是否需要处理的URL请求
支持正则表达式，默认值为对所有URL地址生效（相当于正则表达式“.*”）。 如果mode值为"allow"则允许区配的URL请求跳转，mode值为"reject"则拦截区配的URL请求。

		>>> * exclude: (String 类型 )排除拦截处理请求类型
不拦截处理指定类型的URL请求，直接使用系统默认处理逻辑。 可取值： "none"表示不排除任何URL请求（即拦截处理所有URL请求）； "redirect"表示排除拦截处理301/302跳转的请求（谨慎使用，非a标签的href触发的URL请求可能会误判断为302跳转）。 默认值为"none"。

* overrideResourceRequest([options])
> 拦截Webview窗口的资源加载
>> options 类型：Array
>> * match: (String 类型 )区配需要拦截请求资源的URL地址
支持正则表达式，默认值为空字符串（即不拦截）。

 >> * header: (JSON 类型 )设置重定向资源数据的http头数据
可设置标注http头数据（如Content-type）,也可设置自定义数据。 通常可通过此属性来设置拦截资源的缓存策略（如Cache-control）。


## Dlna投屏
### Dlan
Dlan投屏
```
const Dlan = webSDK.Dlan
```
#### 参数
无

#### 方法

+ search()
	>搜索可用的投屏设备

+ play(options)
	>将视频投放到可投屏的设备上
	 * options
	 >>类型：object
	>> * url：投放发视频链接 [必填]
	>> * id：投放的设备id [必填]
	>> * title： 投放的视频标题

+ success
	* 搜索设备成功的回调返回一段设备列表的json数组，包含投放设备id

+ complate
	* 投放成功或失败回调

#### 示例
```
webSDK.Dlan.search()
webSDK.Dlan.success = (arr)=>{
	let deviceID = arr[0].id
	webSDK.Dlan.play({id:deviceID,url,title})
}

```


## 使用系统播放器播放视频
### openSystemPlayer
使用openSystemPlayer方法打开系统播放器
```
webSDK.openSystemPlayer(src)
```
#### 参数

| 参数 | 类型 | 必填 | 说明 |
| :-----| ---- | :---- |:---- |
| src | string | 是 | 调用系统播放器打开链接 |

#### 方法

无


## 浏览器长按事件
### getLongCLickTarget
监听浏览器长按事件，注意，一旦监听了这个事件，系统的长按事件将失效,推荐使用WEB-ACTION进行监听


#### 示例
```
webSDK.getLongCLickTarget = (target)=>{
	target.classList
}
```

## 下载事件监听
### DownloadListener
DownloadListener方法监听浏览器的下载事件，使用第三方下载器时触发

#### 示例
```
const storage = webSDK.DownloadListener = (url)=>{
	alert('下载的文件链接为：'+url)
}
```


## 后续
之后有更新的话会在GitHub上更新

### 2023-5-09 主要更新内容 （2.6.0）

本次更新大部分为底层代码更新，如果使用之前版本代码开发过的第三方可能无法直接使用当前版本进行更新

1 国际化支持

2 用户隐私设置，用户可以对每个网页进行不同的授权操作

3 网页隐私访问历史痕迹

4 关键词联想

5 WEB-SDK重写，交互重构

6 删除不必要界面

7 优化加载速度

8 网页和原生的通信优化

9 归类了事件总线

10 其他。。。

### 2023-4-23 主要更新内容 （2.4.5）

1 优化菜单显示

2 添加网页访问剪切板权限管理

3 允许新窗口打开网页

4 可以直接在网页中选择视频在外部播放器打开了

5 修复其他小bug

### 2023-4-13 主要更新内容（2.4.4）

1 修复使用第三方下载器有时导致程序进入假死状态

2 资源嗅探列表优化


### 2023-4-10 主要更新内容 （2.4.3）

1 优化资源嗅探流程，防止阻塞主进程导致卡顿（如果需要得到完整的资源，应该等待网页加载完成后再打开了嗅探日志）

2 DLan投屏SDK本地化（暂无界面）

3 增加后台窗口休眠，防止打开大量窗口后导致内存占用过高

4 优化使用第三方视频播放网页的播放成功率

### 2023-3-14 主要更新内容 （2.4.2）
1 新增本地js代码编辑器，方便再浏览器内编辑脚本

2 修复没有云开发环境导致部分页面无法正常访问的bug

3 针对资源嗅探功能将改为使用页面JS注入的方式进行监听，目前仍然使用native进行

4 修复默认主页报错提示

5 现在可以编译到IOS上，但无法使用文件系统，需要自行修改兼容，后续有时间再对这一块进行兼容

### 2023-2-24 主要更新内容 （2.4.1）
1.文件管理器优化

2.修复打开了新窗口显示错误页面的bug


### 2023-2-22 主要更新内容 （2.4.0）
1.增加脚本管理器  

2.新增ADBlock广告过滤器  

3.优化浏览网页和webview的交互优化页面交互  

4.添加调用第三方下载器的使用  

5.优化广告拦截的操作  

6.优化后天多窗口的交互的操作  

7.新增DLAN投屏SDK，需要配和原生打包使用

8.外部调用浏览器优化

9.隐私模式是通过清除历史记录以及不允许读取和保存cookie和storage。

10.视频播放可以使用第三方播放器播放网页视频

11.其他优化。。。改的太多不一一列出了



## 下一个3.0版本主要更新内容
1.新增移植油猴插件的支持，目前已完成大部分油猴的代码移植到uniapp下

2.分离浏览器的webview核心代码，方便把浏览器当作普通插件使用

3.一个更完善的本地化脚本编辑器


### 联系作者

 如果想请作者喝杯咖啡可以加作者QQ：549859890
 
 如果想了解最新开发进度可以加QQ群：326734794
	


[GITHUB源码](https://github.com/SHEE94/unibrowser)

[app下载](https://github.com/SHEE94/unibrowser/releases)

[安卓原生打包工程地址](https://pan.baidu.com/s/1LzNzTwMse_2eE4UEqqsCYg?pwd=9999)

[X5内核版安卓原生打包工程地址](https://pan.baidu.com/s/1f0ZqsIbxdr6hHsGGocxZ0g?pwd=9999)