const path = require("path");
const fs = require("fs");
const { log } = require("console");

function walkSync(dir, res, ext) {
  res = res || [];
  let files = fs.readdirSync(dir);
  for (let f of files) {
    if (f.charAt(0) === ".") {
      continue;
    }
    let p = path.join(dir, f);
    let stat = fs.lstatSync(p);
    if (stat.isDirectory()) {
      walkSync(p, res, ext);
    } else if (stat.isFile()) {
      let extF = path.extname(f);
      if (typeof ext === "string") {
        if (extF !== ext) {
          continue;
        }
      } else if (Array.isArray(ext)) {
        if (ext.indexOf(extF) < 0) {
          continue;
        }
      }
      res.push(p);
    }
  }
  return res;
}

const url = __dirname;
const replaceUrl = "https://zhengpj95.github.io/imgdepot";
const featuredImages = [
  "1.客户端知识.png",
  "2.业务处理.png",
  "3.优化能力.png",
  "4.分级标准.png",
];

const list = [];
walkSync(url, list, ".png");

const urlAry = ["# img depot"];
urlAry.push("## 能力介绍");
for (const image of featuredImages) {
  urlAry.push(`![${path.basename(image, ".png")}](${replaceUrl}/${image})`);
}

urlAry.push("## 图片列表");

for (let item of list) {
  if (featuredImages.includes(path.basename(item))) {
    continue;
  }
  item = path.join(item).replace(url, replaceUrl).replaceAll("\\", "/");
  urlAry.push(item);
  // console.log(item);
}

urlAry.push("");
fs.writeFileSync(path.join(__dirname, "README.md"), urlAry.join("\n\n"));
