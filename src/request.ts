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

  // Create URL
  const url = new URL(query.urlPath);

  // Add params
  query.params?.forEach((pair) => {
    url.searchParams.append(pair[0] ?? '', pair[1] ?? '');
  });

  // Make request
  let res: any;
  try {
    res = await fetch(url.toString(), requestInit);
  } catch (err) {
    throw new Error('Fail to make request');
  }

  // Parse response
  let bodyRes: any;
  try {
    bodyRes = await res.json();
  } catch (err) {
    throw new Error('An error occured while reading request response');
  }
  return bodyRes;
}
