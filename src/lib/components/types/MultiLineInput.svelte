<script lang="ts">
    import type { EditorField } from "scalar-types";
    import { onMount } from "svelte";
    import Label from "../Label.svelte";

    let {
        field,
        data = $bindable(),
        ready,
    }: { field: EditorField; data: any; ready: () => void } = $props();

    onMount(() => {
        ready();
    });

    $inspect(data);
</script>

<Label {field}>
    <textarea class="input-base p-1" id={field.name} bind:value={data}
    ></textarea>
</Label>
