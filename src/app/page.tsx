import { GitLabIssue } from '@/types/issue';
import IssueBoard from '@/components/IssueBoard';

async function fetchAllIssues() {
  const token = process.env.GITLAB_API_TOKEN;
  if (!token) {
    throw new Error('GITLAB_API_TOKEN is not defined in environment variables');
  }

  const projectId = encodeURIComponent('manage/2022');
  let url = `https://gitlab.skylife.co.kr/api/v4/projects/${projectId}/issues?state=opened&per_page=100`;
  let allIssues: GitLabIssue[] = [];

  while (url) {
    const response = await fetch(url, {
      headers: {
        'PRIVATE-TOKEN': token,
      },
    });

    if (!response.ok) {
      throw new Error(`GitLab API responded with status: ${response.status}`);
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

  return allIssues;
}

export default async function IssuesDashboardPage() {
  const issues = await fetchAllIssues();

  const inProgress: GitLabIssue[] = [];
  const pending: GitLabIssue[] = [];
  const readyForDeploy: GitLabIssue[] = [];

  // Calculate 2 months ago threshold
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  issues.forEach(issue => {
    if (issue.labels.includes('진행중')) {
      inProgress.push(issue);
    } 
    else if (issue.labels.includes('작업 대기')) {
      const createdAt = new Date(issue.created_at);
      // Only add if created within the last 2 months
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
      <IssueBoard 
        inProgress={inProgress}
        pending={pending}
        readyForDeploy={readyForDeploy}
      />
    </div>
  );
}
