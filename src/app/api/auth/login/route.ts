import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabase, mapUser } from '@/lib/supabase'
import { signToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'ईमेल और पासवर्ड आवश्यक हैं' }, { status: 400 })
    }
    const { data: row } = await supabase.from('users').select('*').eq('email', email).maybeSingle()
    if (!row) return NextResponse.json({ error: 'ईमेल या पासवर्ड गलत है' }, { status: 401 })
    const user = mapUser(row)
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return NextResponse.json({ error: 'ईमेल या पासवर्ड गलत है' }, { status: 401 })
    const token = await signToken({ userId: user.id, email: user.email, role: user.role, name: user.name })
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' })
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
