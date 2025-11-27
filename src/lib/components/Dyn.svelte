<script lang="ts">
    import type { ComponentMeta } from "$lib/field-component";
    import type { EditorField } from "scalar-types";
    import type { Snippet } from "svelte";

    let {
        meta,
        field,
        resolved,
    }: {
        meta: Promise<ComponentMeta | null>;
        field: EditorField;
        resolved: Snippet<[ComponentMeta]>;
    } = $props();
</script>

{#await meta}
    <div class="i-svg-spinners-90-ring"></div>
{:then meta}
    {#if meta}
        {@render resolved(meta)}
    {:else}
        <div>
            !! WARNING !! component for {field.field_type.component_key ??
                field.field_type.type} not found
        </div>
    {/if}
{:catch ex}
    <span>{JSON.stringify(ex)}</span>
{/await}
