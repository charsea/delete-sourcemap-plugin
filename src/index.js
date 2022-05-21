const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
class DeletePlugin {
  /**
   *
   * @param  {import('webpack').Compiler} compiler
   */
  apply(compiler) {
    if (compiler.hooks) {
      compiler.hooks.done.tap("delete-source-map", (stats) => {
        this.removeSoucreMap(stats);
      });
    } else if (compiler.plugin) {
      compiler.plugin("done", (stats) => {
        this.removeSoucreMap(stats);
      });
    } else {
      console.log(
        chalk.yellow("[delete-source-map-plugin] unsupported webpack version!")
      );
    }
  }

  removeSoucreMap() {
    const outputPath = stats.compilation.outputOptions.path;
    let countMatchMapAssets = 0;
    Object.keys(stats.compilation.assets)
      .filter((name) => /\.(?:js|css)\.map$/.test(name))
      .forEach((name) => {
        if (!outputPath) return;
        const filePath = path.resolve(outputPath, name);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          countMatchMapAssets += 1;
          console.log(
            chalk.green(`[delete-source-map-plugin] deleted file: ${name}`)
          );
          fs.unlinkSync(filePath);
        }
      });
    console.log(
      chalk.green(
        `[delete-source-map-plugin] deleted map file: ${countMatchMapAssets} asset(s) processed`
      )
    );
  }
}

module.exports = DeletePlugin;
