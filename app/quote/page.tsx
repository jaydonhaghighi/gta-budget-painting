'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import QuoteCalculatorComponent from '@/components/QuoteCalculatorComponent'

function QuotePageContent() {
  const searchParams = useSearchParams()
  const preSelectedCategory = searchParams.get('category')
  const preSelectedService = searchParams.get('service')

  return (
    <QuoteCalculatorComponent 
      preSelectedCategory={preSelectedCategory}
      preSelectedService={preSelectedService}
    />
  )
}

export default function QuotePage() {
  return (
    <Suspense fallback={<div>Loading quote calculator...</div>}>
      <QuotePageContent />
    </Suspense>
  )
}
