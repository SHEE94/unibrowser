<template>
	<view style="padding: 30upx;">
		<view class="list">
			<view class="left-info">				
				<view class="label">{{$t("inter.tips.2")}}</view>
			</view>
			<view class="arr">
				<switch :checked="open" @change="changeopen" />
			</view>
		</view>
		<view class="list">
			<view class="left-info"><view class="label">{{$t("inter.tips.3")}}</view></view>
			<view class="arr">
				<picker mode="selector" :range="effect" @change="changeeffect" range-key="name">
					<view>
						{{ effect[effectIndex].name }}
						<text class="iconfont icon-down"></text>
					</view>
				</picker>
			</view>
		</view>
		<view class="list">
			<view class="left-info"><view class="label">{{$t("inter.tips.4")}}</view></view>
			<view class="arr">
				<picker mode="selector" :range="exclude" @change="changeexclude" range-key="name">
					<view>
						{{ exclude[excludeIndex].name }}
						<text class="iconfont icon-down"></text>
					</view>
				</picker>
			</view>
		</view>
		<view class="list">
			<view class="left-info"><view class="label">{{$t("inter.tips.5")}}</view></view>
			<view class="arr">
				<picker mode="selector" :range="mode" @change="changemode" range-key="name">
					<view>
						{{ mode[modeIndex].name }}
						<text class="iconfont icon-down"></text>
					</view>
				</picker>
			</view>
		</view>
		<view style="background-color: #eee;padding: 20upx;">
			<view style="font-size: 28upx;margin-bottom: 20upx;">{{$t("inter.tips.6")}}</view>
			<textarea
				@input="entermacth"
				:value="match"
				:placeholder='$t("inter.tips.16")'
				style="background-color: #fff;width: 100%;height: 400upx;border-radius: 5px;padding: 10upx;box-sizing: border-box;"
			/>
		</view>
		
		<button type="default" style="width: 200upx;height: 80upx;font-size: 30upx;line-height: 80upx;margin: 50upx auto;display: block;" @click="save">{{$t("inter.tips.7")}}</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			effect: [{ name: this.$t('inter.tips.8'), type: 'instant' }, { name:  this.$t('inter.tips.9'), type: 'touchstart' }],
			mode: [{ name: this.$t('inter.tips.10'), type: 'allow' }, { name: this.$t('inter.tips.11'), type: 'reject' }],
			exclude: [{ name: this.$t('inter.tips.12'), type: 'none' }, { name:  this.$t('inter.tips.13'), type: 'redirect' }],
			match: '',
			effectIndex: 0,
			modeIndex: 0,
			excludeIndex: 0,
			open:false
		};
	},
	onLoad() {
		let overriUrl = uni.getStorageSync('overriUrl');
		if(overriUrl){
			this.effectIndex = overriUrl.effectIndex;
			this.modeIndex = overriUrl.modeIndex;
			this.excludeIndex = overriUrl.excludeIndex;
			this.match = overriUrl.match;
			this.open = overriUrl.open;
		}
	},
	onUnload() {
		
	},
	methods: {
		changeeffect(e) {
			this.effectIndex = e.detail.value;
		},
		changemode(e) {
			this.modeIndex = e.detail.value;
		},
		changeexclude(e) {
			this.excludeIndex = e.detail.value;
		},
		changeopen(e){
			this.open = e.detail.value;
		},
		entermacth(e){
			this.match = e.detail.value;
			console.log(this.match)
		},
		save(){
			uni.showModal({
				title:'提示',
				content: this.$t('inter.tips.14'),
				success: (res) => {
					if(res.confirm){
						uni.setStorageSync('overriUrl', {
							effect: this.effect[this.effectIndex].type,
							effectIndex: this.effectIndex,
							mode: this.mode[this.modeIndex].type,
							modeIndex: this.modeIndex,
							exclude:this.exclude[this.excludeIndex].type,
							excludeIndex:this.excludeIndex,
							match:this.match,
							open:this.open
						});
						uni.showToast({
							title: this.$t('inter.tips.15')
						})
					}
				}
			})
		}
	}
};
</script>

<style lang="less">
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
		.label {
			font-size: 26upx;
		}
		.icon {
			margin-right: 10upx;
			font-size: 30upx;
			margin-bottom: -5upx;
		}
	}
	.arr {
		font-size: 26upx;
		color: #666666;
	}
}
</style>
