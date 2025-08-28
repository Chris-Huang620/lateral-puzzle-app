import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })   // 👈 force load .env.local

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !service) {
    throw new Error("Missing env vars. Check .env.local")
  }

  const supabase = createClient(url, service)

  const jsonPath = path.join(process.cwd(), 'data', 'puzzles.json')
  const puzzles = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

  for (const p of puzzles) {
    const { error } = await supabase
      .from('puzzles')
      .upsert(p, { onConflict: 'slug' })
    if (error) throw error
    console.log('Upserted', p.slug)
  }

  console.log('✅ Done seeding!')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
