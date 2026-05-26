import api from './api'
import type { Reservation, Ticket, ReservationWithTickets, ReservationInput } from '@/types/reservation'

const EVENT_NAME = 'Le Petit Poto - Édition 5'
const EVENT_DATE = '28 Juin 2026'
const VENUE = 'Palais de la Culture, Abidjan'

/**
 * Generate a unique reference for the reservation
 */
function generateReservationRef(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let ref = 'LPP-'
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return ref
}

/**
 * Generate unique ticket reference
 */
function generateTicketRef(reservationRef: string, ticketNumber: number): string {
  return `${reservationRef}-${String(ticketNumber).padStart(3, '0')}`
}

/**
 * Create ticket QR data JSON string
 */
function createTicketQRData(
  reservation: Reservation,
  ticketNumber: number,
  ticketRef: string
): string {
  return JSON.stringify({
    ref: ticketRef,
    ticket_no: ticketNumber,
    reservation: reservation.reference,
    event: reservation.event_name,
    date: reservation.event_date,
    venue: VENUE,
    name: reservation.buyer_name,
    email: reservation.buyer_email,
    paid: reservation.total_price
  })
}

/**
 * Create a new reservation with individual tickets
 */
export async function createReservation(input: ReservationInput): Promise<ReservationWithTickets> {
  const reference = generateReservationRef()

  const reservation: Reservation = {
    reference,
    event_name: EVENT_NAME,
    event_date: EVENT_DATE,
    buyer_name: input.buyer_name,
    buyer_email: input.buyer_email,
    buyer_phone: input.buyer_phone,
    quantity: input.quantity,
    total_price: input.total_price,
    payment_method: input.payment_method,
    payment_status: 'pending'
  }

  // Create reservation
  const { data: reservationData } = await api.post<Reservation[]>('/reservations', reservation)
  const savedReservation = reservationData[0]

  // Generate individual tickets
  const tickets: Ticket[] = []
  for (let i = 1; i <= input.quantity; i++) {
    const ticketRef = generateTicketRef(reference, i)
    const ticket: Ticket = {
      reservation_id: savedReservation.id!,
      ticket_number: i,
      reference: ticketRef,
      qr_data: createTicketQRData(savedReservation, i, ticketRef),
      status: 'active'
    }
    tickets.push(ticket)
  }

  // Batch insert tickets
  const { data: ticketsData } = await api.post<Ticket[]>('/tickets', tickets)

  return {
    ...savedReservation,
    tickets: ticketsData
  }
}

/**
 * Confirm payment for a reservation
 */
export async function confirmPayment(reference: string): Promise<Reservation> {
  const { data } = await api.patch<Reservation[]>(
    `/reservations?reference=eq.${reference}`,
    { payment_status: 'confirmed' }
  )

  return data[0]
}

/**
 * Get reservation by reference with tickets
 */
export async function getReservationByRef(reference: string): Promise<ReservationWithTickets | null> {
  const { data: reservationData } = await api.get<Reservation[]>(
    `/reservations?reference=eq.${reference}`
  )

  if (!reservationData[0]) return null

  const reservation = reservationData[0]

  // Get tickets for this reservation
  const { data: ticketsData } = await api.get<Ticket[]>(
    `/tickets?reservation_id=eq.${reservation.id}&order=ticket_number.asc`
  )

  return {
    ...reservation,
    tickets: ticketsData
  }
}

/**
 * Get reservations by email with tickets
 */
export async function getReservationsByEmail(email: string): Promise<ReservationWithTickets[]> {
  const { data: reservationsData } = await api.get<Reservation[]>(
    `/reservations?buyer_email=eq.${encodeURIComponent(email)}&order=created_at.desc`
  )

  const reservationsWithTickets = await Promise.all(
    reservationsData.map(async (reservation) => {
      const { data: ticketsData } = await api.get<Ticket[]>(
        `/tickets?reservation_id=eq.${reservation.id}&order=ticket_number.asc`
      )
      return {
        ...reservation,
        tickets: ticketsData
      }
    })
  )

  return reservationsWithTickets
}

export default {
  createReservation,
  confirmPayment,
  getReservationByRef,
  getReservationsByEmail
}
