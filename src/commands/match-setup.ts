import { Command } from '../models/Command'
import { getBestOf } from '../actions/best-of'

export default new Command({
  name: 'match-setup',
  description: 'Match setup',
  run: async ({ interaction }) => {
    if (interaction.user.discriminator !== '2124') {
      await interaction.followUp('Nie dla psa!')
      return
    }

    await getBestOf(interaction)
  },
})
