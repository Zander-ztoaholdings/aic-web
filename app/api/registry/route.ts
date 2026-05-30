import { NextRequest, NextResponse } from 'next/server';
import { getSystemDb, organizations, eq, gte, desc } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const verifyId = searchParams.get('verify_id');
    const db = getSystemDb();

    if (!verifyId) {
        // Return active registry list (Orgs with score >= 100)
        const registryOrgs = await db
            .select({
                id: organizations.id,
                name: organizations.name,
                tier: organizations.tier,
                integrity_score: organizations.integrityScore,
                created_at: organizations.createdAt
            })
            .from(organizations)
            .where(gte(organizations.integrityScore, 100))
            .orderBy(desc(organizations.createdAt));

        return NextResponse.json({ registry: registryOrgs });
    }

    // Single verification
    const [organization] = await db
        .select({
            id: organizations.id,
            name: organizations.name,
            tier: organizations.tier,
            integrity_score: organizations.integrityScore,
            created_at: organizations.createdAt
        })
        .from(organizations) 
        .where(eq(organizations.id, verifyId))
        .limit(1);

    if (!organization) {
        return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json({ 
        success: true, 
        organization,
        verified_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Registry API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
