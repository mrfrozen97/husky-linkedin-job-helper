import esbuild from "esbuild";

esbuild.build({
  entryPoints: ["src/content/content.js"],
  bundle: true,
  outfile: "dist/content.js",
  format: "iife",
}).catch(() => process.exit(1));
