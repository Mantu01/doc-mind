export interface WebsiteInfo {
  id: number;
  url: string;
  title: string;
  domain: string;
  pages: number;
  size: string;
}

export const getWebsiteInfo = (url: string): Omit<WebsiteInfo, 'id' | 'url'> => {
  try {
    const domain = new URL(url).hostname;
    const title = domain.replace('www.', '').split('.')[0];
    return {
      title: title.charAt(0).toUpperCase() + title.slice(1),
      domain: domain,
      pages: Math.floor(Math.random() * 50) + 5,
      size: (Math.random() * 10 + 1).toFixed(1) + ' MB'
    };
  } catch {
    return { title: 'Invalid URL', domain: url, pages: 0, size: '0 MB' };
  }
};