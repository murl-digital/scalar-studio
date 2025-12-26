<script lang="ts">
    import { AlertDialog } from "bits-ui";

    let { callback }: { callback: () => void } = $props();

    let open = $state(false);
</script>

<AlertDialog.Root bind:open>
    <AlertDialog.Trigger class="ml-auto hover:border-2 hover:cursor-pointer"
        ><div class="i-ph-x-thin size-4 text-white"></div></AlertDialog.Trigger
    >
    <AlertDialog.Portal>
        <AlertDialog.Overlay
            class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
        />
        <AlertDialog.Content
            class="rounded-card-lg bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 outline-hidden fixed left-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 border p-7 sm:max-w-lg md:w-full "
        >
            <AlertDialog.Title>Are you sure?</AlertDialog.Title>
            <AlertDialog.Description
                >Deleting this document is an <b>irreversible</b> action.</AlertDialog.Description
            >
            <AlertDialog.Cancel class="input-button">Cancel</AlertDialog.Cancel>
            <AlertDialog.Action
                onclick={() => {
                    open = false;
                    callback();
                }}
                class="input-button bg-red-800 !hover:bg-red-600 hover:ring-red-800 focus-visible:ring-red-800"
                >Confirm</AlertDialog.Action
            >
        </AlertDialog.Content>
    </AlertDialog.Portal>
</AlertDialog.Root>
