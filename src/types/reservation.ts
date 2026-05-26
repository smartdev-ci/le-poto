export interface Reservation {
  id?: string
  reference: string
  event_name: string
  event_date: string
  buyer_name: string
  buyer_email: string
  buyer_phone: string
  quantity: number
  total_price: number
  payment_method: string
  payment_status: 'pending' | 'confirmed' | 'failed'
  created_at?: string
}

export interface Ticket {
  id?: string
  reservation_id: string
  ticket_number: number
  reference: string
  qr_data: string
  status: 'active' | 'used' | 'cancelled'
  created_at?: string
}

export interface ReservationWithTickets extends Reservation {
  tickets?: Ticket[]
}

export interface ReservationInput {
  buyer_name: string
  buyer_email: string
  buyer_phone: string
  quantity: number
  total_price: number
  payment_method: string
}
