import { PostStatus } from '@prisma/client';
import { prisma } from '../../prisma.client';

const ONE_MONTH = 1000 * 60 * 60 * 24 * 30;

export async function updatePostsStatus() {
  await prisma.post.updateMany({
    where: {
      status: PostStatus.PUBLISHED,
      comments: {
        every: {
          createdAt: {
            lte: new Date(Date.now() - ONE_MONTH),
          },
        },
      },
      createdAt: {
        lte: new Date(Date.now() - ONE_MONTH),
      },
    },
    data: {
      status: PostStatus.ARCHIVED,
    },
  });
}
