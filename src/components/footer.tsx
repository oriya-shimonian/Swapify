import { Input } from './ui/input'
import { Button } from './ui/button'
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter, FaYoutube } from 'react-icons/fa6'

export default function footer() {
  return (
    <div>footer
        {/* אזור ניוזלטר וקישורים */}
      <div className="mt-16 w-full max-w-5xl border-t pt-8 flex flex-col md:flex-row items-center md:items-start justify-between">
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold">הירשמו לניוזלטר</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">קבלו עדכונים על מוצרים חדשים, אירועים והנחות מיוחדות.</p>
          <div className="flex mt-4">
            <Input placeholder="האימייל שלכם" className="w-64" />
            <Button className="ml-2">הצטרפו</Button>
          </div>
        </div>

        {/* קישורים חברתיים */}
        <div className="flex flex-col items-center md:items-start mt-8 md:mt-0">
          <h4 className="text-lg font-semibold">הישארו מחוברים</h4>
          <div className="flex gap-4 mt-2 text-2xl">
            <FaFacebook className="cursor-pointer hover:text-blue-600" />
            <FaInstagram className="cursor-pointer hover:text-pink-500" />
            <FaXTwitter className="cursor-pointer hover:text-gray-700" />
            <FaLinkedin className="cursor-pointer hover:text-blue-700" />
            <FaYoutube className="cursor-pointer hover:text-red-600" />
          </div>
        </div>
      </div>

    </div>
  )
}
