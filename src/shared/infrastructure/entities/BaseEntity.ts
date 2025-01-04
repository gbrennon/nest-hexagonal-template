import {
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn({
    type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp',
    name: 'created_at',
    default: () => (process.env.NODE_ENV === 'test' ? "datetime('now')" : 'CURRENT_TIMESTAMP'),
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp',
    name: 'updated_at',
    default: () => (process.env.NODE_ENV === 'test' ? "datetime('now')" : 'CURRENT_TIMESTAMP'),
    onUpdate: process.env.NODE_ENV === 'test' ? undefined : 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}
