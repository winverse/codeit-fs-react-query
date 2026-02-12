'use client';

import Post from '@/domains/feed/Post';
import { FEED_VARIANT } from '@/lib/constants';
import Button from '@/components/Button';
import { useLoginContext } from '@/contexts/LoginContext';
import usePostListQuery from './usePostListQuery';
import * as styles from './PostList.css.js';

/*
TODO(2-04): React Query 무한 목록으로 전환합니다.
- usePostListQuery를 실제 구현으로 교체
- postsData.pages를 순회해 Post 렌더링
- fetchNextPage/hasNextPage/isFetchingNextPage로 버튼 제어
*/

function PostList({ variant = FEED_VARIANT.HOME_FEED }) {
  const { currentUsername } = useLoginContext();
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostListQuery({ variant, currentUsername });

  const postsPages = postsData?.pages ?? [];

  return (
    <div className={styles.postList}>
      {postsPages.map((postPage) =>
        postPage.results.map((post) => <Post key={post.id} post={post} />),
      )}
      <Button
        onClick={fetchNextPage}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        더 불러오기
      </Button>
    </div>
  );
}

export default PostList;
