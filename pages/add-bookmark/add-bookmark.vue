<template>
	<view class="content">
		<view class="list">
			<input type="text" :value="info.title" placeholder="name" data-name="title" @input="enterinfo"/>
		</view>
		<view class="list">
			<input type="text" :value="info.url" placeholder="url" data-name="url" @input="enterinfo"/>
		</view>
		<view class="list" v-if="!edit">
			<button type="default" data-type="bookmark" @click="addto">添加到书签</button>
			<button type="default" data-type="home" @click="addto">添加到主页</button>
		</view>
		<view class="list" v-else>
			<button type="default" data-type="bookmark" @click="save">保存</button>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				info:{},
				edit:false,homeCardList:[]
			};
		},
		onLoad(options) {
			let index = options.index;
			
			this.info = app.globalData.bookmarkObj||{};
			this.bookmarkList = uni.getStorageSync('bookmark')||[];
			this.homeCardList = uni.getStorageSync('homebookmark')||[];
			if(index){
				this.edit = true;
				this.info = this.bookmarkList[index];
				this.index = index;
			}
		},
		methods:{
			addto(e){
				if(!this.info.title||!this.info.url){
					uni.showToast({
						icon:'none',
						title:'不可添加'
					})
					return;
				}
				let _type = e.currentTarget.dataset.type,obj = {title:this.info.title,url:this.info.url,ico:this.info.ico}
				
				if(_type == 'bookmark'){
					this.bookmarkList.push(obj);
					uni.setStorageSync('bookmark',this.bookmarkList)
				}else if(_type == 'home'){
					this.homeCardList = this.homeCardList
					if(typeof this.homeCardList == 'string'){
						this.homeCardList = JSON.parse(this.homeCardList)
					}
					this.homeCardList.push(obj);
					uni.setStorageSync('homebookmark',this.homeCardList)
				}
				uni.showToast({
					icon:'success',
					title:'已添加'
				})
				setTimeout(()=>{
					uni.navigateBack({
						delta:1
					})
				},1500)
			},
			enterinfo(e){
				let name = e.currentTarget.dataset.name;
				if(name == 'title'){
					this.info.title = e.detail.value;
				}else if(name== 'url'){
					this.info.url = e.detail.value;
				}
				
			},
			save(e){
				this.bookmarkList[this.index] = {title:this.info.title,url:this.info.url};
				uni.setStorageSync('bookmark',this.bookmarkList)
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="less">
	.content{
		background-color: #EEEEEE;
		min-height: 100vh;
		padding: 30upx;
		box-sizing: border-box;
	}
.list{
	padding: 15upx 30upx;
	background-color: #f7f7f7;
	margin-bottom: 30upx;
	display: flex;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	box-sizing: border-box;
	input{
		width: 100%;
	}
	button{
		width: 280upx;
		height: 80upx;
		line-height: 80upx;
		font-size: 28upx;
	}
}
</style>
