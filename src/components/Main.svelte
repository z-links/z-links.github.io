<script lang="ts">
  import { login } from "../state/Login.svelte";
  import TreeBase from "./TreeBase.svelte";
  import supabase from "../lib/supabase.ts";
  import type { ItemType } from "./types";
  import { deleteSt } from "../state/Delete.svelte";

  let {
    availableZLinks,
  }: { availableZLinks: Array<{ title: string; url: string }> } = $props();

  availableZLinks = availableZLinks || [];

  const ROOT_ITEM = {
    id: 0,
    text: "Root Folder",
    type: "folder" as ItemType,
    parent: -1,
    user: login.user as string,
  };

  let isEditing = $state(false);

  function createZLink() {
    isEditing = true;
  }
</script>

<div>
  {#if isEditing}
    <TreeBase isEditable isNewTree rawData={[ROOT_ITEM]} />
  {:else if availableZLinks.length > 0}
    {#each availableZLinks as item}
      <div
        class="bg-gray-900 border border-green-600 rounded-lg p-4 mb-3 flex items-center justify-between"
      >
        <h3 class="text-white text-lg">{item.title}</h3>
        <div class="flex gap-1">
          <a
            href={`/${item.url}`}
            class="px-3 py-1 font-semibold hover:text-green-600 text-sm rounded-md transition-colors"
          >
            VIEW
          </a>
          <a
            href={`/edit/${item.url}`}
            class="px-3 py-1 font-semibold bg-green-500/10 hover:bg-gray-800 hover:text-yellow-500 text-sm rounded-md transition-colors"
          >
            EDIT
          </a>
          <button
            onclick={() => {
              deleteSt.openModal(async () => {
                await supabase.functions.invoke("delete_tree", {
                  body: { url: item.url },
                });
                availableZLinks = availableZLinks.filter(
                  (zlink) => zlink.url !== item.url
                );
              });
            }}
            aria-label="Delete Z-Link"
            class="px-3 py-1 hover:bg-gray-950 text-red-700 text-sm rounded-md transition-colors"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
    {/each}
    <button
      class="block px-2 py-1 w-full bg-green-800 border border-green-500 rounded-md cursor-pointer hover:bg-green-700"
      onclick={createZLink}>Create Z-Link</button
    >
  {:else}
    <div
      class="bg-gray-900 border border-green-600 rounded-lg p-4 mb-3 flex flex-col items-center justify-center text-center"
    >
      <h3 class="text-white text-lg mb-2">No Z-Links Available</h3>
      <p class="text-gray-400 mb-4">
        You haven't created any z-links yet. Click the button below to create
        your first one!
      </p>
      <button
        class="block px-2 py-1 w-full bg-green-800 border border-green-500 rounded-md cursor-pointer hover:bg-green-700"
        onclick={createZLink}>Create Z-Link</button
      >
    </div>
  {/if}
</div>
