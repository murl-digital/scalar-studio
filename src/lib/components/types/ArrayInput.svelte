<script lang="ts">
    import type { EditorField } from "scalar-types";
    import { error } from "@sveltejs/kit";
    import { getComponent, type ComponentMeta } from "$lib/field-component";
    import { onMount } from "svelte";
    import { flip } from "svelte/animate";
    import { SortableItem } from "svelte-sortable-items";
    import Label from "../Label.svelte";
    import { fade } from "svelte/transition";
    import Dyn from "../Dyn.svelte";

    let {
        field,
        data = $bindable(),
        ready,
    }: { field: EditorField; data: any[]; ready: () => void } = $props();

    let meta: Promise<ComponentMeta | null> = $derived(
        field.field_type.type === "array"
            ? getComponent(field.field_type.of)
            : error(
                  500,
                  `invalid field type ${field.field_type.type}, expected array`,
              ),
    );

    let of: EditorField = $derived(
        field.field_type.type === "array"
            ? {
                  name: "",
                  title: "",
                  required: true,
                  placeholder: null,
                  validator: null,
                  field_type: field.field_type.of,
              }
            : error(
                  500,
                  `invalid field type ${field.field_type.type}, expected array`,
              ),
    );

    let internalArray = $state(
        data.map((v, i) => {
            return { id: i, v: v };
        }),
    );
    let currentHovered = $state(-1);

    $effect(() => {
        if (data == null) {
            data = [];
        }
        data = internalArray.map((v) => v.v);
    });

    onMount(() => {
        ready();
    });
</script>

<Label {field}>
    <ol class="flex flex-col gap-2">
        {#each internalArray as elem, i (elem.id)}
            <li animate:flip={{ duration: 125 }}>
                {/* @ts-ignore: classes are fine here. shut up. */ null}
                <SortableItem
                    propItemNumber={i}
                    bind:propHoveredItemNumber={currentHovered}
                    bind:propData={internalArray}
                    class={[
                        "flex items-center border-base p-2 gap-1",
                        i == currentHovered && "border-active",
                    ]}
                >
                    <div
                        class="i-ph-dots-six-vertical-bold hover:cursor-grab"
                    ></div>
                    <Dyn {meta} field={of}>
                        {#snippet resolved(meta)}
                            <meta.component
                                field={of}
                                bind:data={internalArray[i].v}
                                ready={() => {}}
                            />
                        {/snippet}
                    </Dyn>
                    <button
                        class="input-button"
                        onclick={() => internalArray.splice(i, 1)}
                        >Remove</button
                    >
                </SortableItem>
            </li>
        {/each}
    </ol>
    <button
        class="input-button w-fit"
        onclick={() =>
            internalArray.push({
                id:
                    internalArray.reduce(
                        (a, b) => Math.max(a, b.id),
                        -Infinity,
                    ) + 1,
                v: null,
            })}>Add</button
    >
</Label>
