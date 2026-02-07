import { type NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.API_BACKENDL_URL || 'http://localhost:5000';

// Allow up to 1 minute for PDF generation (Vercel)
export const maxDuration = 60;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const backendUrl = `${BACKEND_URL}/api/reports-payment-acord/${path.join('/')}`;
  const authHeader = request.headers.get('authorization');

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(60_000), // 1 minute
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      return NextResponse.json(
        { success: false, message: 'El servidor tardó demasiado en responder' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error de conexión con el servidor' },
      { status: 502 }
    );
  }
}
