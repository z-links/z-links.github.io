<script>
  import { fly } from "svelte/transition";
  import data from "../../public/data.json";

  let currentCat = $state(data);
  let prevCats = $state([]);
  let currentNestingCount = $state(0);
  let isGoingBack = $state(false);
</script>

<div class="relative min-w-full">
    {#key currentCat}
      <div
        class="subCat absolute w-full"
        style="transform-origin: center; will-change: transform; backface-visibility: hidden; -webkit-backface-visibility: hidden;"
        in:fly={{ x: isGoingBack ? -350 : 350, duration: 300 }}
        out:fly={{ x: isGoingBack ? 350 : -350, duration: 300 }}
      >
        {#if currentNestingCount > 0}
          <button
            aria-label="Go Back"
            class="bg-gray-900 mb-4 rounded-full text-[lavender] hover:brightness-110 transition-all duration-300 p-2 cursor-pointer"
            onclick={() => {
              isGoingBack = true;
              currentCat = prevCats.pop(0);
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
          <div class="item">
            {#if item.type == "link"}
              <a href={item.url}>
                <h2 class="">{item.text}</h2>
                <h3 class="text-green-400 [text-shadow:0_0_8px_#4ade80]">Z-LINK</h3>
              </a>
            {:else if item.type == "category"}
              <button
                class="cat-button"
                onclick={() => {
                  isGoingBack = false;
                  prevCats.push(currentCat);
                  currentNestingCount++;
                  currentCat = item.children;
                }}
              >
                <h2 class="">{item.text}</h2>

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

              </button>
            {/if}
          </div>
        {/each}
      </div>
    {/key}

    
</div>
