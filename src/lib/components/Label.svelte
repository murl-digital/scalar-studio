<script lang="ts">
    import type { EditorField } from "scalar-types";
    import { Label } from "bits-ui";
    import type { Snippet } from "svelte";

    let { field, children }: { field?: EditorField; children: Snippet } =
        $props();
</script>

<div class="flex flex-col gap-2">
    {#if field?.title}
        <Label.Root>
            <span>{field?.title}</span>
        </Label.Root>
    {/if}

    {@render children()}
</div>
