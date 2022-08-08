import { DataSourceInstanceSettings } from '@grafana/data';
import { HorusDataSourceOptions, HorusQuery } from './types';

export interface RequestResult {
  /**
   * Fetch error
   */
  error: Error | null;
  /**
   * Request data
   */
  data: any;
}

/**
 * Make request.
 * If URL is invalid Throws an Error
 * If the reponse was not json or was an invalid json Throws an Error
 *
 * @param query The query
 * @param options The DataSourceInstanceOptions
 * @returns The request result
 */
export async function _request(
  query: HorusQuery,
  options: DataSourceInstanceSettings<HorusDataSourceOptions>
): Promise<RequestResult> {
  // Add headers
  const headers = new Headers();

  options.jsonData.defaultHeaders // Append default headers
    ?.map((h) => {
      headers.append(h[0], h[1]);
    });

  query.headers // Append query headers
    ?.map((h) => {
      headers.append(h[0], h[1]);
    });

  // Request init
  const requestInit: RequestInit = {
    body: query.method === 'GET' ? undefined : query.body,
    headers: headers,
    method: query.method,
  };

  const url = CreateURL(options.jsonData.defaultUrl + query.urlPath);

  if (!url) {
    throw new Error('Invalid URL');
  }

  // Add params
  query.params?.forEach((pair) => {
    url.searchParams.append(pair[0] ?? '', pair[1] ?? '');
  });

  // Make request
  const res = await fetch(url.toString(), requestInit);

  // Check if request has error code
  if (!res.ok) {
    return {
      data: null,
      error: new Error('Request has failed'),
    };
  }

  // Parse response
  return {
    data: await res.json().catch(() => {
      throw new Error('Fail to read response as json');
    }),
    error: null,
  };
}

function CreateURL(addr: string): URL | undefined {
  try {
    return new URL(addr);
  } catch {
    return undefined;
  }
}
