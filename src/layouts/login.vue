<template>
    <div>
        Login Layout
        <transition name="fade-in" mode="out-in">
			<router-view />
		</transition>
    </div>
</template>

<script>
export default {
    name: 'Login'
}
</script>