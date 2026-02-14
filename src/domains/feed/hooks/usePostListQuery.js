import { getPosts, getPostsByUsername } from '@/lib/api';
import { FEED_VARIANT, POSTS_PAGE_LIMIT } from '@/lib/constants';
import { queryKeys } from '@/lib/queryKeys';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

const getPostsQueryConfig = (variant, currentUsername) => {
  // 1. 피드 유형별 쿼리 설정을 구성합니다.
  const configs = {
    [FEED_VARIANT.HOME_FEED]: {
      queryKey: queryKeys.posts.all(),
      queryFn: ({ pageParam }) => getPosts(pageParam, POSTS_PAGE_LIMIT),
    },
    [FEED_VARIANT.MY_FEED]: {
      // 2. MY_FEED는 사용자명이 반드시 필요합니다.
      validate: () => {
        if (!currentUsername) {
          throw new Error('currentUsername is required for MY_FEED');
        }
      },
      queryKey: queryKeys.posts.byUser(currentUsername),
      queryFn: ({ pageParam }) =>
        getPostsByUsername(currentUsername, pageParam, POSTS_PAGE_LIMIT),
    },
  };

  const config = configs[variant];

  // 3. 선택된 설정을 검증합니다.
  if (!config) {
    throw new Error('Invalid feed variant');
  }

  if (config.validate) {
    config.validate();
  }

  return config;
};

const usePostListQuery = ({ variant, currentUsername }) => {
  const { queryKey, queryFn } = getPostsQueryConfig(variant, currentUsername);

  // 4. 무한 쿼리를 생성합니다.
  const postListQuery = useSuspenseInfiniteQuery({
    queryKey,
    queryFn,
    initialPageParam: 0,
    // 5. 다음 페이지 규칙을 정의합니다.
    getNextPageParam: (lastPage, allPages, lastPageParam) =>
      lastPage.hasMore ? lastPageParam + 1 : undefined,
  });

  // 6. 화면에서 사용하는 값만 명시적으로 반환합니다.
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    postListQuery;

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export default usePostListQuery;
