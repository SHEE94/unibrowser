<template>
	<view>
		
		<!-- <uni-collapse>
			<uni-collapse-item :show-animation="true" title="进行中">
				<view class="list-card" v-for="(it,index) in 5" :key="index">
					<view class="name">凡卡桑班好久好啊单色</view>
					<view class="progress-content">
						<view class="progress">
							<view class="progress-line"></view>
						</view>
						<view class="progress-state">暂停</view>
					</view>
				</view>
			</uni-collapse-item>
			<uni-collapse-item :show-animation="true" title="已完成"><text>折叠内容</text></uni-collapse-item>
		</uni-collapse> -->
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {}
};
</script>

<style lang="less">
.list-card{
	padding: 10px;
	color: #515151;
	box-sizing: border-box;
	border-bottom: 1px solid #eee;
	&:nth-last-child(1){
		border: none;
	}
	.name{
		font-size: 12px;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.progress-content{
		width: 100%;
		margin-top: 10px;
		.progress{
			width: 100%;
			height: 5px;
			border-radius: 50px;
			border: 1px solid #eee;
			position: relative;
			overflow: hidden;
			.progress-line{
				background-color: #A0EEE1;
				position: absolute;
				top: 0;
				left: 0;
				width: 50%;
				border-radius: 50px;
				height: 100%;
			}
		}
		.progress-state{
			font-size: 10px;
			color: #ccc;
		}
	}
}
</style>
