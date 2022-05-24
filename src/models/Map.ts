import { EmojiIdentifierResolvable } from 'discord.js'

export default class Map {
  index: number
  name: string
  reaction: EmojiIdentifierResolvable

  constructor(index: number, name: string) {
    this.index = index
    this.name = name
    this.reaction = getReactionFromIndex(index)
  }
}

const getReactionFromIndex = (index: number): EmojiIdentifierResolvable => {
  switch (index) {
    case 1: {
      return '1️⃣'
    }

    case 2: {
      return '2️⃣'
    }

    case 3: {
      return '3️⃣'
    }

    case 4: {
      return '4️⃣'
    }

    case 5: {
      return '5️⃣'
    }

    case 6: {
      return '6️⃣'
    }

    case 7: {
      return '7️⃣'
    }

    case 8: {
      return '8️⃣'
    }

    case 9: {
      return '9️⃣'
    }
  }
}
