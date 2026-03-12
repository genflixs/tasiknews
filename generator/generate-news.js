const fs = require("fs")
const fetch = require("node-fetch")

const APIKEY = "9f8af9f4b277493c842c02e16441214f"
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const API =
`https://newsapi.org/v2/top-headlines?country=id&pageSize=30&apiKey=${APIKEY}`

const IMAGE =
"https://picsum.photos/900/500?random="

async function generate(){

const res = await fetch(API)

const data = await res.json()

let posts = []

for(let i=0;i<data.articles.length;i++){

let a=data.articles[i]

let slug=a.title
.toLowerCase()
.replace(/[^a-z0-9]/g,"-")
.slice(0,80)

let image=IMAGE+i

let article =

`Berita terbaru mengenai ${a.title}.

Informasi ini disusun kembali agar lebih mudah dipahami pembaca.

${a.description}

Perkembangan informasi masih terus berlangsung sehingga masyarakat disarankan mengikuti update terbaru dari media terpercaya.`

let html =

`
<html>

<head>

<title>${a.title} | Tasik News</title>

<meta name="description" content="${a.description}">

<script type="application/ld+json">
{
"@context":"https://schema.org",
"@type":"NewsArticle",
"headline":"${a.title}",
"publisher":{
"name":"Tasik News"
}
}
</script>

</head>

<body>

<h1>${a.title}</h1>

<img src="${image}">

<p>${article}</p>

<p>
Sumber:
<a href="${a.url}">
${a.source.name}
</a>
</p>

</body>

</html>
`

fs.writeFileSync(`articles/${slug}.html`,html)

posts.push({

title:a.title,

slug:slug,

image:image,

desc:a.description

})

}

fs.writeFileSync(
"articles/index.json",
JSON.stringify(posts,null,2)
)

}


generate()
