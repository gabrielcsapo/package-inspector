const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const MemoryFileSystem = require("memory-fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackDevServer = require("webpack-dev-server");
const BabiliPlugin = require("babel-minify-webpack-plugin");

module.exports = (report) => {
  return new Promise((resolve, reject) => {
    const output = path.resolve(process.cwd(), "fulcrum");
    const outputFile = path.resolve(output, "index.html");

    fs.writeFileSync(
      path.resolve(output, "report.json"),
      JSON.stringify(report)
    );

    const compiler = webpack({
      entry: path.resolve(__dirname, "..", "src", "index.js"),
      context: path.resolve(__dirname, ".."),
      output: {
        path: output,
        filename: "bundle.js",
      },
      mode: process.env.NODE_ENV || "development",
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              {
                loader: "style-loader",
              },
              {
                loader: "css-loader",
              },
            ],
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ["@babel/env", "@babel/preset-react"],
              },
            },
          },
          {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: [
              {
                loader: "url-loader?limit=10000&mimetype=application/font-woff",
              },
            ],
          },
        ],
      },
      resolve: {
        extensions: [".js", ".json", ".jsx", ".css"],
        modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new BabiliPlugin(),
        new webpack.DefinePlugin({
          "process.env": {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development"),
          },
          report: JSON.stringify(report),
        }),
        new HtmlWebpackPlugin({
          filename: outputFile,
          inlineSource: ".(js|css|eot|woff2|woff|ttf|svg)$",
          template: "./src/template.html",
        }),
      ],
    });

    if (process.env.DEV_FULCRUM) {
      const msf = new MemoryFileSystem();
      compiler.outputFileSystem = msf;

      const server = new WebpackDevServer(compiler, {
        contentBase: output,
        compress: true,
        port: 9000,
      });

      server.listen(8080, "127.0.0.1", () => {
        console.log("Starting server on http://localhost:8080");
      });
    } else {
      compiler.run((err, stats) => {
        console.log(stats);
        if (err || stats.errors) reject(err || stats.errors); // eslint-disable-line

        resolve();
      });
    }
  });
};