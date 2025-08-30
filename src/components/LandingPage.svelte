<script lang="ts">
  import { login } from "../state/Login.svelte";
  import Main from "../components/Main.svelte";
  import supabase from "../lib/supabase";
  import { untrack } from "svelte";

  let zlinks: any[] = $state([]);
  let isLoadingLinks: boolean = $state(false);
  let openTree: boolean = $state(false);

  $effect(() => {
    void login.user;

    untrack(() => {
      if (login.user !== null) {
        isLoadingLinks = true;

        (async () => {
          const { data } = await supabase
            .from("z_link")
            .select("*")
            .eq("user", login.user);

          zlinks = data || [];
          console.log(zlinks, login.user);
          isLoadingLinks = false;
        })();
      }
    });
  });
</script>

{#if isLoadingLinks}
  <main>
    <div class="max-w-5xl px-8 py-8 mx-auto flex justify-center items-center min-h-[50vh]">
      <div class="flex flex-col items-center space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <p class="text-gray-600 text-lg font-medium">Loading your Z-Links...</p>
      </div>
    </div>
  </main>
{:else if login.user === null && !openTree}
  <main>
    <div class="hero relative w-full h-[min(50rem,calc(100vh-4rem))]">
      <img
        src="./hero.webp"
        alt=""
        class="w-full h-full bg-center object-cover"
      />
      <div
        class="hero-overlay absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950/30 to-gray-950"
      ></div>

      <div
        class="content p-8 w-full h-full absolute inset-0 flex flex-col justify-center items-center text-center z-10"
      >
        <h1
          class="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
        >
          Link sharing, <span class="text-green-500">made simple.</span>
        </h1>
        <h3
          class="text-lg md:text-xl text-gray-200 max-w-3xl mb-8 leading-relaxed"
        >
          With Z-links, you can organize all your links into folders, making it
          easy to keep bookmarks, team resources, and projects neatly
          accessible.
        </h3>
        <button
          class="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          onclick={() => (openTree = true)}
        >
          Create your first Z-Link
        </button>
      </div>
    </div>
  </main>
{:else}
  <main>
    <div class="max-w-5xl px-8 py-2 mx-auto">
      <Main availableZLinks={zlinks} />
    </div>
  </main>
{/if}
