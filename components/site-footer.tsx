export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="flex justify-between px-16 py-8 text-sm text-gray-600">
        <p>© 2025 or something like that</p>
        <div className="flex items-center gap-4">
          <p>You made it to the end! You might like this</p>
          <a
            href="https://www.facebook.com/howaboutyy/videos/3674842495933688"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Watch on Facebook
          </a>
        </div>
      </div>
    </footer>
  )
}

