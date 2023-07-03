import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const {
    method,
    query: { slug },
  } = req;

  switch (method) {
    case 'GET':
      if (slug) {
        return getUserById(req, res);
      } else {
        return getUsers(req, res);
      }
    case 'POST':
      return createUser(req, res);
    case 'PUT':
      return updateUser(req, res);
    case 'DELETE':
      return deleteUser(req, res);
    default:
      return res.status(405).end();
  }
}

async function getUserById(req, res) {
  const { slug } = req.query;

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(slug),
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json(user);
}

async function getUsers(req, res) {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
}

async function createUser(req, res) {
  const { email } = req.body;
  const user = await prisma.user.create({
    data: {
      email,
    },
  });
  res.status(201).json(user);
}

async function updateUser(req, res) {
  const { id, email } = req.body;

  const userExists = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!userExists) {
    return res.status(404).json({ error: 'User not found' });
  }

  const user = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: {
      email,
    },
  });
  res.status(200).json(user);
}

async function deleteUser(req, res) {
  let _id = null;

  const { id } = req.query;
  _id = id;
  if (!_id) {
    const { slug } = req.query;
    _id = slug;
  }

  const userExists = await prisma.user.findUnique({
    where: {
      id: parseInt(_id),
    },
  });

  if (!userExists) {
    return res.status(404).json({ error: 'User not found' });
  }

  await prisma.user.delete({
    where: {
      id: parseInt(_id),
    },
  });

  res.status(204).end();
}
