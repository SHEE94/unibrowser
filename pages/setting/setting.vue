<template>
	<view class="content">
		<view class="list">
			<view class="left-info">				
				<view class="label">开启下拉刷新</view>
			</view>
			<view class="arr">
				<switch :checked="settingConfig.pullLoad" @change="changePullload" />
			</view>
		</view>
		<view class="list">
			<view class="left-info">				
				<view class="label">开启嗅探日志</view>
			</view>
			<view class="arr">
				<switch :checked="settingConfig.resLog" @change="changeLog" />
			</view>
		</view>
		
		<view class="list">
			<view class="left-info">				
				<view class="label">使用系统播放器</view>
			</view>
			<view class="arr">
				<switch :checked="settingConfig.videoPLay" data-type="videoPLay" @change="change" />
			</view>
		</view>
		
		<navigator open-type="redirect" :url="'../bookmark/bookmark?from='+from" class="list">
			<view class="left-info">
				<view class="label">书签</view>
			</view>
			<view class="arr iconfont icon-right"></view>
		</navigator>
		
		<view class="list" v-for="(item,index) in menuList" :key="index" :data-key="item.key" :data-to="item.to" @click="tohere">
			<view class="left-info">
				
				<view class="label">{{item.name}}</view>
			</view>
			<view class="arr iconfont icon-right"></view>
		</view>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			settingConfig:{
				pullLoad:false,
				videoPLay:false,
				canvas:false,
				resLog:false,
				arm:220
			},
			menuList:[
				
				{
					icon:'icon-shuqian',
					name:'网络日志',
					to:'/pages/web-log/web-log',
					key:'web-log'
				},
				{
					icon:'icon-shuqian',
					name:'拦截',
					to:'/pages/intercept/intercept',
					key:'intercept'
				},
				{
					icon:'icon-shuqian',
					name:'UserAgent设置',
					to:'/pages/ua_set/ua_set',
					key:'ua_set'
				},
				{
					icon:'icon-shuqian',
					name:'工具',
					to:'/pages/tools/tools',
					key:'/pages/tools/tools'
				},
				{
					icon:'icon-shuqian',
					name:'帮助',
					to:'/pages/help/help',
					key:'help'
				},
				{
					icon:'icon-shuqian',
					name:'关于',
					to:'/pages/about/about',
					key:'about'
				},
			],
			from:null
		};
	},
	onLoad(options) {
		if(options.from){
			this.from = options.from
		}
		let settingConfig = uni.getStorageSync('settingConfig')
		if(settingConfig){
			this.settingConfig = settingConfig;
			// uni.removeStorageSync('settingConfig')
		}
	},
	onUnload() {
		uni.setStorageSync('settingConfig',this.settingConfig)
	},
	methods: {
		tohere(e){
			let key = e.currentTarget.dataset.key,
			to = e.currentTarget.dataset.to;
			uni.navigateTo({
				url:to
			})
		},
		changePullload(e){
			this.settingConfig.pullLoad = e.detail.value;
		},
		changeLog(e){
			let val = e.detail.value;
			if(val){
				uni.showModal({
					content:'开启资源嗅探会可能会导致浏览器变慢',
					confirmText:'确认开启',
					success: (res) => {
						if(res.confirm){
							this.settingConfig.resLog = val
						}
					}
				})
			}else{
				this.settingConfig.resLog = val
			}
			
		},
		change(e){
			let _type = e.currentTarget.dataset.type;
			this.settingConfig[_type] = e.detail.value;
		}
	}
};
</script>

<style lang="less">
.content {
	padding: 30upx 15upx;
	background-color: #EEEEEE;
	min-height: 100vh;
	box-sizing: border-box;
}

.list {
	display: flex;
	margin-bottom: 20upx;
	align-items: center;
	justify-content: space-between;
	padding: 15upx 20upx;
	background-color: #f7f7f7;
	.left-info {
		display: flex;
		align-items: center;
		.icon {
			margin-right: 10upx;
			font-size: 30upx;
			margin-bottom: -5upx;
		}
	}
}
</style>
