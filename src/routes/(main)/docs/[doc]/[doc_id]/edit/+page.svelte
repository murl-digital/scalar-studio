<script lang="ts">
    import { apiFetch } from "$lib/api";
    import { createContext, getContext, tick, untrack } from "svelte";
    import type { PageData } from "./$types";
    import { wait } from "$lib/utils";
    import { fly, slide } from "svelte/transition";
    import Form from "$lib/components/Form.svelte";
    import { base } from "$app/paths";
    import { page } from "$app/state";
    import DateTimeInput from "$lib/components/types/DateTimeInput.svelte";
    import type { Errors } from "$lib/types";
    import { Popover } from "bits-ui";
    import { invalidate, invalidateAll } from "$app/navigation";
    import type { Item } from "scalar-types";
    import { toast } from "svelte-sonner";

    const { data }: { data: PageData } = $props();

    let formData = $state(data.doc);

    let ready = $state(false);
    let updateAndValidatePromise: Promise<boolean> | undefined = $state();
    let valid = $state(false);
    let validationErrors: Errors = $state([]);
    let timeout: number | undefined = $state();
    const docs: () => Item[] = getContext("docs");

    let label = $derived(
        data.schema.label
            ? formData[data.schema.label]
            : formData[Object.keys(formData)[0]],
    );
    let subLabel = $derived(
        data.schema.sub_label ? formData[data.schema.sub_label] : undefined,
    );

    $effect.pre(() => {
        ready = false;
        formData = data.doc;
    });

    let publishAt = $state();

    $effect(() => {
        clearTimeout(untrack(() => timeout));
        timeout = undefined;

        let init = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        };

        if (untrack(() => ready)) {
            timeout = setTimeout(() => {
                docs()[
                    docs().findIndex((d) => d.__sc_id === page.params.doc_id)
                ].content = formData;
                updateAndValidatePromise = apiFetch(
                    fetch,
                    `${base}/api/docs/${page.params.doc}/${page.params.doc_id}/drafts`,
                    init,
                )
                    .then(validate)
                    .then((value) => wait(500, value))
                    .then((value) => {
                        valid = value;
                        return value;
                    });
                validate();
            }, 500);
        }
    });

    async function validate() {
        return apiFetch(fetch, `${base}/api/docs/${page.params.doc}/validate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        }).then((response) => {
            if (response.ok) {
                return true;
            } else {
                validationErrors = [];
                response.text().then((json) => {
                    try {
                        validationErrors = JSON.parse(json);
                    } catch {
                        console.log("cant even parse data lmao");
                        console.log(json);
                    }
                });
                return false;
            }
        });
    }

    async function publish() {
        await apiFetch(
            fetch,
            `${base}/api/docs/${page.params.doc}/${page.params.doc_id}/publish`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    publish_at: publishAt,
                    doc: formData,
                }),
            },
        );
        await invalidateAll();
        toast("published!");
    }

    async function unpublish() {
        await apiFetch(
            fetch,
            `${base}/api/docs/${page.params.doc}/${page.params.doc_id}/publish`,
            {
                method: "DELETE",
            },
        );
        await invalidateAll();
        toast("unpublished!");
    }

    $inspect(formData);
</script>

<div class="flex flex-col flex-initial w-full h-full">
    <div class="b-t-solid b-b-2 w-full h-32 flex items-center gap-2 p-2">
        <h1>{label}</h1>
        <h2>{subLabel}</h2>
    </div>

    <div class="w-full flex-auto flex justify-center overflow-scroll py-8">
        <div class="max-w-min">
            <Form
                fields={data.schema.fields}
                errors={validationErrors}
                bind:formData
                ready={() => {
                    // this ensures that any pending updates to state that fire on the same tick as this are resolved.
                    // if i dont do this, then spurious changes will be sent to the server
                    tick().then(() => {
                        ready = true;
                        updateAndValidatePromise = validate().then((value) => {
                            valid = value;
                            return value;
                        });
                        console.log("ready!");
                    });
                }}
            />
        </div>
    </div>

    <div class="b-t-solid b-t-2 w-full h-32 flex items-center gap-2 p-2">
        {#await updateAndValidatePromise}
            <div class="size-8 i-svg-spinners-blocks-wave"></div>
        {:then valid}
            <span class="relative flex size-4">
                <span
                    class:bg-green={valid}
                    class:bg-red={!valid}
                    class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                ></span>
                <span
                    class:bg-green={valid}
                    class:bg-red={!valid}
                    class="relative inline-flex size-4 rounded-full"
                ></span>
            </span>
        {/await}
        <span class="input-border rounded-xs flex w-fit gap-1">
            <button
                onclick={publish}
                disabled={!valid}
                class="px-2 py-1 bg-neutral-700 text-white disabled:text-gray not-disabled:hover:bg-neutral-600 transition-all"
            >
                Publish
            </button>
            <Popover.Root>
                <Popover.Trigger
                    aria-label="More publish options"
                    disabled={!valid}
                    class="px-1 py-1 bg-neutral-700 text-white disabled:text-gray not-disabled:hover:bg-neutral-600 transition-all"
                >
                    <div class="i-ph-caret-up"></div>
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content class="border bg-dark p-2">
                        <Popover.Arrow />
                        <div>
                            <DateTimeInput
                                field={{
                                    name: "publish-at",
                                    title: "Publish At",
                                    validator: null,
                                    required: false,
                                    placeholder: null,
                                    field_type: {
                                        type: "date-time",
                                        component_key: null,
                                        default: null,
                                    },
                                }}
                                bind:data={publishAt}
                                ready={() => {}}
                            ></DateTimeInput>
                        </div>
                        <Popover.Close class="input-button">Close</Popover.Close
                        >
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
        </span>
        {#if data.isPublished}
            <button class="input-button" onclick={unpublish}>
                Unpublish
            </button>
        {/if}
    </div>
</div>
