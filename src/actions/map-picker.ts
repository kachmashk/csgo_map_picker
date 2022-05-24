import { Message, MessageReaction, ReactionCollector, User } from 'discord.js'
import { match } from '../models/Client'
import { ExtendedInteraction } from '../typings/Command'
import Map from '../models/Map'
import Match from '../models/Match'

const mapPicker = async (interaction: ExtendedInteraction): Promise<void> => {
  const message = (await interaction.followUp(
    getMapPickerTitle(match)
  )) as Message<boolean>

  const reactions: Promise<MessageReaction>[] = []

  match.mapPool.forEach((map: Map) => {
    reactions.push(message.react(map.reaction))
  })

  Promise.all([reactions])

  const filter = (reaction: MessageReaction, user: User): boolean => {
    return user.discriminator === '2124'
  }

  const collector: ReactionCollector = message.createReactionCollector({
    filter,
    max: match.mapPool.length,
  })

  collector.on('collect', async (reaction: MessageReaction, user: User) => {
    if (match.isNextMapToBan()) {
      onNextMapBan(collector, interaction, reaction)
      return
    }

    onNextMapPick(collector, interaction, reaction)
  })
}

export default mapPicker

const onNextMapBan = async (
  collector: ReactionCollector,
  interaction: ExtendedInteraction,
  reaction: MessageReaction
): Promise<void> => {
  const mapBanned: Map = match.mapPool.filter(
    (map: Map) => map.reaction === reaction.emoji.name
  )[0]

  await interaction.followUp(`Zbanowano mapę: **${mapBanned.name}**`)

  match.mapPool = match.mapPool.filter(
    (map: Map) => map.reaction !== reaction.emoji.name
  )

  if (match.mapPool.length === 1) {
    match.selectedMaps.push(match.mapPool[0])

    await interaction.followUp(
      `Mapą decydującą jest: **${match.mapPool[0].name}**`
    )

    await interaction.followUp(getMatchSummary(match))

    collector.stop()
    return
  }

  collector.stop()

  await mapPicker(interaction)
}

const onNextMapPick = async (
  collector: ReactionCollector,
  interaction: ExtendedInteraction,
  reaction: MessageReaction
): Promise<void> => {
  const selectedMap: Map = match.mapPool.filter(
    (map: Map) => map.reaction === reaction.emoji.name
  )[0]

  await interaction.followUp(`Wybrano mapę: **${selectedMap.name}**`)

  match.selectedMaps.push(selectedMap)

  match.mapPool = match.mapPool.filter(
    (map: Map) => map.reaction !== reaction.emoji.name
  )

  if (match.mapPool.length === 1) {
    match.selectedMaps.push(match.mapPool[0])

    await interaction.followUp(
      `Mapą decydującą jest: **${match.mapPool[0].name}**`
    )

    await interaction.followUp(getMatchSummary(match))

    collector.stop()
    return
  }

  collector.stop()

  await mapPicker(interaction)
}

export const getMapsFollowUp = (maps: Map[]): string => {
  if (maps.length === 0) {
    return 'Brak map'
  }

  let response: string = ''

  maps.forEach((map: Map) => {
    response += `${map.index}. ${map.name}\n`
  })

  return response
}

const getMatchSummary = (match: Match): string => {
  let mapResponse: string = ''

  match.selectedMaps.forEach(
    (map: Map, index: number) => (mapResponse += `${index + 1}. ${map.name}\n`)
  )

  return `BO**${match.bestOf}**\n\n${mapResponse}`
}

const getMapPickerTitle = (match: Match): string => {
  const teamToSelectTitle: string =
    match.mapPool.length % 2 !== 0 ? `*Drużyna A*` : `*Drużyna B*`

  if (match.isNextMapToBan()) {
    return `**BANUJE** - ${teamToSelectTitle}\n\n${getMapsFollowUp(
      match.mapPool
    )}`
  }

  return `**WYBIERA** - ${teamToSelectTitle}\n\n${getMapsFollowUp(
    match.mapPool
  )}`
}
