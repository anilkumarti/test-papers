/**
 * Migration: Update to official MPESB 2026 exam pattern
 *
 * Changes:
 * - Rename "Rural Economy & Panchayati Raj" → "General Management" (code RURAL→MGMT)
 * - Add "General Science" (code SCI) as new subject
 * - Update Full Mock Test: 200 questions, 200 marks, 180 min (3 hours)
 * - Update negative_marks to 0.25 on full mock tests
 *
 * Run: npx tsx prisma/migrate-exam-pattern-2026.ts
 */
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

async function main() {
  console.log('🔄 Migrating to MPESB 2026 official exam pattern...\n')

  // 1. Rename Rural Economy & Panchayati Raj → General Management
  const { data: mgmtUpdate, error: mgmtErr } = await supabase
    .from('subjects')
    .update({
      name: 'General Management',
      name_hi: 'सामान्य प्रबंधन',
      code: 'MGMT',
      color: '#84cc16',
    })
    .eq('code', 'RURAL')
    .select()

  if (mgmtErr) {
    console.error('❌ Failed to rename RURAL subject:', mgmtErr.message)
  } else if (!mgmtUpdate?.length) {
    console.log('ℹ️  RURAL subject not found — may already be renamed or not exist')
  } else {
    console.log('✓ Renamed "Rural Economy & Panchayati Raj" → "General Management" (code: MGMT)')
  }

  // 2. Add General Science subject
  const { data: existingSci } = await supabase
    .from('subjects')
    .select('id')
    .eq('code', 'SCI')
    .single()

  if (existingSci) {
    console.log('ℹ️  General Science (SCI) subject already exists — skipping insert')
  } else {
    const { error: sciErr } = await supabase.from('subjects').insert({
      name: 'General Science',
      name_hi: 'सामान्य विज्ञान',
      code: 'SCI',
      sort_order: 0,
      color: '#f43f5e',
      is_active: true,
    })

    if (sciErr) {
      console.error('❌ Failed to add General Science subject:', sciErr.message)
    } else {
      console.log('✓ Added "General Science" (सामान्य विज्ञान) subject (code: SCI)')
    }
  }

  // 3. Update Full Mock Tests: 200 questions, 200 marks, 180 minutes, -0.25 negative marks
  const { data: fullTests, error: ftErr } = await supabase
    .from('mock_tests')
    .select('id, title_hi, total_questions, total_marks, duration')
    .eq('type', 'FULL')

  if (ftErr) {
    console.error('❌ Failed to fetch full mock tests:', ftErr.message)
  } else {
    console.log(`\n📋 Found ${fullTests?.length ?? 0} full mock test(s) to update:`)
    for (const t of fullTests ?? []) {
      const { error } = await supabase
        .from('mock_tests')
        .update({
          total_questions: 200,
          total_marks: 200,
          duration: 180,
          negative_marks: 0.25,
          description: 'MPESB 2026 आधिकारिक पैटर्न पर आधारित पूर्ण मॉक टेस्ट। 200 प्रश्न, 200 अंक, 3 घंटे। -0.25 नकारात्मक अंकन।',
        })
        .eq('id', t.id)

      if (error) {
        console.error(`  ❌ Failed to update "${t.title_hi}":`, error.message)
      } else {
        console.log(`  ✓ Updated "${t.title_hi}": ${t.total_questions}q/${t.total_marks}m/${t.duration}min → 200q/200m/180min`)
      }
    }
  }

  // 4. Update Previous Year tests to 180 min as well (if they're full-length)
  const { data: pyTests } = await supabase
    .from('mock_tests')
    .select('id, title_hi, total_questions, duration')
    .eq('type', 'PREVIOUS_YEAR')
    .gte('total_questions', 100)

  if (pyTests?.length) {
    console.log(`\n📅 Found ${pyTests.length} previous year test(s) with 100+ questions:`)
    for (const t of pyTests) {
      const newQ = Math.max(t.total_questions, 200)
      const { error } = await supabase
        .from('mock_tests')
        .update({ total_questions: newQ, total_marks: newQ, duration: 180, negative_marks: 0.25 })
        .eq('id', t.id)
      if (!error) console.log(`  ✓ Updated "${t.title_hi}": duration → 180min, -0.25 negative marks`)
    }
  }

  console.log('\n🎉 Migration complete!')
  console.log('\nNote: Subject tests (विषयवार) keep their original duration/question counts.')
  console.log('To see changes, redeploy the app on Vercel.')
}

main().catch(console.error)
