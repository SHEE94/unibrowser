<template>
	<view class="box">
        <view class="page-content">
			<view class="list-cell">
				<view class="up-btn">
					<view class="cell-label">附件</view>
					<view v-if="paths.length!=0?false:true" class="cell-level"  @click="bingUpFile"><uni-icons type="paperclip" size="16" color="#0098Ef" class="arrowdown"></uni-icons></view>
				</view>
				<view class="uni-list-cell pro-input" v-for="(path,index) in paths" :key="index">							
					<view class="uni-list-cell-db input">
				        <input class="uni-input list-input" name="input" :value="path.slice(path.lastIndexOf('/')+1)" disabled="disabled"/>
					</view>	
					<view class="deleteBtn"  @click="removePro(index)"><uni-icons type="close" size="16" color="#0098Ef" class="arrowdown"></uni-icons></view>
				</view>	
			</view>
			<android-upfile ref="filemanager" @result="resultPath"></android-upfile>
		</view>											
	</view>
</template>
  
<script>
	// import androidUpfile from "@/components/android-upfile/android-upfile.vue";	
	import json from './json.js';		
	export default{
		components: {
			// androidUpfile
		},	
		data() {
			return{
				paths:[],               //本地文件路径
				pathsObj:[]           //服务路劲对象				
			}
		},
		onLoad(){

		},
		methods: {
			bingUpFile:function(){                      //上传文件
			    if(uni.getSystemInfoSync().platform === 'android'){
					uni.showActionSheet({
						itemList: json.filepath,
						success: (res) => { 
							let ind = res.tapIndex;
							if(ind==0){        //常用文件
								this.$eventHub.$on('_singlefile',(data)=>{
									data.forEach((item)=>{
										console.log(item.path)
										this.paths.push(item.path);
									})
									//清除监听，减少资源消耗
									this.$eventHub.$off('_singlefile');
								})							     
								uni.navigateTo({
									url:'/pages/files/single-file?type=ppt'  
								})
							}else if(ind==1){  //本地存储
								this.opeFile();							
							}
						}
					})						
				}else{
					uni.showModal({
						title: "提示",
						content: "暂不支持IOS系统上传本地文件",
						showCancel: false,
						confirmText: "确定"
					})	
				} 		
			},			
			opeFile(){
				this.$refs.filemanager._upFile();	
			},
			resultPath(e){
				console.log(e)
				this.paths.push(e);
			},
            removePro: function(ind){   //删除文件
			    this.paths.splice(ind,1);	
			}									
        },
		onBackPress() {		
       
		},
		onUnload() {

		}		
	}
</script>
<style scoped lang="scss">
	.box{
		margin:15upx 0 0 15upx;
		width:720upx;
		padding-bottom:15upx;
	}
	.page-content{
		width:100%;
		background:#fff;
		padding-bottom:50upx;
		box-shadow:0 0 10upx lightgray;						
	}
	.borderAfter{
		content: " ";
		position: absolute;
		height:1upx;
		right: 0;
		bottom: 0;
		left:30upx;
		border-bottom:1upx solid #ebdfdf;   
		-webkit-transform: scaleY(.4);
		-o-transform: scaleY(.4);
		-moz-transform: scaleY(.4);
		-ms-transform: scaleY(.4);
		transform:scaleY(.4);		
	}	
    .input-item{
		position:relative;
		display:flex;
		flex-direction:column;
		padding:20upx;
		background:#fff;
		font-size:35upx;
		color:#4f4f4f;
		&:after{
			@extend  .borderAfter
		}
		.input-tag{
			font-size:30upx;
			color:#000;
            width:670upx;				
		}
		.input-view{
			height:40upx;
			color:#4f4f4f;
            width:670upx;			
			.typeView{
				font-size:30upx;
				text-align:right;
			}
		}
	}
	.mark-view{
		color:red;
		font-size:27upx;
		text-indent:15upx;
	}
	.end-color{
		font-size:23upx;
		color:#0098EF;
	}
	.list-cell{
	    display:flex;
		flex-direction:column;
		background:#fff;
		.up-btn{
			display:flex;
			flex-direction:row;
			-webkit-justify-content: space-between;
			justify-content: space-between;			
		    padding:25upx 20upx;
			.cell-level{
				color:#0098Ef;
				font-weight:700;
				width:400upx;
				text-align:right;
			}
		}
	}
	.uniBtn{
		display:flex;
		flex-direction:row;
		margin-top:50upx;
		width:100%;
		padding:8px 0;
		.btn-submit{		
			width:90%;
			height:80upx;
			border:none;
			line-height:80upx;
			border-radius:5px;
			padding:0;
			font-size:35upx;
			letter-spacing:2px;
			background:#0098Ef;
			color:#fff;			
		}
	}
	.list-input{
		padding-right:30upx;
	}
	.deleteBtn{
		width:100upx;
		text-align:center;
		border-left:1px solid #ebdfdf;
		.arrowdown{
			float:right;
			margin-right:35upx;
		    color:red !important;			
		}		
	}
	.mask-up{
		position:fixed;
		z-index:999;
		top:0;
		left:0;
		right:0;
		bottom:0;
		background:rgba(0,0,0,0.1);
		display:flex;
		justify-content:center;
		/* display:none; */
	}
	.mask-center{
		position:relative;
		top:150upx;
		width:150upx;
		height:150upx;
		padding:50upx;
		background:#fff;
        box-shadow: 0 0 10upx rgba(0, 0, 0, 0.1);
		border-radius:10upx;		
		text-align:center;
	}
	.mask-img{
		position:absolute;
		top:0;
		left:0;
		width:150upx;
		height:150upx;
		margin-top:-75upx;
		margin-left:-75upx;
		left:50%;
		top:50%;		
		animation:rotateCircle 2s linear infinite;
		-webkit-animation:rotateCircle 2s linear infinite; /*Safari and Chrome*/				
	}
	@-webkit-keyframes rotateCircle{
		0% {
			transform:rotate(0deg);
		}
		50% {
			transform:rotate(180deg);
		}
		100% {
			transform:rotate(360deg);
		}
	}
	.arrowdown{
		float:right;
		margin-right:20upx;
	}
	.progress-value{
		font-size:35upx;
		color:#0098EF;
		line-height:150upx;
	}				
</style>


