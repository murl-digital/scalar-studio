<script lang="ts">
    import type { EditorField } from "scalar-types";
    import { error } from "@sveltejs/kit";
    import Label from "../Label.svelte";
    import { colord, type Colord } from "colord";
    import ColorPicker, { ChromeVariant } from "svelte-awesome-color-picker";
    import { onMount } from "svelte";
    import Wrapper from "./color/Wrapper.svelte";
    import PickerIndicator from "./color/PickerIndicator.svelte";
    import TextInput from "./color/TextInput.svelte";

    let {
        field,
        data = $bindable(),
        ready,
    }: { field: EditorField; data: any; ready: () => void } = $props();

    let isAlpha = $derived(
        field.field_type.type === "struct" &&
            field.field_type.component_key === "color-input"
            ? field.field_type.fields.some((f) => f.name === "a")
            : error(
                  500,
                  `ColorInput got bad input. expected (struct, color-input), got (${field.field_type.type}, ${field.field_type.component_key})`,
              ),
    );

    const convert = (object: {
        r: number;
        g: number;
        b: number;
        a?: number;
    }) => {
        return {
            r: object.r,
            g: object.g,
            b: object.b,
            a: object.a ? object.a / 255 : undefined,
        };
    };

    let rgba = $derived(
        field.field_type.type === "struct" &&
            field.field_type.component_key === "color-input"
            ? data
                ? colord(convert(data)).toRgb()
                : field?.field_type?.default
                  ? colord(convert(field.field_type.default)).toRgb()
                  : null
            : error(
                  500,
                  `ColorInput got bad input. expected (struct, color-input), got (${field.field_type.type}, ${field.field_type.component_key})`,
              ),
    );

    onMount(() => {
        ready();
    });
</script>

<Label {field}>
    <ColorPicker
        bind:rgb={rgba}
        {isAlpha}
        components={{
            wrapper: Wrapper,
            pickerIndicator: PickerIndicator,
            textInput: TextInput,
        }}
        onInput={({ rgb }) => {
            if (rgb) {
                data = isAlpha
                    ? {
                          r: Math.floor(rgb.r),
                          g: Math.floor(rgb.g),
                          b: Math.floor(rgb.b),
                          a: Math.floor(255 * rgb.a),
                      }
                    : {
                          r: Math.floor(rgb.r),
                          g: Math.floor(rgb.g),
                          b: Math.floor(rgb.b),
                      };
            } else {
                data = null;
            }
        }}
        sliderDirection="vertical"
        isDialog={false}
    />
</Label>
