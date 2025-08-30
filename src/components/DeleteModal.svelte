<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import { deleteSt } from "../state/Delete.svelte";
</script>

{#if deleteSt.isOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    transition:fade={{ duration: 150 }}
  >
    <div
      class="relative m-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl ring-1 ring-black/5 dark:bg-zinc-900"
      transition:scale={{ start: 0.95, duration: 150 }}
      role="alertdialog"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div class="flex items-start gap-4">
        <div
          class="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/15"
        >
          <!-- Heroicon: exclamation-triangle -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="h-6 w-6 text-red-600 dark:text-red-400"
          >
            <path
              fill-rule="evenodd"
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h2
            id="dialog-title"
            class="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
          >
            Delete Item
          </h2>
          <p
            id="dialog-description"
            class="mt-1 text-sm text-zinc-600 dark:text-zinc-400"
          >
            Are you sure you want to delete this? This action cannot be undone.
          </p>
        </div>
      </div>
      <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          onclick={() => deleteSt.closeModal()}
          type="button"
          class="inline-flex w-full justify-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >Cancel</button
        >
        <button
          type="button"
          onclick={async (e: Event) => {
            (e.target as HTMLButtonElement).innerText = "Deleting....";

            await deleteSt.deleteFunc();
            deleteSt.closeModal();

            (e.target as HTMLButtonElement).innerText = "Delete";
          }}
          class="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
          >Delete</button
        >
      </div>
    </div>
  </div>
{/if}
