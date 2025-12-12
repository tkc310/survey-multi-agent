import { NextRequest, NextResponse } from 'next/server';
import { dictionaryApi } from '@/lib/api/dictionary';
import type { ApiResponse, DictionaryEntry } from '@/types';

// GET /api/dictionary - すべての辞書エントリを取得または検索
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const word = searchParams.get('word');
    const query = searchParams.get('q');

    if (word) {
      const entry = await dictionaryApi.getByWord(word);
      if (!entry) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Dictionary entry not found' },
          { status: 404 }
        );
      }
      return NextResponse.json<ApiResponse<DictionaryEntry>>(
        { success: true, data: entry }
      );
    }

    if (query) {
      const results = await dictionaryApi.search(query);
      return NextResponse.json<ApiResponse<DictionaryEntry[]>>(
        { success: true, data: results }
      );
    }

    const entries = await dictionaryApi.getAll();
    return NextResponse.json<ApiResponse<DictionaryEntry[]>>(
      { success: true, data: entries }
    );
  } catch (error) {
    console.error('Error fetching dictionary:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch dictionary' },
      { status: 500 }
    );
  }
}

// POST /api/dictionary - 新しい辞書エントリを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newEntry = await dictionaryApi.create(body);
    return NextResponse.json<ApiResponse<DictionaryEntry>>(
      { success: true, data: newEntry },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating dictionary entry:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to create dictionary entry' },
      { status: 500 }
    );
  }
}

// PUT /api/dictionary - 辞書エントリを更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { word, ...updates } = body;
    
    if (!word) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Word is required' },
        { status: 400 }
      );
    }

    const updatedEntry = await dictionaryApi.update(word, updates);
    return NextResponse.json<ApiResponse<DictionaryEntry>>(
      { success: true, data: updatedEntry }
    );
  } catch (error) {
    console.error('Error updating dictionary entry:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to update dictionary entry' },
      { status: 500 }
    );
  }
}

// DELETE /api/dictionary - 辞書エントリを削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const word = searchParams.get('word');

    if (!word) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Word is required' },
        { status: 400 }
      );
    }

    const deleted = await dictionaryApi.delete(word);
    if (!deleted) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Dictionary entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<boolean>>(
      { success: true, data: deleted }
    );
  } catch (error) {
    console.error('Error deleting dictionary entry:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to delete dictionary entry' },
      { status: 500 }
    );
  }
}

