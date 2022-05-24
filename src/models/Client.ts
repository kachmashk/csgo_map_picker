import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
} from 'discord.js'
import { glob } from 'glob'
import { promisify } from 'util'
import { RegisterCommandsOptions } from '../typings/client'
import { CommandType } from '../typings/Command'
import { Event } from './Event'
import Match from './Match'

const globPromise = promisify(glob)

export const match = new Match(1)

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection()

  constructor() {
    super({ intents: 32767 })
  }

  start() {
    this.registerModules()
    this.login(process.env.botToken)
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default
  }

  async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
    if (guildId) {
      this.guilds.cache.get(guildId)?.commands.set(commands)
    } else {
      this.application?.commands.set(commands)
    }
  }

  async registerModules() {
    const slashCommands: ApplicationCommandDataResolvable[] = []
    const commandFiles: string[] = await globPromise(
      `${__dirname}/../commands/*{.ts,.js}`
    )

    commandFiles.forEach(async (filePath: string) => {
      const command: CommandType = await this.importFile(filePath)

      if (!command.name) {
        return
      }

      this.commands.set(command.name, command)
      slashCommands.push(command)
    })

    this.on('ready', () => {
      console.log('Bot is ready!')

      this.registerCommands({
        commands: slashCommands,
        guildId: process.env.guildId,
      })
    })

    const eventFiles: string[] = await globPromise(
      `${__dirname}/../events/*{.ts,.js}`
    )

    eventFiles.forEach(async (filePath: string) => {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath)
      this.on(event.event, event.run)
    })
  }
}
