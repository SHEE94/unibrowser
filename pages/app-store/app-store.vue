<template>
	<view>
		<view class="app-content">
			<view class="title">
				精选应用
			</view>
			<unicloud-db v-slot:default="{data, loading, error, options}" collection="apps">
				<view v-if="loading" style="padding: 15px; text-align: center;">正在更新</view>
				<view v-if="error">{{error.message}}</view>
				<view v-else>
					<scroll-view scroll-y="true" style="height: 78vh;">
						<view>
							<view class="app-row">
								<navigator class="app-col" v-for="(item, index_2) in data" :key="index_2" :url="'/pages/browser/browser?url='+item.url">							
									<image :src="item.img?item.img:item.imgUrl" mode="aspectFill" class="preview"></image>
									<view class="name">{{item.title}}</view>
								</navigator>
							</view>
						</view>
					</scroll-view>
					
				</view>
			</unicloud-db>
			
		</view>
	</view>
</template>

<script>
	import db from '@/utils/db.js'
export default {
	data() {
		return {
			list:[
				{
					cate:'4399',
					list:[
						{
							title:'大大的',
							privew:'',
							url:'http://szhong.4399.com/4399swf/upload_swf/ftp34/liuxinyu/20201221/1/gameIndex.html'
						}
					]
				}
			]
		};
	},
	onLoad() {
		db.get('apps').then(data=>{
			
		})
	},
	methods: {}
};
</script>

<style lang="less">
.app-content {
	display: flex;
	flex-direction: column;
	padding: 15px;
	padding-top: 40px;
	box-sizing: border-box;
	.title{
		padding-bottom: 15px;
		background-color: #fff;
		border-bottom: 1px solid #CCCC77;
		margin-bottom: 15px;
		font-weight: bold;
	}
	.app-row {
		width: 100%;
		// display: flex;
		// justify-content: space-between;
		// align-items: center;
		margin-bottom: 15px;
		// flex-wrap: wrap;
		.app-col {
			width: 50px;
			height: 80px;
			float: left;
			margin: 10px;
			.preview {
				width: 50px;
				background-color: #eee;
				height: 50px;
				border-radius: 8upx;
				overflow: hidden;
			}
			.name {
				font-size: 12px;
				width: 50px;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}
	}
}
</style>
