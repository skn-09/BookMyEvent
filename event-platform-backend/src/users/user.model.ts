import { Table, Column, Model, DataType, Index, Unique } from 'sequelize-typescript';

interface UserCreationAttrs {
  username: string;
  email: string;
  passwordHash: string;
  contact: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  username: string;

  @Unique
  @Index
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  passwordHash: string;

  @Column({ type: DataType.STRING, allowNull: false })
  contact: string;
}
