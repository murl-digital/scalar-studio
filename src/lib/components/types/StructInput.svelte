<script lang="ts">
    import type { EditorField } from "scalar-types";
    import { error } from "@sveltejs/kit";
    import Field from "../Field.svelte";
    import { SvelteSet } from "svelte/reactivity";
    import Label from "../Label.svelte";
    import { onMount } from "svelte";

    let {
        field,
        data = $bindable(),
        ready,
        errors,
    }: {
        field: EditorField;
        data: any;
        ready: () => void;
        errors?: [{ field: string; error: string }];
    } = $props();

    let ready_ids = new SvelteSet();

    $inspect(errors);

    if (field.field_type.type === "struct") {
        console.log(data);
        if (!data) {
            data = {};
            for (let iField of field.field_type.fields) {
                console.log("setting field", iField.name);
                data[iField.name] = null;
            }
        }
    } else {
        error(
            500,
            `StructInput got an unexpected type. expected struct, got ${field.field_type.type}`,
        );
    }

    $effect(() => {
        if (field.field_type.type === "struct") {
            if (ready_ids.size === field.field_type.fields.length) {
                ready();
            }
        } else {
            error(
                500,
                `StructInput got an unexpected type. expected struct, got ${field.field_type.type}`,
            );
        }
    });
</script>

<Label {field}>
    {#if field.field_type.type === "struct"}
        <div class="border p-1">
            {#each field.field_type.fields as iField}
                <Field
                    field={iField}
                    bind:data={data[iField.name]}
                    ready={() => ready_ids.add(iField.name)}
                    errors={errors?.find((f) => f.field == iField.name)?.error}
                ></Field>
            {/each}
        </div>
    {/if}
</Label>
