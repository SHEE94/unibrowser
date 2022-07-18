<template>
	<view class="menuContent">
		<view class="mask" v-if="windowShow"></view>
		<view class="window" v-if="windowShow" :class="windowShow ? 'windowShow' : ''">
			<uni-grid :column="3" :show-border="false" :square="false">
				<uni-grid-item>
					<view class="menuinsidecontent">
						<image src="@/static/add.png" mode="aspectFit" class="menuimg"></image>
						<text class="text">添加书签</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="menuinsidecontent">
						<image src="@/static/shuqian.png" mode="aspectFit" class="menuimg"></image>
						<text class="text">书签</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="menuinsidecontent">
						<image src="@/static/history.png" mode="aspectFit" class="menuimg"></image>
						<text class="text">历史</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="menuinsidecontent">
						<image src="@/static/download.png" mode="aspectFit" class="menuimg"></image>
						<text class="text">下载</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="menuinsidecontent">
						<image src="@/static/gj.png" mode="aspectFit" class="menuimg"></image>
						<text class="text">工具箱</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="menuinsidecontent">
						<image src="@/static/setting.png" mode="aspectFit" class="menuimg"></image>
						<text class="text">设置</text>
					</view>
				</uni-grid-item>
			</uni-grid>
			<view class="menu-bar"><image src="@/static/down.png" mode="aspectFit" style="width: 40upx;height: 40upx;" @tap="hidemenu"></image></view>
		</view>
	</view>
</template>

<script>
import newvuew from '@/utils/newvue.js';
import uniGrid from '@/components/uni-grid/uni-grid.vue';
import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue';
export default {
	components: { uniGrid, uniGridItem },
	data() {
		return {
			windowShow: false
		};
	},
	onLoad() {},
	mounted() {
		newvuew.$on('more', e => {
			let _type = e.type;
			if (_type == 'open') {
				this.windowShow = true;
			}
		});
	},
	methods: {
		hidemenu(e) {
			this.windowShow = false;
		}
	}
};
</script>

<style>
.mask {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
}
.window {
	position: fixed;
	left: 0;
	right: 0;
	bottom: -100px;
	/* top: 100vh; */
	height: 400upx;
	background-color: #ffffff;
	padding: 30upx 30upx 0;
	/* box-sizing: border-box; */
	transition: all 0.4s;
	box-sizing: border-box;
}
.windowShow {
	bottom: 0;
}
.menuimg {
	width: 45upx;
	height: 45upx;
}
.menuinsidecontent {
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	padding: 20upx;
}
.text {
	font-size: 24upx;
	margin-top: 30upx;
}
.menu-bar {
	flex-direction: row-reverse;
	padding-right: 50upx;
	/* position: absolute; */
	bottom: 0;
	padding: 10upx 0;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-around;
}
</style>
