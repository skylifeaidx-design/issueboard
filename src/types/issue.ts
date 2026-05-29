export interface GitLabIssue {
  id: number;
  iid: number;
  title: string;
  state: string;
  created_at: string;
  updated_at: string;
  labels: string[];
  web_url: string;
  author: {
    name: string;
    avatar_url: string;
  };
}
