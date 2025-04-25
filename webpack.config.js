const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.ts",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|mp3|wav)$/i,
                type: "asset/resource",
                generator: {
                    filename: "assets/[name][ext]",
                },
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
        {
            apply: (compiler) => {
                compiler.hooks.emit.tap("LogEmittedAssets", (compilation) => {
                    console.log("\n--- Webpack Emitted Assets ---");
                    Object.keys(compilation.assets).forEach((asset) => {
                        console.log(asset);
                    });
                    console.log("-----------------------------\n");
                });
            },
        },
    ],
    devServer: {
        static: "./dist",
        hot: true,
    },
};
