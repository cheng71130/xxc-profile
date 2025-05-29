<template>
	<button type="button" class="button">
		<span class="fold"></span>

		<div class="points_wrapper">
			<i class="point"></i>
			<i class="point"></i>
			<i class="point"></i>
			<i class="point"></i>
			<i class="point"></i>
			<i class="point"></i>
			<i class="point"></i>
			<i class="point"></i>
			<i class="point"></i>
			<i class="point"></i>
		</div>

		<span class="inner">
			<svg
				class="icon"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2.5"
			>
				<polyline points="13.18 1.37 13.18 9.64 21.45 9.64 10.82 22.63 10.82 14.36 2.55 14.36 13.18 1.37"></polyline>
			</svg>
			SHOW MORE
		</span>
	</button>
</template>

<style scoped>
	.button {
		--h-button: 48px;
		--w-button: 340px;
		--round: 2rem;
		cursor: pointer;
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		transition: all 0.25s ease;
		background: radial-gradient(65.28% 65.28% at 50% 100%, rgba(223, 113, 255, 0.7) 0%, rgba(223, 113, 255, 0.1) 100%),
			linear-gradient(0deg, rgba(122, 90, 248, 0.7), rgba(122, 90, 248, 0.7));
		border-radius: var(--round);
		border: none;
		outline: none;
		padding: 12px 24px;
		width: var(--w-button);
		margin: 0 auto;
		margin-bottom: 100px;
	}
	.button::before,
	.button::after {
		content: '';
		position: absolute;
		inset: var(--space);
		transition: all 0.5s ease-in-out;
		border-radius: calc(var(--round) - var(--space));
		z-index: 0;
	}
	.button::before {
		--space: 1px;
		background: linear-gradient(177.95deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%);
	}
	.button::after {
		--space: 2px;
		background: radial-gradient(65.28% 65.28% at 50% 100%, rgba(223, 113, 255, 0.7) 0%, rgba(223, 113, 255, 0.1) 100%),
			linear-gradient(0deg, rgba(122, 90, 248, 0.7), rgba(122, 90, 248, 0.7));
	}
	.button:active {
		transform: scale(0.95);
	}

	.fold {
		z-index: 1;
		position: absolute;
		top: 0;
		right: 0;
		height: 1rem;
		width: 1rem;
		display: inline-block;
		transition: all 0.5s ease-in-out;
		background: radial-gradient(100% 75% at 55%, rgba(223, 113, 255, 0.75) 0%, rgba(223, 113, 255, 0.1) 100%);
		box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
		border-bottom-left-radius: 0.5rem;
		border-top-right-radius: var(--round);
	}
	.fold::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 150%;
		height: 150%;
		transform: rotate(45deg) translateX(0%) translateY(-18px);
		background-color: rgba(232, 232, 232, 0.75);
		pointer-events: none;
	}
	.button:hover .fold {
		margin-top: -1rem;
		margin-right: -1rem;
	}

	.points_wrapper {
		overflow: hidden;
		width: 100%;
		height: 100%;
		pointer-events: none;
		position: absolute;
		z-index: 1;
	}

	.points_wrapper .point {
		bottom: -10px;
		position: absolute;
		animation: floating-points infinite ease-in-out;
		pointer-events: none;
		width: 2px;
		height: 2px;
		background-color: rgba(255, 255, 255, 0.85);
		border-radius: 9999px;
	}
	@keyframes floating-points {
		0% {
			transform: translateY(0);
		}
		85% {
			opacity: 0;
		}
		100% {
			transform: translateY(-55px);
			opacity: 0;
		}
	}
	.points_wrapper .point:nth-child(1) {
		left: 10%;
		opacity: 1;
		animation-duration: 2.35s;
		animation-delay: 0.2s;
	}
	.points_wrapper .point:nth-child(2) {
		left: 30%;
		opacity: 0.7;
		animation-duration: 2.5s;
		animation-delay: 0.5s;
	}
	.points_wrapper .point:nth-child(3) {
		left: 25%;
		opacity: 0.8;
		animation-duration: 2.2s;
		animation-delay: 0.1s;
	}
	.points_wrapper .point:nth-child(4) {
		left: 44%;
		opacity: 0.6;
		animation-duration: 2.05s;
	}
	.points_wrapper .point:nth-child(5) {
		left: 50%;
		opacity: 1;
		animation-duration: 1.9s;
	}
	.points_wrapper .point:nth-child(6) {
		left: 75%;
		opacity: 0.5;
		animation-duration: 1.5s;
		animation-delay: 1.5s;
	}
	.points_wrapper .point:nth-child(7) {
		left: 88%;
		opacity: 0.9;
		animation-duration: 2.2s;
		animation-delay: 0.2s;
	}
	.points_wrapper .point:nth-child(8) {
		left: 58%;
		opacity: 0.8;
		animation-duration: 2.25s;
		animation-delay: 0.2s;
	}
	.points_wrapper .point:nth-child(9) {
		left: 98%;
		opacity: 0.6;
		animation-duration: 2.6s;
		animation-delay: 0.1s;
	}
	.points_wrapper .point:nth-child(10) {
		left: 65%;
		opacity: 1;
		animation-duration: 2.5s;
		animation-delay: 0.2s;
	}

	.inner {
		z-index: 2;
		gap: 12px;
		position: relative;
		width: 100%;
		color: rgba(255, 255, 255, 0.95);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		font-weight: bold;
		line-height: 1.5;
		transition: color 0.2s ease-in-out;
		letter-spacing: 2px;
	}

	.inner svg.icon {
		width: 20px;
		height: 20px;
		transition: fill 0.1s linear;
		margin-bottom: 3px;
	}

	.button:focus svg.icon {
		fill: white;
	}
	.button:hover svg.icon {
		fill: transparent;
		animation: dasharray 1s linear forwards, filled 0.1s linear forwards 0.95s;
	}
	@keyframes dasharray {
		from {
			stroke-dasharray: 0 0 0 0;
		}
		to {
			stroke-dasharray: 68 68 0 0;
		}
	}
	@keyframes filled {
		to {
			fill: white;
		}
	}
</style>
