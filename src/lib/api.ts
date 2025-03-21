export const getTicket = async () => {
  try {
    const response = await fetch(
      "https://djfuyo-ip-61-73-136-134.tunnelmole.net/riding-api/tickets",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = (await response.json()) as GetTicketResponse;
    return data;
  } catch (error) {
    console.error("Error fetching ticket:", error);
    throw error;
  }
};

interface Ticket {
  bonus_ticket_count: number;
  ticket_count: number;
  ticket_price: number;
}

type GetTicketResponse = Ticket[];
