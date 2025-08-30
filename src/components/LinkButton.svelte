<script lang="ts">
  import type { Item, EditMethods  } from "./types";
  const { item, isEditable, editMethods }: { item: Item; isEditable: boolean; editMethods: EditMethods } = $props();

</script>

{#if isEditable}
  <div
    role="button"
    tabindex="0"
    class="button w-full flex flex-col p-2 justify-center min-h-14 mb-4 bg-gray-900 rounded-xl text-[lavender] hover:bg-gray-800 transition-colors text-left cursor-pointer"
  >
    <div
      class="flex justify-between items-center"
      aria-label="Edit link"
    >
      <h2
        class="block w-full outline-0 relative text-left"
        contenteditable={true}
        role={"textbox"}
        aria-label={"Edit link text"}
        spellcheck={false}
        onkeydown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            (e.currentTarget as HTMLElement).blur();
          }
        }}
        onblur={(e) => {
          const newText = (e.currentTarget as HTMLElement).innerText;
          if (newText !== item.text) {
            item.text = newText;
            if (editMethods && editMethods.updateItem) {
              editMethods.updateItem(item);
            }
          }
        }}
      >
        {item.text}
      </h2>
      <h3
        class="mx-3 text-green-400 text-sm font-semibold text-nowrap [text-shadow:0_0_8px_#4ade80]"
      >
        URL
      </h3>
    </div>

    <div class="grid-collapse">
      <div>
        <div class="relative flex flex-col gap-2 pt-2">
          <input
            type="url"
            class=" mt-1 w-full rounded bg-transparent border-2 border-green-500 px-3 py-2 outline-none"
            placeholder="https://example.com"
            bind:value={item.url}
          />
        </div>
      </div>
    </div>
  </div>
{:else}
  <a href={item.url} class="item-child p-2">
    <h2 class="">{item.text}</h2>
    <h3
      class="mx-3 text-green-400 text-sm font-semibold text-nowrap [text-shadow:0_0_8px_#4ade80]"
    >
      URL
    </h3>
  </a>
{/if}

<style>
  /* Collapsible area for edit: height animates using grid-template-rows */
  .grid-collapse {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 250ms ease;
  }
  .button:focus-within .grid-collapse {
    grid-template-rows: 1fr;
    margin-top: 0.5rem;
  }
  .grid-collapse > div {
    overflow: hidden;
  }
  

  /* Radiate */

  .button h2.block::before {
    content: "";
    border: 0;
    height: 2px;
    border-radius: 1px;
    background-color: var(--color-green-500);
    position: absolute;
    top: 120%;
    left: 0;
    width: 0;
    transition: width 250ms ease;
  }
  .button:focus-within h2.block::before {
    width: 100%;
  }
</style>
