import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabase, mapUser } from '@/lib/supabase'
import { signToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'सभी फ़ील्ड आवश्यक हैं' }, { status: 400 })
    }
    const { data: existing } = await supabase.from('users').select('id').eq('email', email).maybeSingle()
    if (existing) return NextResponse.json({ error: 'यह ईमेल पहले से पंजीकृत है' }, { status: 409 })
    const hashed = await bcrypt.hash(password, 12)
    const { data: row, error } = await supabase
      .from('users').insert({ name, email, password: hashed, role: 'USER' }).select().single()
    if (error || !row) return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
    const user = mapUser(row)
    const token = await signToken({ userId: user.id, email: user.email, role: user.role, name: user.name })
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' })
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
