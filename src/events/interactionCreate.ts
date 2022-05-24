import { CommandInteractionOptionResolver, Interaction } from 'discord.js'
import { client } from '..'
import { Event } from '../models/Event'
import { CommandType, ExtendedInteraction } from '../typings/Command'

export default new Event(
  'interactionCreate',
  async (interaction: Interaction) => {
    if (interaction.isCommand()) {
      await interaction.deferReply()

      const command: CommandType = client.commands.get(interaction.commandName)

      if (!command) {
        return interaction.followUp('No command found!')
      }

      command.run({
        args: interaction.options as CommandInteractionOptionResolver,
        client,
        interaction: interaction as ExtendedInteraction,
      })
    }
  }
)
