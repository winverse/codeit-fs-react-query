'use client';

import Container from '@/components/Container';
import * as styles from './MyFeedPage.css.js';
import { useLoginContext } from '@/contexts/LoginContext.jsx';
import NotLoggedInPage from '@/domains/not-logged-in/NotLoggedInPage/NotLoggedInPage.jsx';
import PostUploader from '@/domains/feed/PostUploader/PostUploader.jsx';
import PostList from '@/domains/feed/PostList/PostList.jsx';
import { FEED_VARIANT } from '@/lib/constants.js';
import QueryBoundary from '@/components/QueryBoundary/QueryBoundary.jsx';

/*
TODO(2-07): 로그인 분기, 업로드 UI, 내 피드 목록을 연결합니다.
*/

function MyFeedPage() {
  const { currentUsername } = useLoginContext();

  if (!currentUsername) {
    return <NotLoggedInPage />;
  }

  return (
    <Container className={styles.container}>
      <QueryBoundary>
        {/* 2. 업로드 UI를 먼저 배치합니다. */}
        <PostUploader />
        {/* 3. 내 피드 목록을 연결합니다. */}
        <PostList variant={FEED_VARIANT.MY_FEED} />
      </QueryBoundary>
    </Container>
  );
}

export default MyFeedPage;
