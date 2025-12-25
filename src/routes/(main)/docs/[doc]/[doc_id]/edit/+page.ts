import type { Schema } from "scalar-types";
import type { Item } from "scalar-types";
import type { PageLoad } from "./$types";
import { apiFetch } from "$lib/api";
import { base } from "$app/paths";

export const load: PageLoad = async ({ params, fetch }) => {
  let doc_request = await apiFetch(
    fetch,
    `${base}/api/docs/${params.doc}/${params.doc_id}`,
  );

  let doc: Item = await doc_request.json();

  return {
    isPublished: doc.__sc_published_at != null,
    doc: doc.content,
  };
};
