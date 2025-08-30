'use client'

import { useSearchParams } from 'next/navigation'
import QuoteCalculatorComponent from '@/components/QuoteCalculatorComponent'

export default function QuotePage() {
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
