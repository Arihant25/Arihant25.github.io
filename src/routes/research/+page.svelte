<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="mx-auto flex flex-col items-center p-4 py-12 sm:px-6 lg:px-8">
	<h1
		class="mb-6 w-full text-center text-7xl font-bold sm:text-8xl lg:text-8xl"
	>
		Research<span class="orange">.</span>
	</h1>

	<div
		class="coming-soon-section relative mx-auto my-12 max-w-md rounded-lg border p-6 text-center shadow-lg"
	>
		<p class="text-2xl leading-relaxed">Coming Soon!</p>
		<p class="leading-relaxed">
			I haven't published any research papers yet, but when I do, you'll find them here.
		</p>
	</div>
</div>
