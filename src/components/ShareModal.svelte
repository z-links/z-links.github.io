<script>
let { url, isOpen = $bindable(false) } = $props();

function closeModal() {
    isOpen = false;
    window.location.href = '/';
}

function copyToClipboard() {
    navigator.clipboard.writeText(`https://zlinks.netlify.app/${url}`);
}

function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
        closeModal();
    }
}
</script>

{#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onclick={handleBackdropClick}>
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div class="flex justify-between items-center p-6 border-b border-zinc-800">
                <h3 class="text-xl font-semibold text-zinc-100">Share Link</h3>
                <button aria-label="close" class="text-zinc-500 hover:text-zinc-300 transition-colors duration-200 w-8 h-8 rounded-full hover:bg-zinc-800 flex items-center justify-center" onclick={closeModal}>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div class="p-6">
                <div class="flex gap-3 flex-wrap">
                    <input type="text" value={`https://zlinks.netlify.app/${url}`} readonly class="flex-1 px-4 py-3 border border-zinc-700 rounded-lg bg-zinc-800 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent selection:bg-green-500/30" />
                    <button onclick={copyToClipboard} class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                        Copy
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

