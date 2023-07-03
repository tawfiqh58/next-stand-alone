# NextJS Standalone Project

Add `sqlite3` database to your nextjs project with `prisma` ORM to store/retrive data  

$ npm install sqlite3 prisma  

prisma `GUI`  
$ npx prisma studio  

after schema change or the first time : (MUST NEEDED)  

$ npx prisma db push (testing new schema with no migration history)  
or  
$ npx prisma migrate dev (new schema with migration history)  
or  
$ npx prisma migrate reset (cleanup)  

---

POST: api/projects

```json
{
  "mainImage": {
    "src": "/img/image.avif",
    "small": "/img/image-small.avif"
  },
  "slug": {
    "current": "demo-project"
  },
  "categories": [
    {
      "slug": {
        "current": "demo"
      }
    }
  ],
  "title": "Architectural Engineering for your Inspiration",
  "body": "<p>The quick brown fox jumps over the lazy dog.</p>",
  "publishedAt": "2023-06-30T12:00:00Z",
  "createdAt": "2023-06-29T10:30:00Z"
}
```

GET: api/projects  
GET: api/projects/1
