import { remove } from "@/utils/fs.ts";
import { distDir, vsixPath } from "@scripts/build/paths.ts";

await Promise.all([remove(distDir), remove(vsixPath)]);

console.log("Cleaned generated extension artifacts.");
