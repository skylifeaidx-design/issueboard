'use client';

import { useState, useEffect } from 'react';
import { GitLabIssue } from '@/types/issue';
import IssueBoard from '@/components/IssueBoard';

export default function IssuesDashboardPage() {
  const [token, setToken] = useState<string | null>(null);
  const [inputToken, setInputToken] = useState('');
  const [issues, setIssues] = useState<GitLabIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved token on mount
    const savedToken = localStorage.getItem('gitlab_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchIssues(token);
    }
  }, [token]);

  const fetchIssues = async (currentToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const projectId = encodeURIComponent('manage/2022');
      let url = `https://gitlab.skylife.co.kr/api/v4/projects/${projectId}/issues?state=opened&per_page=100`;
      let allIssues: GitLabIssue[] = [];

      while (url) {
        const response = await fetch(url, {
          headers: {
            'PRIVATE-TOKEN': currentToken,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('gitlab_token');
            setToken(null);
            throw new Error('토큰이 유효하지 않거나 만료되었습니다. 다시 입력해주세요.');
          }
          throw new Error(`GitLab API 에러: ${response.status}`);
        }

        const data: GitLabIssue[] = await response.json();
        allIssues = allIssues.concat(data);

        const linkHeader = response.headers.get('link');
        let nextUrl = null;
        if (linkHeader) {
          const match = linkHeader.match(/<([^>]+)>; rel="next"/);
          if (match) {
            nextUrl = match[1];
          }
        }
        url = nextUrl || '';
      }

      setIssues(allIssues);
    } catch (err: any) {
      setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputToken.trim()) return;
    localStorage.setItem('gitlab_token', inputToken.trim());
    setToken(inputToken.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem('gitlab_token');
    setToken(null);
    setIssues([]);
  };

  if (!token) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--background)' }}>
        <form onSubmit={handleSaveToken} className="card" style={{ padding: '32px', maxWidth: '400px', width: '100%' }}>
          <h2 style={{ margin: '0 0 16px 0' }}>GitLab 인증</h2>
          <p style={{ color: 'var(--ink-muted)', fontSize: '14px', marginBottom: '24px' }}>
            대시보드를 보려면 GitLab Personal Access Token을 입력해주세요. 토큰은 브라우저에만 안전하게 저장됩니다.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500 }}>API Token</label>
            <input 
              type="password" 
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="738pfz..."
              style={{ padding: '12px', border: '1px solid var(--line)', borderRadius: 'var(--radius)', fontSize: '14px' }}
              required
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600, cursor: 'pointer' }}>
            접속하기
          </button>
        </form>
      </div>
    );
  }

  if (loading && issues.length === 0) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ink-muted)' }}>이슈 데이터를 불러오는 중입니다...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>
        <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'var(--surface-strong)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', cursor: 'pointer' }}>
          토큰 재설정
        </button>
      </div>
    );
  }

  const inProgress: GitLabIssue[] = [];
  const pending: GitLabIssue[] = [];
  const readyForDeploy: GitLabIssue[] = [];

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  issues.forEach(issue => {
    if (issue.labels.includes('진행중')) {
      inProgress.push(issue);
    } 
    else if (issue.labels.includes('작업 대기')) {
      const createdAt = new Date(issue.created_at);
      if (createdAt >= twoMonthsAgo) {
        pending.push(issue);
      }
    }
    else if (issue.labels.includes('배포대기')) {
      readyForDeploy.push(issue);
    }
  });

  return (
    <div className="workspace" style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button onClick={handleLogout} style={{ padding: '8px 16px', fontSize: '13px', background: 'white', border: '1px solid var(--line)', borderRadius: 'var(--radius)', cursor: 'pointer' }}>
          로그아웃 (토큰 삭제)
        </button>
      </div>
      <IssueBoard 
        inProgress={inProgress}
        pending={pending}
        readyForDeploy={readyForDeploy}
      />
    </div>
  );
}
