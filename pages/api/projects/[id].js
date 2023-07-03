import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getProjectById(req, res);
    case 'DELETE':
      return deleteProject(req, res);
    default:
      return res.status(405).end();
  }
}

async function getProjectById(req, res) {
  const { id } = req.query;

  const project = await prisma.project.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      mainImage: true,
      slug: true,
      categories: true,
    },
  });

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  res.status(200).json(project);
}

async function deleteProject(req, res) {
  const { id } = req.query;

  const projectExists = await prisma.project.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!projectExists) {
    return res.status(404).json({ error: 'Project not found' });
  }

  await prisma.project.delete({
    where: {
      id: parseInt(id),
    },
  });

  res.status(204).end();
}
