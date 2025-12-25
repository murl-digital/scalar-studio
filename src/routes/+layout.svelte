<script lang="ts">
    import "@unocss/reset/tailwind-v4.css";
    import "$lib/css/base.css";
    import "$lib/css/splash.css";
    import "uno.css";
    import { Toaster } from "svelte-sonner";

    let { children } = $props();

    $effect(() => {
        let elem = document.getElementById("splash");

        if (elem) {
            elem.setAttribute("data_loaded", "true");
        }
    });
</script>

{@render children()}
<Toaster
    duration={2000}
    position="top-center"
    toastOptions={{
        class: "!bg-zinc-300 !border-purple",
    }}
/>
