/**
 * Seed: Question Bank from MPESB PYQ file (1500 questions)
 * Run: npx tsx prisma/seed-question-bank.ts
 */
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

async function main() {
  console.log('🌱 Seeding Question Bank (1500 PYQ questions)...\n')

  // Load questions
  const raw = readFileSync(join(__dirname, 'pyq-bank-1500.json'), 'utf-8')
  const questions: Array<{
    q_hi: string; q_en: string;
    a: string; b: string; c: string; d: string;
    correct: string; subject: string; subject_code: string;
  }> = JSON.parse(raw)

  // Fetch subject IDs
  const { data: subjects } = await supabase.from('subjects').select('id, code')
  const subjectIdMap = Object.fromEntries((subjects ?? []).map((s: any) => [s.code, s.id]))
  console.log('Subject map:', subjectIdMap)

  // Get or create "PYQ Bank" topic per subject
  const topicMap: Record<string, string> = {}
  for (const code of ['GK', 'SCI', 'HIN', 'MATH', 'ENG', 'MGMT', 'COMP', 'REASON']) {
    const sid = subjectIdMap[code]
    if (!sid) continue
    const { data: existing } = await supabase
      .from('topics')
      .select('id')
      .eq('subject_id', sid)
      .eq('name', 'PYQ Bank')
      .single()
    if (existing) {
      topicMap[code] = existing.id
    } else {
      const { data: created } = await supabase
        .from('topics')
        .insert({ subject_id: sid, name: 'PYQ Bank', name_hi: 'पिछले वर्ष प्रश्न बैंक' })
        .select('id')
        .single()
      if (created) topicMap[code] = created.id
    }
  }
  console.log('Topic map:', topicMap)

  // Build rows
  const rows = questions
    .filter(q => subjectIdMap[q.subject_code] && topicMap[q.subject_code])
    .map(q => ({
      subject_id: subjectIdMap[q.subject_code],
      topic_id: topicMap[q.subject_code],
      text_hi: q.q_hi,
      text_en: q.q_en || null,
      option_a: q.a,
      option_b: q.b,
      option_c: q.c,
      option_d: q.d,
      correct: q.correct,
      explanation: '',
      difficulty: 'MEDIUM',
      source: 'MPESB PYQ Bank',
      is_bank: true,
    }))

  console.log(`\n📋 Inserting ${rows.length} questions in batches...`)

  let inserted = 0
  const BATCH = 100
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const { error } = await supabase.from('questions').insert(batch)
    if (error) {
      // is_bank or text_en column may not exist — retry without optional cols
      const fallback = batch.map(({ is_bank, text_en, ...rest }: any) => rest)
      const { error: e2 } = await supabase.from('questions').insert(fallback)
      if (e2) console.error(`  ❌ Batch ${i}-${i+BATCH}:`, e2.message)
      else { inserted += batch.length; process.stdout.write('.') }
    } else {
      inserted += batch.length
      process.stdout.write('.')
    }
  }

  console.log(`\n\n✅ Inserted ${inserted} questions into Question Bank`)
  console.log('\nDone! The question bank is live in the DB.')
}

main().catch(console.error)
