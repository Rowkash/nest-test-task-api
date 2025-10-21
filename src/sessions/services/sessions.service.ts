import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'

import {
  ICacheData,
  ISessionData,
  IUpdateUserSessionsListData,
} from '@/sessions/interfaces/session.interfaces'

const expiresIn = 30 * 24 * 60 * 60 * 1000

@Injectable()
export class SessionsService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async create(data: ICacheData) {
    const { refreshToken, user } = data
    const value = { userId: user.id, email: user.email }
    const key = this.getSessionKey(user.id)
    await this.cacheManager.set(key, [refreshToken]) // session
    await this.cacheManager.set(refreshToken, value, expiresIn) // sessions list
  }

  async findUserSessionList(userId: number) {
    const key = this.getSessionKey(userId)
    return this.cacheManager.get<string[]>(key)
  }

  async findByKey(key: string) {
    return this.cacheManager.get<ISessionData>(key)
  }

  async updateUserSessionsList(data: IUpdateUserSessionsListData) {
    const { sessions, cacheData } = data
    const { refreshToken, user } = cacheData
    const sessionsKey = this.getSessionKey(user.id)
    await this.cacheManager.set(sessionsKey, [...sessions, refreshToken])
    const value = { userId: user.id, email: user.email }
    await this.cacheManager.set(refreshToken, value, expiresIn)
  }

  async remove(key: string) {
    const session = await this.findByKey(key)
    if (!session) {
      return
    }
    const sessions = await this.findUserSessionList(session.userId)
    if (sessions && sessions?.length > 0) {
      const sessionsKey = this.getSessionKey(session.userId)
      const filterSessions = sessions.filter(session => session !== key)
      await (filterSessions.length === 0
        ? this.cacheManager.del(sessionsKey)
        : this.cacheManager.set(sessionsKey, filterSessions))
    }
    await this.cacheManager.del(key)
  }

  async removeAllSessionsByUser(userId: number) {
    const sessionsList = await this.findUserSessionList(userId)
    if (sessionsList && sessionsList.length > 0) {
      await this.cacheManager.mdel(sessionsList)
      const sessionsListKey = this.getSessionKey(userId)
      await this.cacheManager.del(sessionsListKey)
    }
  }

  private getSessionKey(userId: number) {
    return `user_sessions: ${userId}`
  }
}
