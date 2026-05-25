import { installExtension } from "@scripts/build/install-extension.ts";

await installExtension(process.argv.slice(2));
