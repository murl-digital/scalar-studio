<script lang="ts">
    import type { EditorField } from "scalar-types";
    import { error } from "@sveltejs/kit";
    import Field from "$lib/components/Field.svelte";
    import { onMount } from "svelte";
    import Label from "../Label.svelte";
    import { Combobox } from "bits-ui";

    let {
        field,
        data = $bindable(),
        ready,
    }: { field: EditorField; data: any; ready: () => void } = $props();

    let struct_fields = $derived(
        field.field_type.type === "enum"
            ? (field.field_type.variants.filter(
                  (i) => i.variant_name === data?.type,
              )[0]?.fields ?? [])
            : error(500, "EnumDropdown was given a field that was not an enum"),
    );

    // this ensures that the object always has accurate data
    $effect(() => {
        if (field.field_type.type !== "enum") {
            error(500, "EnumDropdown was given a field that was not an enum");
        }

        if (!data) {
            if (field.field_type.default) {
                data = field.field_type.default;
            } else {
                data = {
                    type: "",
                };
            }
        }

        Object.keys(data)
            .filter((key) => key !== "type")
            .forEach((key) => {
                if (
                    struct_fields &&
                    !struct_fields.map((field) => field.name).includes(key)
                ) {
                    delete data[key];
                }
            });

        if (struct_fields) {
            struct_fields.forEach((i_field) => {
                if (!data[i_field.name]) {
                    data[i_field.name] = null;
                }
            });
        }
    });

    onMount(() => {
        ready();
    });

    let open = $state(false);
    $inspect(data);
</script>

<Label {field}>
    {#if field.field_type.type === "enum"}
        <Combobox.Root bind:value={data.type} bind:open type="single">
            <div class="input-base flex items-center">
                <Combobox.Input
                    defaultValue={data.type}
                    onfocus={() => (open = true)}
                    class="w-full p-1 focus:ring-0 focus:outline-none"
                ></Combobox.Input>
                <Combobox.Trigger class="input-button w-6 h-6 p-1 z-20">
                    <div class="i-ph-caret-down"></div>
                </Combobox.Trigger>

                <Combobox.Portal>
                    <Combobox.Content
                        class="flex gap-1 bg-dark border rounded-sm shadow-md"
                        align="start"
                    >
                        {#each field.field_type.variants as variant}
                            <Combobox.Item
                                class="select-none input-button data-[highlighted]:border-active"
                                value={variant.variant_name}
                            >
                                {variant.variant_name}
                            </Combobox.Item>
                        {/each}
                    </Combobox.Content>
                </Combobox.Portal>
            </div>
        </Combobox.Root>
    {/if}

    {#if struct_fields}
        {#each struct_fields as inner_field}
            <Field
                field={inner_field}
                bind:data={data[inner_field.name]}
                ready={() => {}}
            ></Field>
        {/each}
    {/if}
</Label>
