// Import Terser so we can use it
const { minify } = require("terser");

// Import fs so we can read/write files
const fs = require("fs");

// Define the config for how Terser should minify the code
// This is set to how you currently have this web tool configured
const config = {
  compress: {
    dead_code: true,
    drop_console: false,
    drop_debugger: true,
    keep_classnames: false,
    keep_fargs: true,
    keep_fnames: false,
    keep_infinity: false,
  },
  mangle: {
    eval: false,
    keep_classnames: false,
    keep_fnames: false,
    toplevel: false,
    safari10: false,
  },
  module: false,
  sourceMap: false,
  output: {
    comments: "some",
  },
};

const testFolder = __dirname + "/../lib";
var dir = "./build";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
  console.log("folder created");
} else {
  console.log("folder already created");
}

// // Load in your code to minify
// const code = fs.readFileSync(testFolder + "/Chanters.js", "utf8");

// // Minify the code with Terser
// (async () => {
//   const minified = await minify(code, config);
//   console.log(minified);

//   fs.writeFileSync(dir + "/Chanters.js", minified.code);
// })()

// Save the code!

fs.readdirSync(testFolder).forEach(async (fileName, index) => {
  const filePath = testFolder + "/" + fileName;

  const code = fs.readFileSync(filePath, "utf8");

  // Minify the code with Terser
  (async () => {
    const minified = await minify(code, config);
    console.log(minified);

    fs.writeFileSync(dir + "/" + fileName, minified.code);
  })();
});
