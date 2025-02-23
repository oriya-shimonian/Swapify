import React from 'react'

type Props = {}

export default function SomeProducts() {
  return (
    <section
    dir="rtl"
    className="h-screen md:min-h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 dark:text-gray-300 text-center px-8"
  >
    {/* כותרת ראשית */}
    <div className="max-w-4xl mx-auto mb-12">
    <h1 className='text-black dark:text-white text-4xl font-bold leading-snug'
    >SomeProducts</h1>
    </div>
  </section>
  )
}