export interface IDomainEvent {
  get EventId() : string
  get OccurredAt(): Date
}
