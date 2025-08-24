// src/events/event.model.ts
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Col } from 'sequelize/types/utils';
import { Seat } from 'src/seats/seat.model';

@Table({ tableName: 'events', timestamps: true })
export class Event extends Model<Event> {
  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column({ type: DataType.TEXT })
  description?: string;

  @Column({ type: DataType.DATEONLY })
  date?: string;

  @Column({ type: DataType.STRING })
  location?: string;

  @Column({ type: DataType.STRING })
  imageUrl?: string;

  @HasMany(() => Seat)
  seats?: Seat[];
}
