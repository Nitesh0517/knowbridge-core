/**
 * GitHub API Integration Service for KnowBridge AI
 * Implements real authorized access to GitHub repositories via the GitHub REST API (v3).
 * Fetches repository metadata, README, recent commits, issues, and pull requests
 * for archaeological project state reconstruction and commit-level evidence linkage.
 */

const axios = require('axios');

class GitHubService {
  /**
   * Parses repository owner and name from URL or slug
   * e.g. "https://github.com/owner/repo" or "owner/repo"
   */
  static parseRepoSlug(input) {
    if (!input) return null;
    let clean = input.trim().replace(/\.git$/, '');
    if (clean.includes('github.com/')) {
      const parts = clean.split('github.com/')[1].split('/');
      return { owner: parts[0], repo: parts[1] };
    }
    const parts = clean.split('/');
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] };
    }
    return null;
  }

  static getHeaders(token = null) {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'KnowBridge-AI-Ingestion-Engine'
    };
    const activeToken = token || process.env.GITHUB_TOKEN;
    if (activeToken) {
      headers['Authorization'] = `token ${activeToken}`;
    }
    return headers;
  }

  static async fetchRepoDetails(owner, repo, token = null) {
    const headers = this.getHeaders(token);
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    const res = await axios.get(url, { headers, timeout: 15000 });
    return res.data;
  }

  static async fetchReadme(owner, repo, token = null) {
    try {
      const headers = this.getHeaders(token);
      const url = `https://api.github.com/repos/${owner}/${repo}/readme`;
      const res = await axios.get(url, { headers, timeout: 15000 });
      if (res.data && res.data.content) {
        return Buffer.from(res.data.content, 'base64').toString('utf-8');
      }
      return '';
    } catch (e) {
      return 'No README found or inaccessible.';
    }
  }

  static async fetchRecentCommits(owner, repo, token = null, limit = 15) {
    try {
      const headers = this.getHeaders(token);
      const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${limit}`;
      const res = await axios.get(url, { headers, timeout: 15000 });
      return res.data.map(c => ({
        sha: c.sha.substring(0, 7),
        fullSha: c.sha,
        message: c.commit.message,
        author: c.commit.author.name,
        date: c.commit.author.date,
        url: c.html_url
      }));
    } catch (e) {
      console.warn(`[GitHub Service] Could not fetch commits for ${owner}/${repo}:`, e.message);
      return [];
    }
  }

  static async fetchIssuesAndPRs(owner, repo, token = null, limit = 15) {
    try {
      const headers = this.getHeaders(token);
      const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=${limit}`;
      const res = await axios.get(url, { headers, timeout: 15000 });
      return res.data.map(i => ({
        number: i.number,
        title: i.title,
        isPR: Boolean(i.pull_request),
        state: i.state,
        author: i.user.login,
        labels: i.labels.map(l => l.name),
        created_at: i.created_at,
        url: i.html_url,
        body: (i.body || '').substring(0, 300)
      }));
    } catch (e) {
      console.warn(`[GitHub Service] Could not fetch issues for ${owner}/${repo}:`, e.message);
      return [];
    }
  }

  /**
   * Compiles the full repository information into a structured text document
   * suitable for KnowBridge AI reconstruction and evidence linkage.
   */
  static async ingestRepository(repoUrl, token = null) {
    const parsed = this.parseRepoSlug(repoUrl);
    if (!parsed) {
      throw new Error('Invalid GitHub repository URL or format. Expected: owner/repo or https://github.com/owner/repo');
    }

    const { owner, repo } = parsed;
    const repoData = await this.fetchRepoDetails(owner, repo, token);
    const readme = await this.fetchReadme(owner, repo, token);
    const commits = await this.fetchRecentCommits(owner, repo, token);
    const issues = await this.fetchIssuesAndPRs(owner, repo, token);

    let doc = `# GITHUB REPOSITORY AUDIT: ${repoData.full_name}\n\n`;
    doc += `Description: ${repoData.description || 'No description provided.'}\n`;
    doc += `Default Branch: ${repoData.default_branch}\n`;
    doc += `Primary Language: ${repoData.language || 'Multiple / Unspecified'}\n`;
    doc += `Open Issues Count: ${repoData.open_issues_count}\n`;
    doc += `Visibility: ${repoData.private ? 'Private' : 'Public'}\n\n`;

    doc += `## RECENT COMMITS & ACTIVITY LOG\n`;
    commits.forEach(c => {
      doc += `- [Commit ${c.sha}] (${c.date}) by ${c.author}: ${c.message.replace(/\n/g, ' ')}\n`;
    });
    doc += `\n`;

    doc += `## OPEN ISSUES & PULL REQUESTS\n`;
    issues.forEach(i => {
      const type = i.isPR ? 'Pull Request' : 'Issue';
      doc += `- [${type} #${i.number}] ${i.title} (by ${i.author}) [Labels: ${i.labels.join(', ') || 'none'}]\n`;
      if (i.body) {
        doc += `  Description: ${i.body.replace(/\n/g, ' ')}\n`;
      }
    });
    doc += `\n`;

    doc += `## PROJECT README & DOCUMENTATION\n`;
    doc += `${readme}\n`;

    return {
      repoFullName: repoData.full_name,
      owner,
      repo,
      defaultBranch: repoData.default_branch,
      language: repoData.language,
      openIssues: repoData.open_issues_count,
      commitsCount: commits.length,
      issuesCount: issues.length,
      content: doc,
      commits,
      issues
    };
  }
}

module.exports = GitHubService;
