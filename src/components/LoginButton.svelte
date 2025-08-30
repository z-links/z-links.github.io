<script lang="ts">
  import { login } from "../state/Login.svelte";

  let button: HTMLButtonElement | null = $state(null);
</script>

{#snippet authButton(actionFunc: () => void, label: string)}
  <button
    bind:this={button}
    class="block self-center justify-self-end text-md bg-green-800 px-2 py-1 border border-green-500 hover:bg-green-700 rounded-md cursor-pointer"
    onclick={(e) => {
      actionFunc();
    }}
  >
    {label}
  </button>
{/snippet}

{#if login.user === null}
  {@render authButton(() => {
    login.authFromMainButton = true;
    login.setIsModalOpen(true);
  }, "Login")}
{:else}
  {@render authButton(() => login.logout(button), "Logout")}
{/if}
