import { Message, MessageReaction, User } from 'discord.js'
import { match } from '../models/Client'
import { ExtendedInteraction } from '../typings/Command'
import mapPicker from './map-picker'

export const getBestOf = async (
  interaction: ExtendedInteraction
): Promise<void> => {
  const message = (await interaction.followUp('Best of ??')) as Message<boolean>

  Promise.all([message.react('1️⃣'), message.react('3️⃣'), message.react('5️⃣')])

  const filter = (reaction: MessageReaction, user: User): boolean => {
    return user.discriminator === '2124'
  }

  const collector = message.createReactionCollector({
    filter,
    max: 3,
  })

  collector.on('collect', async (reaction: MessageReaction, user: User) => {
    const bo = getBOFromReaction(reaction.emoji.name) as 1 | 3 | 5
    await interaction.followUp(`Wybrany format to: BO**${bo}**`)

    match.bestOf = bo
    collector.stop()

    await mapPicker(interaction)
  })
}

const getBOFromReaction = (reactionName: string): number => {
  switch (reactionName) {
    case '1️⃣': {
      return 1
    }

    case '3️⃣': {
      return 3
    }

    case '5️⃣': {
      return 5
    }
  }
}
