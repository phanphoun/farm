export const QUEUES = {
  notifications: 'notifications',
  search: 'search',
  ai: 'ai',
  certificates: 'certificates'
} as const;

export type QueueName = (typeof QUEUES)[keyof typeof QUEUES];
