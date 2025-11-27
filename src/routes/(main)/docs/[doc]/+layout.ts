import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";
import { apiFetch } from "$lib/api";
import { base } from "$app/paths";
import type { Item, Schema } from "scalar-types";

export const load: LayoutLoad = async ({ params, fetch }) => {
  let req = await apiFetch(fetch, `${base}/api/docs/${params.doc}`);
  let schema: Schema = await (
    await apiFetch(fetch, `${base}/api/docs/${params.doc}/schema`)
  ).json();

  if (req.status == 404) {
    throw error(404);
  }

  let docs: Item[] = await req.json();

  return {
    schema,
    docs: docs,
  };
};
