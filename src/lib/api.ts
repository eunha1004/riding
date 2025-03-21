export const getTicket = async () => {
  try {
    const response = await fetch(
      "https://d26d-61-73-136-134.ngrok-free.app/riding-api/tickets"
    );
    const data = (await response.json()) as GetTicketResponse;
    return data;
  } catch (error) {
    console.error("Error fetching ticket:", error);
    throw error;
  }
};

interface GetTicketResponse {
  bonus_ticket_count: number;
  ticket_count: number;
  ticket_price: number;
}
