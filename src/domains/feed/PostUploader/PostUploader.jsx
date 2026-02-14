'use client';

import PostForm from '@/domains/feed/PostForm';
import { useLoginContext } from '@/contexts/LoginContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadPost } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { toast } from 'react-toastify';

/*
TODO(3-01): 업로드 로직을 뮤테이션으로 구현합니다.
- uploadPost 호출
- mutate 연결 및 isPending으로 버튼 제어

TODO(3-02): 업로드 성공 후 목록 쿼리를 무효화합니다.
- queryKeys.posts.all / queryKeys.posts.byUser 무효화
*/

function PostUploader() {
  const { currentUsername } = useLoginContext();
  const queryClient = useQueryClient()

  const uploadPostMutation = useMutation({
    mutationFn: (newPost) => uploadPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.all(),
      });
      if (currentUsername) {  
        // 현재 사용자의 내 피드 목록도 변경 영향 범위입니다.
        // 현재 키 구조에서는 posts.all()이 prefix 매칭으로 포함하지만,
        // 의도 명시와 키 구조 변경(exact: true 등) 대비를 위해 사용자 키도 함께 무효화합니다.
        queryClient.invalidateQueries({
          queryKey: queryKeys.posts.byUser(currentUsername),
        });
      }
    },
  });

  // 2. 업로드 요청을 뮤테이션으로 실행합니다.
  const handleUploadPost = (newPost) => {
    uploadPostMutation.mutate(newPost, {
      onSuccess: () => {
        toast('포스트가 성공적으로 업로드 되었습니다!');
      },
    });
  };

  if (!currentUsername) return null;

  return <PostForm onSubmit={handleUploadPost} buttonDisabled={false} />;
}

export default PostUploader;
