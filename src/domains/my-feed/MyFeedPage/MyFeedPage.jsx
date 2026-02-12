'use client';

import Container from '@/components/Container';
import QueryBoundary from '@/components/QueryBoundary';
import * as styles from './MyFeedPage.css.js';

/*
TODO(2-07): 로그인 분기, 업로드 UI, 내 피드 목록을 연결합니다.
*/

function MyFeedPage() {
  return (
    <Container className={styles.container}>
      <QueryBoundary>{null}</QueryBoundary>
    </Container>
  );
}

export default MyFeedPage;
