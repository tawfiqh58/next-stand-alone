# NextJS stand-alone project

Add `sqlite3` database to your nextjs project with `prisma` ORM to store/retrieve data  

Install

```bash
npm install sqlite3 prisma  
```

To open prisma `GUI`

```bash
npx prisma studio  

```

After schema changes or at the first time : (MUST)

```bash

npx prisma db push # testing new schema with no migration history

npx prisma migrate dev # new schema with migration history  

npx prisma migrate reset # cleanup

```

---

Insert data:

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

Fetch data:

GET: api/projects  
GET: api/projects/1
