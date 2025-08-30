<script lang="ts">
  import { fly } from "svelte/transition";
  // import rawData from "../../public/data.json";
  import type { Id, Item, DataItem } from "./types";
  import FolderButton from "./FolderButton.svelte";
  import LinkButton from "./LinkButton.svelte";
  import editMethods from "../lib/editMethods.ts"; 
  import { login } from "../state/Login.svelte.ts";
  import ShareModal from "./ShareModal.svelte";

  let {
    isEditable,
    isNewTree,
    rawData,
    url,
    title = ""
  }: { isEditable: boolean; isNewTree: boolean; rawData: DataItem[]; url?: string; title?: string} = $props();


  const data = rawData as unknown as Item[] || [];

  if (data.length === 0) {
    throw new Error("Unexpected empty rawData");
  }

  let currentCat: Item[] = $state(
    data.filter(item => item.parent === data[0]?.id)
  );

  let shareModalOpen = $state(false);


  let currentParent: Id = $state(data[0]?.id);

  let prevCats: Id[] = $state([]);
  let currentNestingCount: number = $state(0);
  let isGoingBack: boolean = $state(false);
</script>



<div class="relative min-w-full">

  {#if isEditable}
    <div class="mb-6">
      <input
      bind:value={title}
      type="text"
      placeholder="Enter title"
      class="w-full p-3 bg-gray-900/50 border border-green-700/50 rounded-lg text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 backdrop-blur-sm"
      />
    </div>
  {/if}

  {#key prevCats}
    <div
      class="subCat absolute w-full"
      in:fly={{ x: isGoingBack ? -350 : 350, duration: 300 }}
      out:fly={{ x: isGoingBack ? 350 : -350, duration: 300 }}
    >
      {#if currentNestingCount > 0}
        <button
          aria-label="Go Back"
          class="bg-gray-900  mb-4 rounded-full text-[lavender] hover:brightness-110 transition-all duration-300 p-2 cursor-pointer"
          onclick={() => {
            isGoingBack = true;
            const currParent = prevCats.pop();
            prevCats = [...prevCats];
            currentCat = data.filter((i) => i.parent === currParent);
            currentNestingCount--;
          }}
        > 
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
      {/if}

      {#each currentCat as item}
        <div class="item relative">
          {#if isEditable}
            <div class="absolute top-[-0.625rem] right-[-0.625rem] z-10">
              <button
                type="button"
                aria-label="Delete item"
                class="w-5 h-5 flex items-center justify-center rounded-full cursor-pointer bg-red-600/90 text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
                onclick={(e) => {
                  e.stopPropagation();
                  currentCat = currentCat.filter((i) => i.id !== item.id);

                  const idx = data.findIndex((i) => i.id === item.id);
                  if (idx > -1) data.splice(idx, 1);
                  editMethods.deleteItem(item.id);
                
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          {/if}
          {#if item.type == "link"}
            <LinkButton {item} {isEditable} {editMethods} />
          {:else if item.type == "folder"}
            <FolderButton
              {item}
              {data}
              bind:prevCats
              bind:currentCat
              bind:currentParent
              bind:currentNestingCount
              bind:isGoingBack
              {isEditable}
              {editMethods}
            />
          {/if}
        </div>
      {/each}

      {#if isEditable}
        <div class="edit-controls flex flex-col md:flex-row gap-2">
          <button class="bg-green-600"
            onclick={() => {
              const newItem: Item = {
                id: Date.now(),
                text: "New Link",
                url: "https://example.com",
                type: "link",
                parent: currentParent,
              };
              currentCat = [...currentCat, newItem];
              data.push(newItem);
              if (editMethods && editMethods.addItem) {
                editMethods.addItem(newItem);
              }
            }}
          >Add Link</button>
          <button class="bg-gray-900"
            onclick={() => {
              const newItem: Item = {
                id: Date.now(),
                text: "New Folder",
                type: "folder",
                parent: currentParent,
              };
              currentCat = [...currentCat, newItem];
              data.push(newItem);
              if (editMethods && editMethods.addItem) {
                editMethods.addItem(newItem);
              }
            }}
          >Add Folder</button>
        </div>
        <button
          type="button"
          class="flex items-center gap-1 bg-green-800 mt-4 ml-auto text-white text-md rounded-md px-2 py-1 cursor-pointer border border-green-700 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onclick={async(e) => {
            
            if (!login.user && login.wannaLogin){
              login.openWarningModal();
              return;
            }

            const btn = (e.target) as HTMLButtonElement;
            btn.disabled = true;
            btn.innerHTML = '<svg class="animate-spin h-4 w-4 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Submitting...';
            
            url = await editMethods.submitChanges(isNewTree, title, url);
            
            btn.disabled = false;
            btn.innerHTML = 'Submit';
            shareModalOpen = true;

          }}
        >
          Submit
        </button>
      {/if}
    </div>
  {/key}
</div>
<ShareModal url={url} isOpen={shareModalOpen} />
