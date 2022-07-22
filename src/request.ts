import { HorusQuery } from './types';

export async function request(query: HorusQuery): Promise<any> {
  // Add headers
  const headers = new Headers();
  query.headers?.map((h) => {
    headers.append(h[0], h[1]);
  });

  // Request init
  const requestInit: RequestInit = {
    body: query.method === 'GET' ? undefined : query.body,
    headers: headers,
    method: query.method,
  };

  const url = CreateURL(query.urlPath);

  if (!url) {
    throw new Error('Invalid URL');
  }

  // Add params
  query.params?.forEach((pair) => {
    url.searchParams.append(pair[0] ?? '', pair[1] ?? '');
  });

  // Make request
  const res = await fetch(url.toString(), requestInit).catch(() => {
    throw new Error('Fail to fetch');
  });

  // Check if request has error code
  if (!res.ok) {
    throw new Error('Request failed. ' + res.statusText);
  }

  // Parse response
  return await res.json().catch(() => {
    throw new Error('Fail to read response');
  });
}

function CreateURL(addr: string): URL | undefined {
  try {
    return new URL(addr);
  } catch {
    return undefined;
  }
}
