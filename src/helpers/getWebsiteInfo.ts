export interface WebsiteInfo {
  id: number;
  url: string;
  title: string;
  domain: string;
  size: string;
}

export const getWebsiteInfo = (url: string): Omit<WebsiteInfo, 'id' | 'url'> => {
  try {
    const domain = new URL(url).hostname;
    const title = domain.replace('www.', '').split('.')[0];
    return {
      title: title.charAt(0).toUpperCase() + title.slice(1),
      domain: domain,
      size: (Math.random() * 10 + 1).toFixed(1) + ' MB'
    };
  } catch {
    return { title: 'Invalid URL', domain: url, size: '0 MB' };
  }
};