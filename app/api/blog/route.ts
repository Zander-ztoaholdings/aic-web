import { NextResponse } from 'next/server';
import { getSystemDb, sql } from '@/lib/db';

export async function GET() {
  try {
    const db = getSystemDb();
    
    // Note: Posts table is currently managed via specialized CMS or direct DB
    // We use raw SQL here if the table is not yet in the shared Drizzle schema
    // but executed through the hardened system DB instance.
    const result = await db.execute(sql`
      SELECT id, title, slug, excerpt, category, created_at as published_at 
      FROM organizations 
      WHERE is_alpha = true
      LIMIT 10
    `);

    return NextResponse.json({ posts: result.rows });
  } catch (error) {
    console.error('Public Blog API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 });
  }
}
