<template>
	<transition
		@before-enter="beforeEnter"
		@enter="enter"
		@after-enter="afterEnter"
		@before-leave="beforeLeave"
		@leave="leave"
		@after-leave="afterLeave"
	>
		<div v-show="!isCollapsed">
			<slot></slot>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'leftRightCollapse',
	props: {
		isCollapsed: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	setup() {
		function beforeEnter(el) {
			el.style.width = '0';
			el.style.overflow = 'hidden';
		}
		function enter(el) {
			el.offsetWidth; // trigger reflow
			el.style.transition = 'width 0.3s ease';
			el.style.width = el.scrollWidth + 'px';
			el.style.overflow = 'hidden';
		}
		function afterEnter(el) {
			el.style.transition = '';
			el.style.width = '';
		}
		function beforeLeave(el) {
			el.style.width = el.scrollWidth + 'px';
			el.style.overflow = 'hidden';
		}
		function leave(el) {
			el.offsetWidth; // trigger reflow
			el.style.transition = 'width 0.3s ease';
			el.style.width = '0';
		}
		function afterLeave(el) {
			el.style.transition = '';
			el.style.width = '';
		}

		return {
			beforeEnter,
			enter,
			afterEnter,
			beforeLeave,
			leave,
			afterLeave,
		};
	},
};
</script>

<style></style>
