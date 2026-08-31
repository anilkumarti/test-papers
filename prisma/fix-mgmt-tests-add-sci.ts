/**
 * Fix: Rename MGMT test titles + Create General Science subject tests
 * Run: npx tsx prisma/fix-mgmt-tests-add-sci.ts
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
  console.log('🔧 Fixing MGMT test titles + creating SCI tests...\n')

  // ── 1. Get subject IDs ─────────────────────────────────────────
  const { data: subjects } = await supabase.from('subjects').select('id, code, name_hi')
  const subjectMap = Object.fromEntries((subjects ?? []).map((s: any) => [s.code, s]))
  const MGMT = subjectMap['MGMT']?.id
  const SCI  = subjectMap['SCI']?.id

  console.log('MGMT id:', MGMT)
  console.log('SCI  id:', SCI)

  // ── 2. Rename old Panchayati Raj test titles → General Management ──
  const titleRenames = [
    { old: 'ग्रामीण अर्थव्यवस्था एवं पंचायती राज — विषयवार टेस्ट', new_hi: 'सामान्य प्रबंधन — विषयवार टेस्ट', new_en: 'General Management — Subject Test' },
    { old: 'ग्रामीण अर्थव्यवस्था एवं पंचायती राज पेपर 1', new_hi: 'सामान्य प्रबंधन पेपर 1', new_en: 'General Management Paper 1' },
    { old: 'ग्रामीण अर्थव्यवस्था एवं पंचायती राज पेपर 2', new_hi: 'सामान्य प्रबंधन पेपर 2', new_en: 'General Management Paper 2' },
    { old: 'ग्रामीण अर्थव्यवस्था एवं पंचायती राज पेपर 3', new_hi: 'सामान्य प्रबंधन पेपर 3', new_en: 'General Management Paper 3' },
  ]

  for (const r of titleRenames) {
    const { data, error } = await supabase
      .from('mock_tests')
      .update({ title_hi: r.new_hi, title: r.new_en })
      .eq('title_hi', r.old)
      .select('id, title_hi')

    if (error) console.error(`❌ Rename failed "${r.old}":`, error.message)
    else if (!data?.length) console.log(`ℹ️  Not found: "${r.old}"`)
    else console.log(`✓ Renamed "${r.old}" → "${r.new_hi}"`)
  }

  // ── 3. Create General Science subject tests ────────────────────
  if (!SCI) { console.error('❌ SCI subject not found'); return }

  // Get SCI questions (the ones we just seeded)
  const { data: sciQs } = await supabase
    .from('questions')
    .select('id, topic_id')
    .eq('subject_id', SCI)
    .order('created_at', { ascending: true })

  if (!sciQs?.length) { console.log('ℹ️  No SCI questions found'); return }
  console.log(`\n📋 Found ${sciQs.length} General Science questions`)

  // Get existing MGMT tests count so we use similar sort_order logic
  const { data: existingSciTests } = await supabase
    .from('mock_tests')
    .select('id')
    .eq('subject_id', SCI)

  if (existingSciTests && existingSciTests.length > 0) {
    console.log(`ℹ️  ${existingSciTests.length} SCI tests already exist — skipping creation`)
  } else {
    // Create a single subject test with all available SCI questions (up to 25)
    const batch = sciQs.slice(0, 25)
    const qCount = batch.length

    const { data: newTest, error: testErr } = await supabase
      .from('mock_tests')
      .insert({
        title: 'General Science — Subject Test',
        title_hi: 'सामान्य विज्ञान — विषयवार टेस्ट',
        description: 'MPESB 2026 पैटर्न पर आधारित सामान्य विज्ञान (भौतिकी, रसायन, जीव विज्ञान) विषयवार टेस्ट।',
        type: 'SUBJECT',
        subject_id: SCI,
        total_questions: qCount,
        total_marks: qCount,
        duration: Math.ceil(qCount * 1.5),
        negative_marks: 0,
        is_published: true,
        is_active: true,
        sort_order: 200,
      })
      .select('id')
      .single()

    if (testErr || !newTest) {
      console.error('❌ Failed to create SCI test:', testErr?.message)
      return
    }

    console.log(`✓ Created SCI test (id: ${newTest.id}), linking ${qCount} questions...`)

    // Link questions via test_questions
    const tqs = batch.map((q: any, idx: number) => ({
      test_id: newTest.id,
      question_id: q.id,
      order: idx + 1,
    }))

    const { error: linkErr } = await supabase.from('test_questions').insert(tqs)
    if (linkErr) console.error('❌ Failed to link questions:', linkErr.message)
    else console.log(`✓ Linked ${tqs.length} questions to सामान्य विज्ञान test`)
  }

  console.log('\n🎉 Done! Redeploy on Vercel to see changes (or wait for auto-deploy).')
}

main().catch(console.error)
