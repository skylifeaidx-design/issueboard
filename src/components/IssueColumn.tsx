'use client';

import { GitLabIssue } from '../types/issue';

interface IssueColumnProps {
  title: string;
  issues: GitLabIssue[];
  sortKey: 'created_at' | 'updated_at';
  sortOrder: 'asc' | 'desc';
}

export default function IssueColumn({ title, issues, sortKey, sortOrder }: IssueColumnProps) {
  const sortedIssues = [...issues].sort((a, b) => {
    const dateA = new Date(a[sortKey]).getTime();
    const dateB = new Date(b[sortKey]).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto', minHeight: '600px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span className="badge" style={{ backgroundColor: 'var(--primary-soft)', color: 'var(--primary-dark)' }}>
          {issues.length}
        </span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sortedIssues.map(issue => (
          <a
            key={issue.id}
            href={issue.web_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              display: 'block', 
              padding: '16px', 
              border: '1px solid var(--line)', 
              borderRadius: 'var(--radius)',
              background: '#fff',
              transition: 'transform 0.1s, box-shadow 0.1s',
              textDecoration: 'none',
              color: 'inherit'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '8px' }}>
              #{issue.iid}
            </div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', lineHeight: '1.4' }}>{issue.title}</h4>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
               {issue.author.avatar_url && (
                   <img src={issue.author.avatar_url} alt={issue.author.name} style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
               )}
               <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{issue.author.name}</span>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--ink-muted)', display: 'grid', gap: '4px' }}>
              <div>생성일: {new Date(issue.created_at).toLocaleDateString()} {new Date(issue.created_at).toLocaleTimeString()}</div>
              <div>수정일: {new Date(issue.updated_at).toLocaleDateString()} {new Date(issue.updated_at).toLocaleTimeString()}</div>
            </div>
          </a>
        ))}
        {issues.length === 0 && (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '14px', background: 'var(--surface-strong)', borderRadius: 'var(--radius)' }}>
            해당되는 이슈가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
