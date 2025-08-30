'use client'

import ServicesPageComponent from '@/components/ServicesPageComponent'
import { useRouter } from 'next/navigation'

export default function ServicesPage() {
  const router = useRouter()

  const handleNavigateToQuote = (category: string, serviceId: string) => {
    // Navigate to quote page with URL parameters
    router.push(`/quote?category=${category}&service=${serviceId}`)
  }

  return <ServicesPageComponent onNavigateToQuote={handleNavigateToQuote} />
}
