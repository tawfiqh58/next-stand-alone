import prisma from '../../../lib/prisma';
import { v4 as uuidv4 } from 'uuid';
export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getProjects(req, res);
    case 'POST':
      return createProject(req, res);
    case 'PUT':
      return updateProject(req, res);
    default:
      return res.status(405).end();
  }
}

async function getProjects(req, res) {
  const projects = await prisma.project.findMany();
  res.status(200).json(projects);
}

async function createProject(req, res) {
  console.log(req.body);
  const projectId = uuidv4();
  // const project = await prisma.project.create({
  //   data: req.body,
  // });
  // const project = await prisma.project.create({
  //   data: {
  //     mainImage: {
  //       create: {
  //         src: "/img/image.avif",
  //         card: "/img/image-small.avif",
  //       },
  //     },
  //     slug: {
  //       create: {
  //         current: "example-post",
  //       },
  //     },
  //     categories: {
  //       create: [
  //         {
  //           slug: {
  //             create: {
  //               current: "A-post",
  //             },
  //           },
  //         },
  //       ],
  //     },
  //     title:
  //       "Architectural Engineering Wonders of the modern era for your Inspiration",
  //     body: `<p>The quick brown fox jumps over the lazy dog.</p>

  //     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, velit vel bibendum bibendum, sapien sapien bibendum nunc, vel bibendum sapien sapien nec velit. Donec euismod, velit vel bibendum bibendum, sapien sapien bibendum nunc, vel bibendum sapien sapien nec velit.</p>

  //     <p>Here's some <strong>bold text</strong> and some <em>italic text</em>.</p>

  //     <p>Here's a list:</p>
  //     <ul>
  //     <li>Item 1</li>
  //     <li>Item 2</li>
  //     <li>Item 3</li>
  //     </ul>

  //     <blockquote>
  //     <p>The best way to predict the future is to invent it.</p>
  //     </blockquote>

  //     <p>Here's a link: <a href="https://www.google.com/">Google</a></p>

  //     <p>Here's an image:</p>
  //     <p><img src="https://picsum.photos/200/300" alt="alt text" /></p>
  //     `,
  //     excerpt: "This is an example post excerpt.",
  //     publishedAt: new Date("2023-06-30T12:00:00Z"),
  //   },
  // });
  // Route for creating a new project
  try {
    const {
      mainImage,
      slug,
      categories,
      title,
      body,
      excerpt,
      publishedAt,
      createdAt,
    } = req.body;

    // Create the project in the database
    const createdProject = await prisma.project.create({
      data: {
        projectId: projectId,
        mainImage: {
          create: mainImage,
        },
        slug: {
          create: {
            current: slug.current,
            projectId: projectId,
          },
        },
        categories: {
          create: categories.map((category) => ({
            slug: {
              create: {
                current: category.slug.current,
                projectId: projectId,
              },
            },
          })),
        },
        title,
        body,
        excerpt,
        publishedAt: new Date(publishedAt),
        createdAt: new Date(createdAt),
      },
    });

    res.json(createdProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }

  // res.status(201).json(project);
}

async function updateProject(req, res) {
  const { id } = req.body;

  const projectExists = await prisma.project.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!projectExists) {
    return res.status(404).json({ error: 'Project not found' });
  }
  delete req.body.id;
  const project = await prisma.project.update({
    where: {
      id: parseInt(id),
    },
    data: req.body,
  });
  res.status(200).json(project);
}
