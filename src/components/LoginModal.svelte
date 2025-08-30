<script lang="ts">
  import supabase from "../lib/supabase";
  import { login } from "../state/Login.svelte.ts";

  let email = $state("");
  let password = $state("");
  let loading = $state(false);
  let error = $state("");

  async function loginWithPassword(e: Event) {
    e.preventDefault();
    error = "";
    if (!supabase) {
      error = "Supabase is not configured.";
      return;
    }
    loading = true;
    try {
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInErr) {
        // If sign-in fails, try to register the user
        const { data: signUpData, error: signUpErr } =
          await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo:
                typeof window !== "undefined"
                  ? window.location.origin
                  : undefined, 
            },
          });

        if (signUpErr) {
          // If already registered, the original failure was likely a wrong password
          if (/already registered/i.test(signUpErr.message)) {
            error = "Incorrect password.";
          } else {
            error = signUpErr.message;
          }
        } else {
          // If no session returned, confirmation email was sent
          if (!signUpData.session) {
            error =
              "Account created. Check your email to confirm your address.";
          }
        }
      }
    } catch (e) {
      error = (e as Error).message;
    } finally {
      loading = false;
    }
  }

  async function signInWithGoogle() {
    error = "";
    if (!supabase) {
      error = "Supabase is not configured.";
      return;
    }
    loading = true;
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      if (err) error = err.message;
    } catch (e) {
      error = (e as Error).message;
    } finally {
      loading = false;
    }
  }
</script>

{#if login.isModalOpen}
  <div
    class="flex fixed z-40 inset-0 h-screen w-screen items-center justify-center"
  >
    <!-- Backdrop -->
    <button
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      onclick={() => login.setIsModalOpen(false)}
      aria-label="CLOSE LOGIN MODAL"
    ></button>

    <!-- Modal panel -->
    <div
      class="relative z-50 w-full max-w-md rounded-xl bg-white shadow-xl ring-1 ring-black/10 dark:bg-neutral-900 dark:ring-white/10"
      role="dialog"
      aria-modal="true"
      tabindex="0"
      aria-label="Login"
    >
      <button
        class="absolute right-3 top-3 rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:hover:bg-neutral-800"
        onclick={() => login.setIsModalOpen(false)}
        aria-label="Close dialog"
      >
        ✕
      </button>
      <div class="p-5">
        <h2
          class="mb-2 pr-10 text-xl font-semibold text-neutral-900 dark:text-neutral-100"
        >
          Sign in or Register
        </h2>
        {#if error}
          <div
            class="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300"
          >
            {error}
          </div>
        {/if}
        <form class="space-y-4" onsubmit={loginWithPassword}>
          <label class="block">
            <span
              class="text-sm font-medium text-neutral-700 dark:text-neutral-200"
              >Email</span
            >
            <input
              class="mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              type="text"
              placeholder="you@example.com"
              bind:value={email}
              autocomplete="email"
              required
            />
          </label>
          <label class="block">
            <span
              class="text-sm font-medium text-neutral-700 dark:text-neutral-200"
              >Password</span
            >
            <input
              class="mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              type="password"
              placeholder="••••••••"
              bind:value={password}
              autocomplete="current-password"
              minlength="6"
              required
            />
          </label>
          <button
            class="inline-flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {#if loading}Signing in…{/if}
            {#if !loading}Sign in{/if}
          </button>
        </form>
        <div class="my-4 flex items-center gap-3">
          <div class="h-px flex-1 bg-neutral-200 dark:bg-neutral-800"></div>
          <span class="text-sm text-neutral-500">or</span>
          <div class="h-px flex-1 bg-neutral-200 dark:bg-neutral-800"></div>
        </div>
        <button
          class="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
          onclick={signInWithGoogle}
          disabled={loading}
          aria-label="Sign in with Google"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M12 10.2v3.6h5.1c-.2 1.3-1.5 3.9-5.1 3.9-3.1 0-5.7-2.6-5.7-5.7S8.9 6.3 12 6.3c1.8 0 3 .8 3.7 1.5l2.5-2.5C16.9 3.8 14.7 3 12 3 6.9 3 2.7 7.2 2.7 12.3S6.9 21.6 12 21.6c6.2 0 8.6-4.3 8.6-6.5 0-.5-.1-.9-.2-1.3H12z"
            />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  </div>
{/if}
