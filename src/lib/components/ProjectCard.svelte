<script lang="ts">
	interface Project {
		name: string;
		codeUrl: string;
		deployedUrl: string;
		coverImage: string;
		screenshots?: string[];
		description: string;
		shortDescription: string;
		year: number;
		technologies?: string[];
		slug: string;
	}

	interface Props {
		project: Project;
	}

	let { project }: Props = $props();
</script>

<a
	href="/code/{project.slug}"
	class="group block w-80 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/10"
>
	<!-- Project Card Container -->
	<div
		class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:border-gray-200"
	>
		<!-- Project Image Container -->
		<div class="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
			<img
				src={project.coverImage}
				alt={project.name}
				class="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-110"
			/>

			<!-- Gradient Overlay -->
			<div
				class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			></div>

			<!-- Year Badge -->
			<div
				class="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-gray-800 shadow-lg backdrop-blur-sm"
			>
				{project.year}
			</div>

			<!-- Tech Tags Overlay -->
			{#if project.technologies && project.technologies.length > 0}
				<div class="absolute right-4 bottom-4 left-4">
					<div class="flex flex-wrap gap-1.5">
						{#each project.technologies.slice(0, 3) as tech}
							<span
								class="rounded-lg bg-orange-500/95 px-2.5 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
							>
								{tech}
							</span>
						{/each}
						{#if project.technologies.length > 3}
							<span
								class="rounded-lg bg-orange-600/95 px-2.5 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
							>
								+{project.technologies.length - 3}
							</span>
						{/if}
					</div>
				</div>
			{/if}
		</div>

		<!-- Project Info -->
		<div class="space-y-3 p-6">
			<div class="flex items-start justify-between">
				<h3
					class="text-xl leading-tight font-bold text-gray-900 transition-colors duration-300 group-hover:text-orange-600"
				>
					{project.name}
				</h3>

				<!-- Arrow Icon -->
				<div
					class="ml-3 flex-shrink-0 translate-x-2 transform opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
				>
					<svg
						class="h-5 w-5 text-orange-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 17l9.2-9.2M17 17V7H7"
						></path>
					</svg>
				</div>
			</div>

			<p class="text-base leading-relaxed text-gray-600">
				{project.shortDescription}
			</p>

			<!-- Bottom Action Area -->
			<div class="flex items-center justify-between pt-2">
				<span
					class="translate-y-1 transform text-sm font-medium text-orange-600 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
				>
					View Project
				</span>

				<!-- External Links -->
				<div
					class="flex space-x-2 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
				>
					{#if project.codeUrl}
						<a
							href={project.codeUrl}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="View source code on GitHub"
						>
							<div class="h-5 w-5 text-gray-500 transition-colors hover:text-orange-600">
								<svg fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
									/>
								</svg>
							</div>
						</a>
					{/if}
					{#if project.deployedUrl}
						<a
							href={project.deployedUrl}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="View deployed project"
						>
							<div class="h-5 w-5 text-gray-500 transition-colors hover:text-orange-600">
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
									></path>
								</svg>
							</div>
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>
</a>
