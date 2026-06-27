import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { Smile } from "lucide-react"

const EMOJI_CATEGORIES: Record<string, string[]> = {
  "Smileys": [
    "😀","😃","😄","😁","😅","😂","🤣","😊","😇","🙂","😉","😌","😍","🥰","😘","😗","😙","😚","😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🥸","🤩","🥳","😏","😒","😞","😔","😟","😕","🙁","😣","😖","😫","😩","🥺","😢","😭","😤","😠","😡","🤬","🤯","😳","🥵","🥶","😱","😨","😰","😥","😓","🤗","🤔","🤭","🤫","🤥","😶","😐","😑","😬","🙄","😯","😦","😧","😮","😲","🥱","😴","🤤","😪","😵","🤐","🥴","🤢","🤮","🤧","😷","🤒","🤕","🤑","🤠","😈","👿","👹","👺","🤡","💩","👻","💀","☠️","👽","👾","🤖","🎃","😺","😸","😹","😻","😼","😽","🙀","😿","😾"
  ],
  "Gestures": [
    "👋","🤚","🖐","✋","🖖","👏","🙌","🤝","💪","🦾","🤲","👐","🙏","✌️","🤞","🤟","🤘","🤙","👌","🤌","🤏","👈","👉","👆","🖕","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌"
  ],
  "Hearts": [
    "❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝","💟","♥️","😻","💑","💏","💋"
  ],
  "Objects": [
    "🔥","⭐","🌟","💫","✨","🎉","🎊","🎈","💡","🚀","💻","👨‍💻","🎮","🏆","🥇","✅","❌","⚡","💯","🎯","📌","📎","🔑","🔒","💎","🌈","☀️","🌙","⚡","💥","🎵","🎶","🎸","🎹","🥁","🎤","🎧","🎬","📱","💡","📚","✏️","🖊️","📝","💬","🗨️","🗯️","💭","💤"
  ],
  "Food": [
    "🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🫛","🌽","🥦","🧄","🧅","🌶️","🫑","🥒","🥬","🥗","🍕","🍔","🍟","🌭","🍿","🧁","🍰","🎂","🍮","🍭","🍬","🍫","🍿","🍩","🍪","🌰","🥜","🍯","🥛","🍼","☕","🍵","🧃","🥤","🍺","🍻","🥂","🍷","🥃","🍸","🍹"
  ]
}

const POPULAR_EMOJIS = [
  "👍","❤️","😂","🔥","🎉","😍","🚀","💯","✨","👏","😎","🤔","💪","🙌","👋","🤝","💡","⭐","✅","👨‍💻","🎮","🏆","🥇","💻","📱","☕","🍕","🎵","🎶","💬","😊","😅","😁","😄","😃","😀","😆","🤣","😉","😌","😍","🥰","😘","😗","😙","😚","😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🥸","🤩","🥳"
]

type EmojiPickerProps = {
  onSelect?: (emoji: string) => void
  triggerClassName?: string
}

export function EmojiPicker({ onSelect, triggerClassName }: EmojiPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [activeCategory, setActiveCategory] = React.useState("Smileys")
  const categories = Object.keys(EMOJI_CATEGORIES)

  const handleSelect = (emoji: string) => {
    onSelect?.(emoji)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cnTrigger(triggerClassName)}
          aria-label="Open emoji picker"
        >
          <Smile className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start" sideOffset={8}>
        <div className="border-b border-[var(--border)]">
          <div className="flex gap-1 overflow-x-auto p-1.5 [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar-thumb]:rounded-full">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={cnCategoryButton(activeCategory === category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto p-2">
          <div className="grid grid-cols-8 gap-0.5">
            {EMOJI_CATEGORIES[activeCategory].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleSelect(emoji)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-lg transition-colors hover:bg-[var(--accent)]"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        <div className="border-t border-[var(--border)] p-2">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Popular
          </p>
          <div className="grid grid-cols-8 gap-0.5">
            {POPULAR_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleSelect(emoji)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-lg transition-colors hover:bg-[var(--accent)]"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function cnTrigger(className?: string) {
  return `h-9 w-9 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] ${className || ''}`
}

function cnCategoryButton(active: boolean) {
  return `whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
    active
      ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]"
  }`
}
