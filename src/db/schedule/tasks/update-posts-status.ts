import { prisma } from '../../prisma.client';

const ONE_MONTH = 1000 * 60 * 60 * 24 * 30;
const TWO_WEEKS = 1000 * 60 * 60 * 24 * 7 * 2;

export async function updatePostsStatus() {
  await prisma.post.updateMany({
    where: {
      status: 'ACTIVE',
      comments: {
        every: {
          createdAt: {
            lte: new Date(Date.now() - TWO_WEEKS),
          },
        },
      },
    },
    data: {
      status: 'SUSPENDED',
    },
  });

  await prisma.post.updateMany({
    where: {
      status: 'SUSPENDED',
      comments: {
        every: {
          createdAt: {
            lte: new Date(Date.now() - ONE_MONTH),
          },
        },
      },
    },
    data: {
      status: 'INACTIVE',
    },
  });

  await prisma.post.updateMany({
    where: {
      status: 'SUSPENDED',
      comments: {
        every: {
          createdAt: {
            gt: new Date(Date.now() - TWO_WEEKS),
          },
        },
      },
    },
    data: {
      status: 'ACTIVE',
    },
  });
}
