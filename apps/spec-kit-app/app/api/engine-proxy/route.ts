import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export async function POST(request: NextRequest) {
  const targetUrl = request.nextUrl.searchParams.get('url');
  if (!targetUrl) {
    return NextResponse.json({ error: 'No target URL provided' }, { status: 400 });
  }

  try {
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      if (key !== 'host') {
        headers[key] = value;
      }
    });

    const body = await request.json();

    let axiosResponse = await axios({
      method: 'post',
      url: targetUrl,
      headers,
      data: body,
    });

    return NextResponse.json(axiosResponse.data, {
      status: axiosResponse.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status || 500;
    const errorMessage = axiosError.response?.data || {
      error: 'Failed to proxy request',
    };
    return NextResponse.json(errorMessage, { status });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'GET requests are not supported. Use POST instead.' }, { status: 405 });
}
