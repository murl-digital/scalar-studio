<script lang="ts">
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
</script>

{#if data.schema.singleton}
    <div class="w-full h-full flex items-center justify-center">
        <div class="i-svg-spinners:ring-resize w-16 h-16"></div>
    </div>
{:else}
    <div class="w-full h-full flex items-center relative">
        <div class="i-ph-arrow-left w-16 h-16 opacity-50"></div>
        <div class="w-16">select a doc to edit..</div>
        <div class="absolute i-ph-file left-1/2 opacity-25 w-32 h-32"></div>
    </div>
{/if}
