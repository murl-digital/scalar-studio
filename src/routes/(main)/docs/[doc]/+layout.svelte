<script lang="ts">
    import { page } from "$app/state";
    import { goto } from "$app/navigation";

    const { data, children } = $props();

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
            class="b-r-solid b-r-1 overflow-y-scroll px-3 pr-6 h-full min-w-min"
        >
            <a
                class="sticky top-0 bg-dark p-1 hover:border text-gray no-underline flex flex-row items-center gap-2 z-20"
                href="/docs/{page.params.doc}/create"
            >
                <div class="i-ph-plus"></div>
                Create New
            </a>
            <ul class="flex flex-col pl-0 my-0 w-fit gap-1">
                {#each data.docs as doc, index}
                    {@const name = doc.content[Object.keys(doc.content)[0]]}
                    <a
                        class="text-gray p-1 hover:border no-underline flex flex-row items-center gap-2"
                        href="/docs/{page.params.doc}/{doc.__sc_id}/edit"
                        ><div class="i-ph-file-text size-4"></div>
                        {name}</a
                    >
                {/each}
            </ul>
        </div>
    {/if}
    <div class="h-full w-full">
        {@render children()}
    </div>
</div>
