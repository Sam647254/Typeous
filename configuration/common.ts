import { Configuration } from "webpack";
import { resolve } from "path";

const projectRoot = resolve(__dirname, "..");

const configuraiton: Configuration = {
	entry: {
		beep: resolve(projectRoot, "beep", "main.ts"),
	},
	output: {
		filename: '[name].bundle.js',
		path: resolve(projectRoot, "static")
	},
	resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
    },
    devtool: 'source-map',
    module: {
    	rules: [{ test: /\.tsx?$/, loader: "ts-loader" }]
    },
};

export default configuraiton;