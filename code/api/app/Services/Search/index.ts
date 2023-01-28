import Env from "@ioc:Adonis/Core/Env";
import { MeiliSearch } from "meilisearch";

export const client = new MeiliSearch({ host: Env.get("MEILISEARCH_HOST") });
