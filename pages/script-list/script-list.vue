<template>
	<view class="content">
		<view v-if="scriptList.length == 0&&script_dir_file.length == 0&&onlineScript.length==0" style="top: 80upx;color: #666666;font-size: 28upx;text-align: center;width: 100%;">空空如也
		</view>
		<view class="list" v-for="(item, index) in onlineScript" :key="'v_1'+index" :data-index="index" @click="changeScriptOnline" v-if="item.installPath">
			<view class="left-info">
				<view class="label">{{ item.name }}</view>
			</view>
			<view class="arr"><icon :type="item.active ? 'success' : 'cancel'" size="20"></icon></view>
		</view>
		
		<view style="padding: 30upx;background-color: #F7F7F7;margin-top: 30upx;border-bottom: 1px solid #CCCC77;" v-if="scriptList.length > 0">自定义脚本</view>
		<view class="list" v-for="(item, index) in scriptList" :key="index" :data-index="index" @click="showmodal">
			<view class="left-info">
				<view class="label">{{ item.name }}</view>
			</view>
			<view class="arr"><icon :type="item.active ? 'success' : 'cancel'" size="20"></icon></view>
		</view>
		<view style="padding: 30upx;background-color: #F7F7F7;margin-top: 30upx;border-bottom: 1px solid #CCCC77;" v-if="script_dir_file.length > 0">本地脚本</view>
		<view class="list" v-for="(s_self, index_2) in script_dir_file" :key="'v-' + index_2" :data-index="index_2" @click="changeScriptFile">
			<view class="left-info">
				<view class="label">{{ s_self.filename }}</view>
			</view>
			<view class="arr"><icon :type="s_self.active ? 'success' : 'cancel'" size="20"></icon></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			scriptList: [],
			script_dir_file: [],
			onlineScript:[],
			execute:['页面创建','页面加载完成'],
			checked:false,
			index:0
		};
	},
	onLoad() {
		this.scriptList = uni.getStorageSync('script_list') || [];
	},
	onShow() {
		this.onlineScript = uni.getStorageSync('installOnlineScript')||[]
		this.scriptList = uni.getStorageSync('script_list') || [];
		this.script_dir_file = uni.getStorageSync('script_dir_file') || [];
	},
	methods: {
		switchChange(e){
			this.checked = e.value;
			this.scriptList[index].active = this.checked;
			uni.setStorageSync('script_list',this.scriptList)
		},
		showmodal(e) {
			let index = e.currentTarget.dataset.index;
			let active = this.scriptList[index].active;
		
			uni.showActionSheet({
				itemList:[`${active?'关闭':'启用'}`,'编辑','删除'],
				success: (res) => {
					if(res.tapIndex == 0){
						this.scriptList[index].active = !this.scriptList[index].active
						uni.setStorageSync('script_list',this.scriptList)
					}else if(res.tapIndex == 1){
						uni.navigateTo({
							url:'../tools/script-edit-tool/script-edit-tool?type=1&index='+index
						})
					}else if(res.tapIndex == 2){
						this.scriptList.splice(index,1);
						uni.setStorageSync('script_list',this.scriptList)
					}
				}
			})
		},
		changeScriptFile(e) {
			let index = e.currentTarget.dataset.index;
			let active = this.script_dir_file[index].active;
			uni.showActionSheet({
				itemList:[`${active?'关闭':'启用'}`,'删除'],
				success: (res) => {
					if(res.tapIndex == 0){
						this.script_dir_file[index].active = !this.script_dir_file[index].active
						uni.setStorageSync('script_dir_file',this.script_dir_file)
					}else if(res.tapIndex == 1){
						this.script_dir_file.splice(index,1);
						uni.setStorageSync('script_dir_file',this.script_dir_file)
					}
				}
			})
		},
		changeScriptOnline(e){
			let index = e.currentTarget.dataset.index;
			let active = this.onlineScript[index].active;
			uni.showActionSheet({
				itemList:[`${active?'关闭':'启用'}`,'删除'],
				success: (res) => {
					if(res.tapIndex == 0){
						this.onlineScript[index].active = !this.onlineScript[index].active
						uni.setStorageSync('installOnlineScript',this.onlineScript)
					}else if(res.tapIndex == 1){
						this.onlineScript.splice(index,1)
						uni.setStorageSync('installOnlineScript',this.onlineScript)
					}
				}
			})
		}
	}
};
</script>

<style lang="less">
.content {
	padding: 30upx 15upx;
	background-color: #eeeeee;
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
	.arr {
		display: flex;
		align-items: center;
	}
}
</style>
