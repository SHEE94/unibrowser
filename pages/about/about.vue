<template>
	<view class="content">
		<view>{{$t('about')}}：{{version}}</view>
		<rich-text :nodes="node" :selectable="true"></rich-text>
	</view>
</template>

<script>
	
	const app = getApp()
	export default {
		data() {
			return {
				version:'1.0.0',
				node:`<p class="" data-tools-id="85481">
    &nbsp;&nbsp;&nbsp;&nbsp;本应用为开源应用，如果你在任何地方下载了收费版的，都是盗版。
</p>
<p class="" data-tools-id="13138">
    &nbsp;&nbsp;&nbsp;&nbsp;使用本应用源码进行二次开发时，请遵守开源精神，你可以随意修改本应用源码商用或者其他用途而不用经过作者本人同意。<br/>
</p>
<section class="KolEditor" draggable="false" data-tools-id="99289">
    <p>
        &nbsp;&nbsp;&nbsp;&nbsp;GITHUB开源地址：<span style="text-decoration: underline;"><span style="text-decoration: underline; color: rgb(0, 176, 80);"></span><a href="https://github.com/SHEE94/unibrowser" target="_blank"><span style="text-decoration: underline; color: rgb(0, 176, 80);">https://github.com/SHEE94/unibrowser</span></a></span>
    </p>
</section>
<section class="KolEditor" draggable="false" data-tools-id="97524">
    <p>
        &nbsp;&nbsp;&nbsp; &nbsp; 最新版本下载地址：<a href="https://github.com/SHEE94/unibrowser/releases" target="_self"><span style="color: rgb(0, 176, 80);">https://github.com/SHEE94/unibrowser/releases</span></a>
    </p>
</section>
<section class="KolEditor" draggable="false" data-tools-id="88980">
    <p>
        <br/>
    </p>
</section>
<section class="KolEditor" draggable="false" data-tools-id="31397">
    <p class="" data-tools-id="85481">
        &nbsp; &nbsp;
    </p>
    <p enable-zoom="" class="target color_text_1" style="margin-bottom: 8px;zoom: var(--main-zoom-scale);line-height: 21px">
        This app is open source, and if you download a paid version anywhere, you are pirating it.
    </p>
    <p enable-zoom="" class="target color_text_1" style="margin-bottom: 8px;zoom: var(--main-zoom-scale);line-height: 21px">
        When using the source code for secondary development, please abide by the spirit of open source. You are free to modify the source code for commercial or other purposes without the consent of the author.
    </p>
    <p>
        <br/>
    </p>
    <section class="KolEditor" draggable="false" data-tools-id="73512" style="white-space: normal;">
        <p>
            &nbsp;&nbsp;&nbsp;&nbsp;GITHUB Open source address：<span style="text-decoration-line: underline;"><span style="color: rgb(0, 176, 80);"></span><a href="https://github.com/SHEE94/unibrowser" target="_self"><span style="color: rgb(0, 176, 80);">https://github.com/SHEE94/unibrowser</span></a></span>
        </p>
    </section>
    <section class="KolEditor" draggable="false" data-tools-id="65190" style="white-space: normal;">
        <p>
            &nbsp; &nbsp; &nbsp;Download address of the latest version：<a href="https://github.com/SHEE94/unibrowser/releases" target="_self"><span style="color: rgb(0, 176, 80);">https://github.com/SHEE94/unibrowser/releases</span></a>
        </p>
    </section>
    <p>
        <br/>
    </p>
    <p>
        <br/>
    </p>
</section>`
			};
		},
		onLoad() {
			
			let that = this;
			plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
				that.version = widgetInfo.version
			})
		},
		methods:{
			
		}
	}
</script>

<style lang="less">
.content{
	padding: 30upx;
	box-sizing: border-box;
}
</style>
