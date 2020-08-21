<template>
		<div id="app">
			<transition name="fade" mode="out-in">
				<div key="is-loading-success">
					<Layout/>
				</div>
			</transition>
		</div>
</template>

<script>
import VueExtendLayouts from 'vue-extend-layout'

export default {
	name: 'App',
	components: {
		Layout: VueExtendLayouts
	},
	created(){
	},
	methods: {
	}
}
</script>
<style lang="scss" >
	.app-loading ,.app-error{
		height: 100vh;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #ffff;
	}
</style>
