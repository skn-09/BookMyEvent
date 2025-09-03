import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Event } from '../events/event.model';

export interface SeatAttributes {
  id?: number;
  eventId: number;
  row: number;
  col: number;
  isBooked?: boolean;
  userId?: number | null;
}

@Table({
  tableName: 'seats',
  timestamps: true,
})
export class Seat extends Model<SeatAttributes> implements SeatAttributes {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id!: number;

  @ForeignKey(() => Event)
  @Column({ type: DataType.INTEGER, allowNull: false })
  eventId!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  row!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  col!: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isBooked!: boolean;

  @Column({ type: DataType.INTEGER, allowNull: true })
  userId?: number | null;

  @BelongsTo(() => Event)
  event?: Event;
}
