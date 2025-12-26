<script lang="ts">
    import { page } from "$app/state";
    import { goto, invalidateAll } from "$app/navigation";
    import { createContext, setContext } from "svelte";
    import { AlertDialog } from "bits-ui";
    import DeleteDialog from "./DeleteDialog.svelte";
    import { apiFetch } from "$lib/api";
    import { base } from "$app/paths";
    import { toast } from "svelte-sonner";

    const { data, children } = $props();

    const docs = $state(data.docs);
    setContext("docs", () => docs);

    $effect(() => {
        if (data.schema.singleton) {
            if (data.docs.length == 0) {
                goto(`/docs/${page.params.doc}/create`);
            } else if (!page.params.doc_id) {
                goto(`/docs/${page.params.doc}/${data.docs[0].__sc_id}/edit`);
            }
        }
    });
</script>

<div class="flex flex-row h-full w-full">
    {#if !data.schema.singleton}
        <div
            class="b-r-solid b-r-1 overflow-y-scroll px-3 pr-6 h-full max-w-1/6 mt-1"
        >
            <a
                class="sticky top-0 bg-dark p-1 hover:border text-gray no-underline flex flex-row items-center gap-2 z-20"
                href="/docs/{page.params.doc}/create"
            >
                <div class="i-ph-plus"></div>
                Create New
            </a>
            <ul class="flex flex-col pl-0 my-0 gap-1">
                {#each docs as doc, index}
                    {@const label = doc.content
                        ? data.schema.label
                            ? doc.content[data.schema.label]
                            : doc.content[Object.keys(doc.content)[0]]
                        : ""}
                    {@const subLabel = doc.content
                        ? data.schema.sub_label
                            ? doc.content[data.schema.sub_label]
                            : undefined
                        : undefined}
                    <a
                        class="text-gray text-nowrap p-1 hover:border no-underline flex flex-row items-center gap-2"
                        href="/docs/{page.params.doc}/{doc.__sc_id}/edit"
                        ><div class="i-ph-file-text size-8 shrink-0"></div>
                        <div class="flex flex-col overflow-hidden">
                            <span class="text-lg truncate">{label}</span>
                            {#if subLabel}
                                <span class="text-md text-gray-500"
                                    >{subLabel}</span
                                >
                            {/if}
                        </div>
                        <DeleteDialog
                            callback={() => {
                                apiFetch(
                                    fetch,
                                    `${base}/api/docs/${page.params.doc}/${doc.__sc_id}`,
                                    {
                                        method: "DELETE",
                                    },
                                ).then(async (response) => {
                                    if (response.ok) {
                                        await invalidateAll();
                                        toast("deleted item succesfully!");
                                    }
                                });
                            }}
                        ></DeleteDialog>
                    </a>
                {/each}
            </ul>
        </div>
    {/if}
    <div class="h-full w-full">
        {@render children()}
    </div>
</div>
