<template>
	<transition name="fade-in" mode="out-in">
		<router-view />
	</transition>
</template>

<script>
	export default {
		name: 'VueLayout'
	}
</script>