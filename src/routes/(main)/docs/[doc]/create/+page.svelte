<script lang="ts">
    import Form from "$lib/components/Form.svelte";
    import { apiFetch } from "$lib/api";
    import { goto, invalidateAll } from "$app/navigation";
    import { page } from "$app/state";
    import { tick, untrack } from "svelte";
    import { base } from "$app/paths";
    import { nanoid } from "nanoid";
    import type { EditorField } from "scalar-types";

    const { data } = $props();

    function init(fields: EditorField[]): { [key: string]: any } {
        let result: { [key: string]: any } = {};
        for (let field of fields) {
            result[field.name] = null;
        }
        return result;
    }

    let formData = $state(init(data.schema.fields));
    let ready = $state(false);
    let timeout: number | undefined = $state();

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
            console.log("first change detected!");
            timeout = setTimeout(() => {
                create(init).then((id) =>
                    goto(`./${id}/edit`, {
                        invalidateAll: true,
                        keepFocus: true,
                        noScroll: true,
                    }),
                );
            }, 500);
        }
    });

    async function create(init: RequestInit) {
        let id = nanoid();
        await apiFetch(
            fetch,
            `${base}/api/docs/${page.params.doc}/${id}/drafts`,
            init,
        );

        return id;
    }

    $inspect(formData);
</script>

<div class="w-full h-full flex justify-center">
    <div class="w-full overflow-scroll">
        <div class="mx-auto py-16 max-w-min">
            <Form
                fields={data.schema.fields}
                errors={[]}
                bind:formData
                ready={() => {
                    // this ensures that any pending updates to state that fire on the same tick as this are resolved.
                    // if i dont do this, then spurious changes will be sent to the server
                    tick().then(() => {
                        ready = true;
                        console.log("ready!");
                    });
                }}
            ></Form>
        </div>
    </div>
</div>
