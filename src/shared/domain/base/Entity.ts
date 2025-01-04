import { ValueObject } from './ValueObject';

export abstract class Entity<T> {
  protected readonly _id: ValueObject<T>;

  constructor(id: ValueObject<T>) {
    this._id = id;
  }

  public get id(): ValueObject<T> {
    return this._id;
  }

  public equals(other?: Entity<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (other.constructor !== this.constructor) {
      return false;
    }

    return this._id.equals(other._id);
  }
}
