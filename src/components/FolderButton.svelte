<script lang="ts">
  import type { Id, Item, EditMethods } from "./types";

  let {
    isEditable = $bindable<boolean>(false),
    isGoingBack = $bindable<boolean>(),
    prevCats = $bindable<Id[]>([]),
    currentNestingCount = $bindable<number>(0),
    currentCat = $bindable<Item[]>([]),
    currentParent = $bindable<Id>(),
    item = $bindable<Item>(),
    data = $bindable<Item[]>([]),
    editMethods,
  }: {
    isEditable: boolean;
    isGoingBack: boolean;
    prevCats: Id[];
    currentNestingCount: number;
    currentCat: Item[];
    currentParent: Id;
    item: Item;
    data: Item[];
    editMethods: EditMethods;
  } = $props();

function expand(){
  isGoingBack = false;
  currentParent = item.id;
  prevCats = [...prevCats, item.parent];
  currentNestingCount++;
  currentCat = data.filter((i) => i.parent === item.id);
}

</script>

<button
  class="cat-button flex justify-around gap-4"
  onclick={() => {
    if (!isEditable) {
      expand();
    }
  }}
>
  <h2
    class="w-full block p-2 focus:outline-green-500"
    contenteditable={isEditable}
    onclick={(e) => {
      if (isEditable) e.stopPropagation();
    }}
    onkeydown={(e) => {
      if (!isEditable) return;
      if (e.key === "Enter") {
        e.preventDefault();
        (e.currentTarget as HTMLElement).blur();
      }
    }}
    onblur={(e) => {
      if (!isEditable) return;
      const el = e.currentTarget as HTMLElement;
      const newText = (el.textContent ?? "").trim();
      if (newText !== item.text) {
        item.text = newText;
        const idx = data.findIndex((i) => i.id === item.id);
        if (idx > -1) data[idx].text = newText;
        if (editMethods?.updateItem) {
          editMethods.updateItem({ ...item });
        }
      }
    }}
  >
    {item.text}
  </h2>

  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    aria-label="Expand"
    class="flex w-12 justify-center items-center h-full"
    onclick={() => {
      if (isEditable) {
        expand();
      }
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
        d="m8.25 4.5 7.5 7.5-7.5 7.5"
      />
    </svg>
  </div>
</button>
