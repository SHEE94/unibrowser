<template>
	<view>
		<view class="uni-padding-wrap uni-common-mt">
			<text style="padding: 30upx;">./script/</text>
			
			<!-- <uni-segmented-control :current="current" :values="items" :style-type="styleType" :active-color="activeColor"   @clickItem="onClickItem" /> -->
		</view>
		<view class="content">
			<view v-show="current === 0">
				<view class="cognate-list" v-for="(listData,index) in listDatas" :key="index">
					<view class="cognate-radio"><radio value="cb" :checked="listData.isActive"   @click.prevent="getChange(listData.path)"/></view>
					<view class="cognate-content">
						<view class="work-name" :class="{activeColor:listData.isActive}">{{listData.fileName}}</view>
						<view class="work-cont">
							<view class="work-person">{{listData.size}}</view>
						</view>
					</view>
				</view>
			</view>	
		</view>
		<!-- 无数据页面 -->
		<view class="no_data"  v-if="isData" style="text-align: center;">{{$t("FM.tips.1")}}</view>			
		<view class="uniBtn">
			<button class="btn" type="default" v-if="false">{{$t("FM.tips.2")}}</button>
			<button class="btn btn-submit" :class="{disbled:disbled}"  @click="savePath">{{$t("FM.tips.3")}}</button>
		</view>				
	</view>
</template> 
<script>
	import uniSegmentedControl from './uni-segmented-control/uni-segmented-control.vue';
	var fileFun = require('./getDriFile.js');
	import json from './json.js';
	export default {
		components: {
			uniSegmentedControl
		},
		data() {
			return {
				isData:false,
				disbled:true,
				items: ['script'],
				current:0,	
				activeColor: '#007aff',
				styleType: 'text',											
				listDatas:[],
				tatolLen:0,
				getSDCardPath:null,      //sd卡
				getDataDirectoryPath:null,   //内部存储
				listDatasQq:[],
				listDatasWx:[],
				type:''      //文件类型
			}
		}, 
		mounted(opt={}){
			console.log(opt.type)
			if(opt.type){
			   this.type = opt.type;				
			}
			uni.showLoading({title:this.$t("FM.tips.4"),mask:false});							
            setTimeout(()=>{
				this.getSDCardPath = fileFun.getSDCardPath();   //获得SD卡目录/mnt/sdcard（获取的是手机外置sd卡的路径）
				this.getDataDirectoryPath = fileFun.getDataDirectoryPath();   //获得根目录/data (内部存储路径)	
				this.listDatasWx = fileFun.readSonFilenum(this.getSDCardPath+'/script');   //脚本路径
				// this.listDatasQq = fileFun.readSonFilenum(this.getSDCardPath+'/Android/data/com.tencent.mobileqq/Tencent/QQfile_recv/');         //QQ下载
				// console.log(JSON.stringify(fileFun.readSonFilenum(this.getSDCardPath+'/tencent/QQfile_recv/'))+'qq文件')
				let allDatas = this.listDatasWx.concat(this.listDatasQq);
				// console.log(JSON.stringify(allDatas))
				allDatas.forEach((item,index)=>{
					// console.log(`第${index}个：`+item.fileName)
					//获取最后一个.的位置
					if(item.fileName){
						var index= item.fileName.lastIndexOf(".");
						if(index!=-1){
							//获取后缀
							var ext = item.fileName.substr(index+1);
							
							if(json.docType.indexOf(ext)!=-1){								
								if(this.type==''){
									this.listDatas.push(item);
								}else{
									if(ext==this.type || ext=='pptx'){
										this.listDatas.push(item);							
									}
								}
							}					
						}					
					}
				})
				
				//判断是否有数据
				this.isData = this.listDatas.length ==0;
				uni.hideLoading();	
			},500)
		},
		computed:{
			listDatasWxs(){
				let wx = [];
				this.listDatas.forEach((item)=>{
					if(item.origin == '微信'){
						wx.push(item)
					}
				})
				return wx;
			},
			listDatasQqs(){
				let qq = [];
				this.listDatas.forEach((item)=>{
					if(item.origin == 'QQ'){
						qq.push(item)
					}
				})	
				return qq;			
			}	
		},
		methods: {
			onClickItem(index){
				if (this.current !== index) {
					this.current = index
				}
			},
		    getChange(path,num){					
				this.listDatas.forEach((item)=>{
					// item.isActive = false;
					if(item.path == path){
						item.isActive = !item.isActive
					}
				})
				
				this.tatolLen = this.computedActive();
				if(this.tatolLen!=0){
					this.disbled = false;
				}else{
					this.disbled = true;
				}
				uni.setNavigationBarTitle({
				　　title:this.tatolLen!=0?`已选中(${this.tatolLen}个)`:`文件`
				})				
			},
			computedActive(){
				let len = 0;
				this.listDatas.forEach((item)=>{
					if(item.isActive){
						len++;
					}
				})
				return len;
			},
			savePath(){
				let arr =[];
				this.listDatas.forEach((item)=>{
					if(item.isActive){
						arr.push({'path':item.path,'filename':item.fileName,'active':false})
					}
				})
				console.log(arr)
				uni.$emit('_singlefile',arr);
				uni.setStorageSync('script_dir_file',arr)
				uni.navigateBack()
			}
		},
		onBackPress(){
			uni.$off('_singlefile');
		}
	}
</script>
<style scoped lang="scss">
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #fff
	}

	view {
		font-size: 28upx;
		line-height: inherit
	}
	.content {
		display: flex;
		margin-top:20upx;
		width:100%;
		padding-bottom:120upx;
	}
	.content>view{
		width:100%;
	}
	.uni-common-mt{
		margin:0;
		padding-bottom:20upx;
		padding-top:20upx;
		border-bottom:1px solid #faf4f4;
		background:#fff;
	}
	.cognate-list{
		display:flex;
		flex-direction:row;
		width:100%;
		height:120upx;
		background:#fff;
		border-bottom:1px solid #f6efef;
	}
	.cognate-radio{
		width:80upx;
		height:80upx;
		margin-top:20upx;
		padding-left:20upx;
		padding-right:20upx;
		border-right:1px solid #f6efef;
	}
	.cognate-radio>radio{
        margin-left:20upx;
		margin-top:15upx;
	}
	.cognate-content{
		display:flex;
		flex-direction:column;	
		flex:1;
		--webkit-flex:1;
	}
	.work-name{
		height:70upx;
		color:#4f4f4f;
		text-indent:25upx;
		font-size:35upx;
		line-height:70upx;
		overflow:hidden;
		width:550upx;
		text-overflow:ellipsis;
	    white-space:nowrap;
	}
	.work-cont{
		height:50upx;
		display:flex;
		flex-direction:row;
        -webkit-justify-content: space-between;
		justify-content: space-between;
	}
	.work-person{
		flex:1;
		--webkit-flex:1;
		text-indent:25upx;
		font-size:25upx;
		color:#757575;
		line-height:40upx;
	}
	.activeColor{
		color:#FFCC33 !important;
	}
	.work-notice{
		width:150upx;	
		font-size:25upx;	
		color:skyblue;
		line-height:40upx;	
		text-align:right;
		margin-right:10upx;
	}
	.uniBtn{
		position:fixed;
		bottom:0;
		display:flex;
		flex-direction:row;
		width:100%;
		left:0;
		z-index:100;
		background:#fff;
		padding:8px 0;
		border-top:1px solid #ebdfdf;
		.btn{		
			background:#0098Ef;
			color:#fff;
			width:90%;
			height:80upx;
			border:none;
			line-height:80upx;
			border-radius:5px;
			padding:0;
			font-size:28upx;
			letter-spacing:2px;
			&:after{
				border: 0px solid rgba(0,0,0,0) !important;
			}
		}
	}
	.disbled{
		pointer-events: none;
		color:skyblue !important;
	}					
</style>


