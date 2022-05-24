require('dotenv').config()
import { ExtendedClient } from './models/Client'

export const client = new ExtendedClient()

client.start()
