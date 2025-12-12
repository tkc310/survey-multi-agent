import { NextRequest, NextResponse } from 'next/server';
import { textsApi } from '@/lib/api/texts';
import type { ApiResponse, PaliText } from '@/types';

// GET /api/texts - すべてのテキストを取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const text = await textsApi.getById(id);
      if (!text) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Text not found' },
          { status: 404 }
        );
      }
      return NextResponse.json<ApiResponse<PaliText>>(
        { success: true, data: text }
      );
    }

    const texts = await textsApi.getAll();
    return NextResponse.json<ApiResponse<PaliText[]>>(
      { success: true, data: texts }
    );
  } catch (error) {
    console.error('Error fetching texts:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch texts' },
      { status: 500 }
    );
  }
}

// POST /api/texts - 新しいテキストを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newText = await textsApi.create(body);
    return NextResponse.json<ApiResponse<PaliText>>(
      { success: true, data: newText },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating text:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to create text' },
      { status: 500 }
    );
  }
}

// PUT /api/texts - テキストを更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Text ID is required' },
        { status: 400 }
      );
    }

    const updatedText = await textsApi.update(id, updates);
    return NextResponse.json<ApiResponse<PaliText>>(
      { success: true, data: updatedText }
    );
  } catch (error) {
    console.error('Error updating text:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to update text' },
      { status: 500 }
    );
  }
}

// DELETE /api/texts - テキストを削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Text ID is required' },
        { status: 400 }
      );
    }

    const deleted = await textsApi.delete(id);
    if (!deleted) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Text not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<boolean>>(
      { success: true, data: deleted }
    );
  } catch (error) {
    console.error('Error deleting text:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to delete text' },
      { status: 500 }
    );
  }
}

