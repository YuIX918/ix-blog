import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!, // ← 最後に「!」を追加
  apiKey: process.env.MICROCMS_API_KEY!, // ← こちらも！
});