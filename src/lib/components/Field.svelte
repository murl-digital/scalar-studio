<script lang="ts">
    import type { EditorField } from "scalar-types";
    import { getComponent, type ComponentMeta } from "$lib/field-component";
    import type { Errors } from "$lib/types";
    import Dyn from "./Dyn.svelte";

    let {
        field,
        errors,
        data = $bindable(),
        ready,
    }: {
        field: EditorField;
        errors?: string | Errors;
        data: any;
        ready: () => void;
    } = $props();

    let meta: Promise<ComponentMeta | null> = $derived(
        getComponent(field.field_type),
    );

    let singleError: string | undefined = $derived(
        typeof errors === "string" ? errors : undefined,
    );

    $inspect(singleError);

    // if (data == null) {
    //     console.log(field.name);
    //     switch (field.field_type.type) {
    //         case "Enum":
    //             if (field.field_type.default) {
    //                 data = field.field_type.default;
    //             } else {
    //                 data = {
    //                     type: "",
    //                 };
    //             }
    //             break;

    //         default:
    //             data = field.field_type.default;
    //             break;
    //     }
    // }
    //
</script>

<div class={[singleError && "border-2 border-red", "p-2"]}>
    {#if singleError}
        <span class="text-red">{singleError}</span>
    {/if}
    <Dyn {field} {meta}>
        {#snippet resolved(meta)}
            <meta.component
                {field}
                errors={typeof errors !== "string" ? errors : undefined}
                bind:data
                ready={() => ready()}
            />
        {/snippet}
    </Dyn>
</div>
