const fs = require("fs")
const path = require("path")

const API = "https://newsapi.org/v2/top-headlines?country=id&pageSize=10&apiKey=9f8af9f4b277493c842c02e16441214f"

const articleDir = path.join(__dirname,"../articles")

if(!fs.existsSync(articleDir)){
fs.mkdirSync(articleDir)
}

function slugify(text){
return text
.toLowerCase()
.replace(/[^\w ]+/g,"")
.replace(/ +/g,"-")
}

function randomImage(){

const id=Math.floor(Math.random()*1000)

return `https://picsum.photos/800/500?random=${id}`

}

function createArticle(title,content,img,source){

return `
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">
<title>${title}</title>

<style>

body{
font-family:Arial;
background:#f4f4f4;
margin:0;
}

.container{
max-width:900px;
margin:auto;
background:white;
padding:20px;
}

img{
width:100%;
border-radius:6px;
}

.source{
margin-top:30px;
color:#666;
}

</style>

</head>

<body>

<div class="container">

<h1>${title}</h1>

<img src="${img}">

<p>${content}</p>

<div class="source">
Sumber: ${source}
</div>

</div>

</body>

</html>
`
}

async function generate(){

let articles=[]

try{

const res = await fetch(API)
const data = await res.json()

articles = data.articles || []

}catch(err){

console.log("API gagal, gunakan fallback")

articles = [

{
title:"Berita Teknologi Terbaru",
description:"Perkembangan teknologi terbaru menjadi perhatian banyak pihak di seluruh dunia.",
source:{name:"Tasik News"}
},

{
title:"Ekonomi Global Mengalami Perubahan",
description:"Situasi ekonomi global mengalami dinamika baru yang menarik perhatian para analis.",
source:{name:"Tasik News"}
}

]

}

let list=[]

for(const art of articles){

const title = art.title || "Berita terbaru"
const content = art.description || "Informasi berita terbaru dari berbagai sumber terpercaya."
const source = art.source?.name || "Internet"

const slug = slugify(title)

const img = randomImage()

const file = slug+".html"

const html = createArticle(title,content,img,source)

fs.writeFileSync(
path.join(articleDir,file),
html
)

list.push({

title:title,
file:"articles/"+file,
img:img

})

}

fs.writeFileSync(

path.join(__dirname,"../news.json"),
JSON.stringify(list,null,2)

)

console.log("Artikel dibuat:",list.length)

}

generate()
