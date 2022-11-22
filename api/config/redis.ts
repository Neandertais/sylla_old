import Env from '@ioc:Adonis/Core/Env'
import { redisConfig } from '@adonisjs/redis/build/config'

export default redisConfig({
  connection: Env.get('REDIS_CONNECTION'),

  connections: {
    local: {
      host: Env.get('REDIS_HOST'),
      port: Env.get('REDIS_PORT'),
      password: Env.get('REDIS_PASSWORD', ''),
      db: 0,
      keyPrefix: '',
    },
  },
})
