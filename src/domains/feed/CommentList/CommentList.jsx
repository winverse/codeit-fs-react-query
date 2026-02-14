'use client';

import Comment from '@/domains/feed/Comment';
import CommentForm from '@/domains/feed/CommentForm';
import * as styles from './CommentList.css.js';
import { useState } from 'react';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys.js';
import { addComment, getCommentsByPostId } from '@/lib/api.js';
import { COMMENTS_PAGE_LIMIT } from '@/lib/constants.js';
import { useEffect } from 'react';
import Button from '@/components/Button/Button.jsx';

/*
TODO(2-10): 댓글 목록 쿼리와 페이지네이션을 구현합니다.
- 댓글 목록 조회 쿼리
- 페이지 전환 및 prefetch 처리

TODO(3-01): 댓글 추가 뮤테이션을 연결합니다.
- addComment mutationFn과 mutate 호출

TODO(3-02): 댓글 추가 성공 후 쿼리를 무효화합니다.
- comments / commentCount 쿼리 무효화
*/

function CommentList({ currentUserInfo, postId }) {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  // 1. 댓글 목록을 페이지 단위로 조회합니다.
  const { data: commentsData } = useSuspenseQuery({
    queryKey: queryKeys.posts.comments(postId, page),
    queryFn: () => getCommentsByPostId(postId, page, COMMENTS_PAGE_LIMIT),
  });

  const addCommentMutation = useMutation({
    mutationFn: (newComment) => addComment(postId, newComment),
    onSuccess: () => {
      // 댓글 작성이 성공하면, 기존 댓글 목록과 개수가 더 이상 유효하지 않다고 표시합니다.
      // 이렇게 하면 즉시 서버에서 최신 데이터를 다시 가져와(Refetch) 화면을 갱신합니다.
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.comments(postId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.commentCount(postId),
      });
    },
  });

  useEffect(() => {
    if (!commentsData?.hasMore) {
      return;
    }
    queryClient.prefetchQuery({
      queryKey: queryKeys.posts.comments(postId, page + 1),
      queryFn: () => getCommentsByPostId(postId, page + 1, COMMENTS_PAGE_LIMIT),
    });
  }, [commentsData?.hasMore, queryClient, postId, page]);

  const comments = commentsData.results;

  const paginationButtons = (
    <div className={styles.pagination}>
      <Button
        disabled={page === 0}
        onClick={() => {
          setPage((old) => Math.max(old - 1, 0));
        }}
        className={styles.paginationButton}
      >
        &lt;
      </Button>
      <Button
        disabled={!commentsData?.hasMore}
        onClick={() => {
          setPage((old) => old + 1);
        }}
        className={styles.paginationButton}
      >
        &gt;
      </Button>
    </div>
  );

  const handleAddComment = (newComment) => {
    setPage(0);
    addCommentMutation.mutate(newComment);
  };

  return (
    <div className={styles.commentList}>
      <div>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
        {comments.length > 0 ? paginationButtons : ''}
      </div>
      <CommentForm
        currentUserInfo={currentUserInfo}
        onSubmit={handleAddComment}
        buttonDisabled={addCommentMutation.isPending}
      />
    </div>
  );
}

export default CommentList;
