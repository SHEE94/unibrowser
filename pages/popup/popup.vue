<template>
	<view class="popup-content">
		<view @click="close" class="mask" :style="{ background: bgcolor }"></view>
		<menu-call v-if="from == 'web'" :tag="tag" :src="src" :text="text" :href="href" :className="className" @close="close" :hostname="hostname"></menu-call>
		<more-menu v-if="from == 'menu'" @close="close"></more-menu>
		<bg-window v-if="from == 'bg'" @close="close"></bg-window>
	</view>
</template>

<script>
import menuCall from '@/components/menu/menu.vue'
import moreMenu from '@/components/moremenu/moremenu.vue'
import bgWindow from '@/components/bgwindow/bgwindow.vue'
export default {
	components:{
		menuCall,moreMenu,bgWindow
	},
	data() {
		return {
			from:'',
			tag:'',
			src:'',
			text:'',
			href:'',
			className:'',
			hostname:'',
			bgcolor:'transparent'
		};
	},
	created() {
		uni.$on('BG-WINDOW', () => {
			this.bgcolor = 'rgba(0,0,0,.5)'
			this.from = 'bg'
		});
	},
	onLoad(options) {
		this.from = options.from
		
		if (options.from == 'web') {
			this.tag = options.type;
			this.src = decodeURIComponent(options.src);
			this.href = decodeURIComponent(options.href);
			
			this.text = options.text;
			this.className = options.className;
			this.hostname = options.hostname
		}else if(options.from == 'back'){
			uni.navigateBack()
		}else if(options.from == 'nav'){
			this.bgcolor = 'rgba(0,0,0,.5)'
			this.from = 'bg'
		}
	},
	methods: {
		close() {
			uni.$emit('POPUP-CLOSE')
			uni.navigateBack();
		}
	}
};
</script>

<style>
page {
	background: transparent;
}
.popup-content {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
}
.mask {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	/* background-color: rgba(0, 0, 0, 0.4); */
}
</style>
