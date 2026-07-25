import esbuild from "esbuild";
import process from "node:process";

const isProduction = process.argv[2] === "production";

const context = await esbuild.context({
  entryPoints: ["src/main.ts"],
  bundle: true,
  external: ["obsidian"],
  format: "cjs",
  target: "es2018",
  sourcemap: isProduction ? false : "inline",
  logLevel: "info",
  outfile: "main.js",
});

if (isProduction) {
  await context.rebuild();
  await context.dispose();
} else {
  await context.watch();
}

