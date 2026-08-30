import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

// Mappers: DB snake_case → JS camelCase
export const mapUser = (u: any) => ({
  id: u.id, name: u.name, email: u.email, password: u.password,
  role: u.role, createdAt: u.created_at, updatedAt: u.updated_at,
})
export const mapSubject = (s: any) => ({
  id: s.id, name: s.name, nameHi: s.name_hi, code: s.code,
  order: s.sort_order, color: s.color,
})
export const mapTopic = (t: any) => ({
  id: t.id, name: t.name, nameHi: t.name_hi, subjectId: t.subject_id,
})
export const mapQuestion = (q: any) => ({
  id: q.id, textHi: q.text_hi, textEn: q.text_en,
  optionA: q.option_a, optionB: q.option_b, optionC: q.option_c, optionD: q.option_d,
  correct: q.correct, explanation: q.explanation, explanHi: q.explan_hi,
  subjectId: q.subject_id, topicId: q.topic_id,
  difficulty: q.difficulty, source: q.source, tags: q.tags,
  isActive: q.is_active, needsReview: q.needs_review, flagReason: q.flag_reason,
  createdAt: q.created_at, updatedAt: q.updated_at,
})
export const mapTest = (t: any) => ({
  id: t.id, title: t.title, titleHi: t.title_hi, description: t.description,
  type: t.type, totalQuestions: t.total_questions, totalMarks: t.total_marks,
  duration: t.duration, negativeMarks: t.negative_marks,
  isPublished: t.is_published, isActive: t.is_active,
  order: t.sort_order, subjectId: t.subject_id,
  createdAt: t.created_at, updatedAt: t.updated_at,
})
export const mapAttempt = (a: any) => ({
  id: a.id, userId: a.user_id, testId: a.test_id,
  startedAt: a.started_at, submittedAt: a.submitted_at,
  score: a.score, totalMarks: a.total_marks, percentage: a.percentage,
  timeTaken: a.time_taken, isCompleted: a.is_completed,
})
export const mapQA = (qa: any) => ({
  id: qa.id, attemptId: qa.attempt_id, questionId: qa.question_id,
  selectedOption: qa.selected_option, isCorrect: qa.is_correct,
  isMarked: qa.is_marked, timeTaken: qa.time_taken,
})

// Shape test_questions rows into the Prisma-style shape the frontend expects
export const mapTestQuestion = (tq: any) => ({
  id: tq.id, testId: tq.test_id, questionId: tq.question_id, order: tq.sort_order,
  question: tq.questions ? {
    ...mapQuestion(tq.questions),
    subject: tq.questions.subjects ? mapSubject(tq.questions.subjects) : null,
    topic: tq.questions.topics ? mapTopic(tq.questions.topics) : null,
  } : null,
})
