<script>
  import { login } from "../state/Login.svelte";

  function handleLogin() {
    login.warningModalOpen = false;
  }

  function handleContinueWithoutLogin() {
    login.warningModalOpen = false;
    login.wannaLogin = false;
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      login.warningModalOpen = false;
    }
    login.wannaLogin = false;
  }
</script>

{#if login.warningModalOpen}
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    onclick={handleBackdropClick}
    role="dialog"
    aria-modal="true"
  >
    <div class="w-full max-w-md rounded-lg bg-gray-950 shadow-xl">
      <div
        class="flex items-center justify-between border-b border-gray-800 p-6"
      >
        <h2 class="m-0 text-xl font-semibold text-gray-100">
          Quick heads up! 🔗
        </h2>
      </div>

      <div class="p-6">
        <p class="mb-4 leading-relaxed text-gray-300">
          We'd love to help you manage your z-links! To edit or update your
          links later, you'll need to be logged in.
        </p>
        <p class="m-0 leading-relaxed text-gray-300">
          Don't worry though - you're welcome to continue without logging in if
          you prefer. Your choice! 😊
        </p>
      </div>

      <div class="flex flex-wrap justify-end gap-3 px-4 pb-6 pt-4 sm:px-6">
        <button
          class="w-full cursor-pointer rounded-md border-none bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 transition-all duration-200 hover:bg-gray-700 sm:w-auto"
          onclick={handleContinueWithoutLogin}
        >
          Continue Without Login
        </button>
        <button
          class="w-full cursor-pointer rounded-md border-none bg-green-500 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-green-600 sm:w-auto"
          onclick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  </div>
{/if}
