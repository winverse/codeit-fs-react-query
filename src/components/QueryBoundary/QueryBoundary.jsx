'use client';

import { Component, Suspense } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import Warn from '@/components/Warn';
import * as styles from './QueryBoundary.css.js';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  // 렌더 단계 오류를 fallback 분기로 전환합니다.
  static getDerivedStateFromError(error) {
    return { error };
  }

  // "다시 시도" 시 경계 상태와 쿼리 에러 상태를 함께 초기화합니다.
  resetErrorBoundary = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }

    return this.props.fallbackRender({
      error,
      resetErrorBoundary: this.resetErrorBoundary,
    });
  }
}

function DefaultErrorFallback({ title, description, onRetry }) {
  return (
    <div className={styles.errorFallback}>
      <Warn variant="big" title={title} description={description} />
      <Button onClick={onRetry} className={styles.retryButton}>
        다시 시도
      </Button>
    </div>
  );
}

function QueryBoundary({
  children,
  pendingFallback,
  errorTitle = '문제가 발생했습니다.',
  errorDescription = '잠시 후 다시 시도해 주세요.',
}) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <DefaultErrorFallback
              title={errorTitle}
              description={errorDescription}
              onRetry={resetErrorBoundary}
            />
          )}
        >
          <Suspense
            fallback={
              pendingFallback || (
                <Loading
                  title="로딩 중입니다..."
                  description="잠시만 기다려주세요."
                />
              )
            }
          >
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

export default QueryBoundary;
