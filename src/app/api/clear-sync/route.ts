import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
    try {
        await db.clearSyncQueue();
        return NextResponse.json({ success: true, message: 'Sync queue cleared' });
    } catch (error) {
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}