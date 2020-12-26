const path = require("path");

let config;
try {
  config = require("./config/config.json");
} catch {
  console.error("config/config.json not found! Have you run 'yarn setup'?");
  process.exit(1);
}

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "src", "client"),

  output: {
    path: path.resolve(__dirname, "dist/client"),
    filename: "bundle.js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".ts"],
    modules: [
      path.resolve(__dirname, "src", "client"),
      path.resolve(__dirname, "node_modules"),
    ],
    plugins: [new TsconfigPathsPlugin({ configFile: "tsconfig.client.json" })],
  },
  devServer: {
    historyApiFallback: true,
    proxy:
      process.env.NODE_ENV == "production"
        ? null
        : {
            "/api": {
              target: `http://localhost:${config.port}`,
              secure: false,
            },
          },
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        loader: "babel-loader",
      },
      {
        test: /\.(ts|tsx)?$/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
      },
    ],
  },
};
