export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="flex justify-between px-16 py-8 text-sm text-gray-600">
        <p>© 2025 or something like that</p>
        <div className="flex items-center gap-4">
          <p>The whole page design is heavily &apos;inspired&apos;/ straight up copied from ansonyu.me</p>
          <a href="https://github.com/tfbecker/website-new" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Code</a>
        </div>
      </div>
    </footer>
  )
}
