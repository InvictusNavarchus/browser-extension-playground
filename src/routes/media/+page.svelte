<script lang="ts">
	import { PageHeader } from '$lib';
	import { browser } from '$app/environment';
	
	let logs = $state<string[]>([]);
	
	// Video state
	let videoSrc = $state('https://www.w3schools.com/html/mov_bbb.mp4');
	let videoElement: HTMLVideoElement | null = null;
	let videoPlaying = $state(false);
	let videoVolume = $state(1);
	let videoCurrentTime = $state(0);
	let videoDuration = $state(0);
	
	// Audio state
	let audioSrc = $state('https://www.w3schools.com/html/horse.ogg');
	let audioElement: HTMLAudioElement | null = null;
	let audioPlaying = $state(false);
	
	// File upload
	let uploadedFiles = $state<File[]>([]);
	let dragOver = $state(false);
	
	// Clipboard
	let clipboardText = $state('Text to copy to clipboard');
	let pastedText = $state('');
	
	// Download
	let downloadFilename = $state('test-file.txt');
	let downloadContent = $state('This is test content for the downloaded file.');
	
	function log(message: string) {
		logs = [...logs, `[${new Date().toLocaleTimeString()}] ${message}`];
	}
	
	function clearLogs() {
		logs = [];
	}
	
	// Video controls
	function playVideo() {
		videoElement?.play();
		videoPlaying = true;
		log('Video: play');
	}
	
	function pauseVideo() {
		videoElement?.pause();
		videoPlaying = false;
		log('Video: pause');
	}
	
	function setVideoVolume(vol: number) {
		if (videoElement) {
			videoElement.volume = vol;
			videoVolume = vol;
			log(`Video: volume set to ${Math.round(vol * 100)}%`);
		}
	}
	
	function seekVideo(time: number) {
		if (videoElement) {
			videoElement.currentTime = time;
			log(`Video: seek to ${time.toFixed(1)}s`);
		}
	}
	
	// Audio controls
	function playAudio() {
		audioElement?.play();
		audioPlaying = true;
		log('Audio: play');
	}
	
	function pauseAudio() {
		audioElement?.pause();
		audioPlaying = false;
		log('Audio: pause');
	}
	
	// File handling
	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			const files = Array.from(input.files);
			uploadedFiles = [...uploadedFiles, ...files];
			files.forEach(file => {
				log(`File selected: ${file.name} (${formatFileSize(file.size)})`);
			});
		}
	}
	
	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
		
		if (event.dataTransfer?.files) {
			const files = Array.from(event.dataTransfer.files);
			uploadedFiles = [...uploadedFiles, ...files];
			files.forEach(file => {
				log(`File dropped: ${file.name} (${formatFileSize(file.size)})`);
			});
		}
	}
	
	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragOver = true;
	}
	
	function handleDragLeave() {
		dragOver = false;
	}
	
	function clearFiles() {
		uploadedFiles = [];
		log('Files cleared');
	}
	
	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
	}
	
	// Clipboard
	async function copyToClipboard() {
		if (!browser) return;
		try {
			await navigator.clipboard.writeText(clipboardText);
			log(`Copied to clipboard: "${clipboardText}"`);
		} catch (error) {
			log(`Clipboard copy failed: ${error}`);
		}
	}
	
	async function pasteFromClipboard() {
		if (!browser) return;
		try {
			pastedText = await navigator.clipboard.readText();
			log(`Pasted from clipboard: "${pastedText}"`);
		} catch (error) {
			log(`Clipboard paste failed: ${error}`);
		}
	}
	
	// Download
	function downloadFile() {
		if (!browser) return;
		const blob = new Blob([downloadContent], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = downloadFilename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		log(`Downloaded: ${downloadFilename}`);
	}
	
	function downloadImage() {
		if (!browser) return;
		const canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 100;
		const ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.fillStyle = '#3b82f6';
			ctx.fillRect(0, 0, 200, 100);
			ctx.fillStyle = 'white';
			ctx.font = '16px Arial';
			ctx.textAlign = 'center';
			ctx.fillText('Test Image', 100, 55);
			
			canvas.toBlob((blob) => {
				if (blob) {
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = 'test-image.png';
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					URL.revokeObjectURL(url);
					log('Downloaded: test-image.png');
				}
			});
		}
	}
	
	// Update video time
	$effect(() => {
		if (browser && videoElement) {
			const handleTimeUpdate = () => {
				videoCurrentTime = videoElement?.currentTime || 0;
			};
			const handleLoadedMetadata = () => {
				videoDuration = videoElement?.duration || 0;
			};
			
			videoElement.addEventListener('timeupdate', handleTimeUpdate);
			videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
			
			return () => {
				videoElement?.removeEventListener('timeupdate', handleTimeUpdate);
				videoElement?.removeEventListener('loadedmetadata', handleLoadedMetadata);
			};
		}
	});
</script>

<PageHeader 
	title="Media & Files" 
	description="Test video/audio controls, file uploads, clipboard access, and file downloads."
>
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Video Player -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>🎬</span>
				Video Player
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test video element controls and events.
			</p>
			
			<div class="space-y-4">
				<video 
					bind:this={videoElement}
					src={videoSrc}
					class="w-full rounded-lg bg-black"
					data-testid="video-player"
				>
					<track kind="captions" />
				</video>
				
				<div class="flex items-center gap-2">
					{#if videoPlaying}
						<button class="btn-secondary" onclick={pauseVideo}>⏸️ Pause</button>
					{:else}
						<button class="btn-primary" onclick={playVideo}>▶️ Play</button>
					{/if}
					
					<div class="flex-1">
						<input 
							type="range" 
							min="0" 
							max={videoDuration}
							value={videoCurrentTime}
							class="w-full"
							oninput={(e) => seekVideo(Number((e.target as HTMLInputElement).value))}
						/>
					</div>
					
					<span class="text-xs text-surface-500 w-20 text-right">
						{Math.floor(videoCurrentTime)}s / {Math.floor(videoDuration)}s
					</span>
				</div>
				
				<div class="flex items-center gap-2">
					<span class="text-sm text-surface-600">Volume:</span>
					<input 
						type="range" 
						min="0" 
						max="1" 
						step="0.1"
						value={videoVolume}
						class="flex-1"
						oninput={(e) => setVideoVolume(Number((e.target as HTMLInputElement).value))}
					/>
					<span class="text-xs text-surface-500">{Math.round(videoVolume * 100)}%</span>
				</div>
			</div>
		</div>
		
		<!-- Audio Player -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>🔊</span>
				Audio Player
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test audio element controls and events.
			</p>
			
			<div class="space-y-4">
				<audio 
					bind:this={audioElement}
					src={audioSrc}
					class="w-full"
					controls
					data-testid="audio-player"
				>
					<track kind="captions" />
				</audio>
				
				<div class="flex gap-2">
					{#if audioPlaying}
						<button class="btn-secondary" onclick={pauseAudio}>⏸️ Pause</button>
					{:else}
						<button class="btn-primary" onclick={playAudio}>▶️ Play</button>
					{/if}
				</div>
				
				<div>
					<label for="audio-src" class="label">Audio Source URL</label>
					<input 
						id="audio-src"
						type="url" 
						class="input" 
						bind:value={audioSrc}
						data-testid="audio-src"
					/>
				</div>
			</div>
		</div>
		
		<!-- File Upload -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>📁</span>
				File Upload
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test file input and drag-and-drop handling.
			</p>
			
			<div class="space-y-4">
				<!-- File Input -->
				<div>
					<label for="file-input" class="label">Select Files</label>
					<input 
						id="file-input"
						type="file" 
						multiple
						class="input"
						onchange={handleFileSelect}
						data-testid="file-input"
					/>
				</div>
				
				<!-- Drag & Drop Zone -->
				<div 
					class="border-2 border-dashed rounded-lg p-8 text-center transition-colors {dragOver ? 'border-primary-500 bg-primary-50' : 'border-surface-300'}"
					ondrop={handleDrop}
					ondragover={handleDragOver}
					ondragleave={handleDragLeave}
					role="region"
					aria-label="File drop zone"
				>
					<p class="text-surface-500">
						{dragOver ? '📥 Drop files here' : '🗂️ Drag & drop files here'}
					</p>
				</div>
				
				<!-- Uploaded Files List -->
				{#if uploadedFiles.length > 0}
					<div class="bg-surface-100 rounded-lg p-4">
						<div class="flex justify-between items-center mb-2">
							<p class="text-sm font-medium text-surface-700">
								Uploaded Files ({uploadedFiles.length})
							</p>
							<button class="text-xs text-red-500 hover:text-red-700" onclick={clearFiles}>
								Clear All
							</button>
						</div>
						<div class="space-y-1 max-h-32 overflow-y-auto">
							{#each uploadedFiles as file}
								<div class="text-sm text-surface-600 flex justify-between">
									<span>{file.name}</span>
									<span class="text-surface-400">{formatFileSize(file.size)}</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
		
		<!-- Clipboard -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>📋</span>
				Clipboard API
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test clipboard read/write operations.
			</p>
			
			<div class="space-y-4">
				<div>
					<label for="clipboard-text" class="label">Text to Copy</label>
					<input 
						id="clipboard-text"
						type="text" 
						class="input" 
						bind:value={clipboardText}
						data-testid="clipboard-text"
					/>
				</div>
				
				<div class="flex gap-2">
					<button class="btn-primary" onclick={copyToClipboard}>
						📋 Copy to Clipboard
					</button>
					<button class="btn-secondary" onclick={pasteFromClipboard}>
						📥 Paste from Clipboard
					</button>
				</div>
				
				{#if pastedText}
					<div class="bg-surface-100 rounded-lg p-4">
						<p class="text-xs text-surface-500 mb-1">Pasted Content:</p>
						<p class="text-sm text-surface-700">{pastedText}</p>
					</div>
				{/if}
			</div>
		</div>
		
		<!-- File Download -->
		<div class="card p-6 lg:col-span-2">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>⬇️</span>
				File Download
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test programmatic file download and blob creation.
			</p>
			
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="space-y-4">
					<div>
						<label for="download-filename" class="label">Filename</label>
						<input 
							id="download-filename"
							type="text" 
							class="input" 
							bind:value={downloadFilename}
							data-testid="download-filename"
						/>
					</div>
					
					<div>
						<label for="download-content" class="label">File Content</label>
						<textarea 
							id="download-content"
							class="input min-h-24"
							bind:value={downloadContent}
							data-testid="download-content"
						></textarea>
					</div>
					
					<button class="btn-primary w-full" onclick={downloadFile}>
						⬇️ Download Text File
					</button>
				</div>
				
				<div class="space-y-4">
					<p class="label">Generated Downloads</p>
					<p class="text-sm text-surface-600">Download programmatically generated files.</p>
					
					<div class="space-y-2">
						<button class="btn-secondary w-full" onclick={downloadImage}>
							🖼️ Download Generated Image (PNG)
						</button>
						
						<button 
							class="btn-secondary w-full" 
							onclick={() => {
								const data = JSON.stringify({ test: true, timestamp: Date.now() }, null, 2);
								downloadContent = data;
								downloadFilename = 'data.json';
								downloadFile();
							}}
						>
							📄 Download JSON File
						</button>
						
						<button 
							class="btn-secondary w-full" 
							onclick={() => {
								downloadContent = 'Name,Email,Age\nJohn,john@example.com,30\nJane,jane@example.com,25';
								downloadFilename = 'data.csv';
								downloadFile();
							}}
						>
							📊 Download CSV File
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Activity Log -->
	<div class="card p-6 mt-6">
		<div class="flex items-center justify-between mb-4">
			<h3 class="section-subtitle flex items-center gap-2 mb-0">
				<span>📟</span>
				Media Activity Log
			</h3>
			<button class="btn-secondary text-sm" onclick={clearLogs}>
				Clear
			</button>
		</div>
		
		<div class="bg-surface-900 rounded-lg overflow-hidden">
			<div class="p-4 font-mono text-sm text-green-400 max-h-48 overflow-y-auto">
				{#if logs.length === 0}
					<span class="text-surface-500">No media activity yet...</span>
				{:else}
					{#each logs as log}
						<div class="mb-1">{log}</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</PageHeader>
