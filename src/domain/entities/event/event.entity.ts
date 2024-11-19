import {
  BaseEntity,
  IEntity,
  SimpleSerialized,
  Omitt,
} from '@carbonteq/hexapp';

export interface IEvent extends IEntity {
  name: string;
  type: string;
  description: string;
  date: Date;
  city: string;
  country: string;
  venue: string;
  userId: string;
}
export type SerializedEvent = SimpleSerialized<IEvent>;
type EventUpdateData = Omitt<IEvent, 'id' | 'createdAt' | 'userId'>;

export class Event extends BaseEntity implements IEvent {
  name: string;
  type: string;
  description: string;
  date: Date;
  city: string;
  country: string;
  venue: string;
  private constructor(
    name: string,
    type: string,
    description: string,
    date: Date,
    city: string,
    country: string,
    venue: string,
    readonly userId: string,
  ) {
    super();
    this.name = name;
    this.type = type;
    this.description = description;
    this.date = date;
    this.city = city;
    this.country = country;
    this.venue = venue;
  }

  static new(
    name: string,
    type: string,
    description: string,
    date: Date,
    city: string,
    country: string,
    venue: string,
    userId,
  ) {
    return new Event(
      name,
      type,
      description,
      date,
      city,
      country,
      venue,
      userId,
    );
  }

  nameUpdate(newname: string) {
    this.name = newname;
    this.markUpdated();
  }
  typeUpdate(newType: string) {
    this.type = newType;
    this.markUpdated();
  }
  descriptionUpdate(newDiscription: string) {
    this.description = newDiscription;
    this.markUpdated();
  }
  dateUpdate(newDate: string) {
    this.date = new Date(newDate);
    this.markUpdated();
  }
  cityUpdate(newCity: string) {
    this.city = newCity;
    this.markUpdated();
  }
  countryUpdate(newCountry: string) {
    this.country = newCountry;
    this.markUpdated();
  }
  venueUpdate(newvenue: string) {
    this.venue = newvenue;
    this.markUpdated();
  }

  forUpdate(): EventUpdateData {
    return {
      ...super.forUpdate(),
      name: this.name,
      type: this.type,
      description: this.description,
      date: this.date,
      city: this.city,
      country: this.country,
      venue: this.venue,
    };
  }

  static fromSerialized(other: SerializedEvent) {
    const ent = new Event(
      other.name,
      other.type,
      other.description,
      other.date,
      other.city,
      other.country,
      other.venue,
      other.userId,
    );
    ent._fromSerialized(other);

    return ent;
  }
  serialize(): SerializedEvent {
    return {
      ...super._serialize(),
      name: this.name,
      type: this.type,
      description: this.description,
      date: this.date,
      city: this.city,
      country: this.country,
      venue: this.venue,
      userId: this.userId,
    };
  }
}
