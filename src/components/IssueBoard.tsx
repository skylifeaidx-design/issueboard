'use client';

import { useState } from 'react';
import { GitLabIssue } from '../types/issue';
import IssueColumn from './IssueColumn';

interface IssueBoardProps {
  inProgress: GitLabIssue[];
  pending: GitLabIssue[];
  readyForDeploy: GitLabIssue[];
}

export default function IssueBoard({ inProgress, pending, readyForDeploy }: IssueBoardProps) {
  const [sortKey, setSortKey] = useState<'created_at' | 'updated_at'>('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
            <h1 style={{ fontSize: '24px', margin: 0 }}>홈페이지 이슈 보드</h1>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ink-muted)', fontSize: '14px' }}>
                진행중, 작업대기(2개월 내), 배포대기 이슈 현황입니다.
            </p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ margin: 0 }}>정렬 기준:</label>
            <select 
              value={sortKey} 
              onChange={(e) => setSortKey(e.target.value as any)}
              style={{ padding: '8px', minHeight: 'auto', width: 'auto' }}
            >
              <option value="created_at">생성일</option>
              <option value="updated_at">업데이트일</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ margin: 0 }}>순서:</label>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value as any)}
              style={{ padding: '8px', minHeight: 'auto', width: 'auto' }}
            >
              <option value="desc">최신순 (내림차순)</option>
              <option value="asc">오래된순 (오름차순)</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px',
          alignItems: 'start'
      }}>
        <IssueColumn 
          title="작업 대기" 
          issues={pending} 
          sortKey={sortKey} 
          sortOrder={sortOrder} 
        />
        <IssueColumn 
          title="진행중" 
          issues={inProgress} 
          sortKey={sortKey} 
          sortOrder={sortOrder} 
        />
        <IssueColumn 
          title="배포대기" 
          issues={readyForDeploy} 
          sortKey={sortKey} 
          sortOrder={sortOrder} 
        />
      </div>
    </div>
  );
}
