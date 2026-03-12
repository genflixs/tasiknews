const fs = require("fs")
const path = require("path")

const API="https://newsapi.org/v2/top-headlines?country=id&pageSize=12&apiKey=9f8af9f4b277493c842c02e16441214f"

const articleDir=path.join(__dirname,"../articles")

if(!fs.existsSync(articleDir)){
fs.mkdirSync(articleDir)
}

function slugify(text){
return text
.toLowerCase()
.replace(/[^\w ]+/g,"")
.replace(/ +/g,"-")
}

function rewrite(text){

if(!text) return ""

return text
.replace(/menurut/gi,"berdasarkan informasi")
.replace(/mengatakan/gi,"menjelaskan")
.replace(/laporan/gi,"informasi")
.replace(/terjadi/gi,"berlangsung")
}

function randomImage(){

const imgs=[
"https://picsum.photos/800/500?random=1",
"https://picsum.photos/800/500?random=2",
"https://picsum.photos/800/500?random=3",
"https://picsum.photos/800/500?random=4",
"https://picsum.photos/800/500?random=5",
"https://picsum.photos/800/500?random=6",
"https://picsum.photos/800/500?random=7",
"https://picsum.photos/800/500?random=8"
]

return imgs[Math.floor(Math.random()*imgs.length)]
}

function template(title,content,img,source){

return `
<!DOCTYPE html>
<html lang="id">

<head>

<meta charset="UTF-8">

<title>${title} | Tasik News</title>

<meta name="viewport" content="width=device-width,initial-scale=1">

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

h1{
font-size:28px;
}

img{
width:100%;
border-radius:6px;
margin-bottom:20px;
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

const res=await fetch(API)
const data=await res.json()

let list=[]

for(const art of data.articles){

const title=rewrite(art.title)
const content=rewrite(art.description||art.content||"")

const slug=slugify(title)

const img=randomImage()

const file=slug+".html"

const html=template(title,content,img,art.source.name)

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

console.log("News generated:",list.length)

}

generate()