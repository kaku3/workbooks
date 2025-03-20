import TicketForm from '@/components/tickets/TicketForm';

interface Props {
  params: {
    id: string;
  };
}

export default function EditTicketPage({ params }: Props) {
  return <TicketForm mode="edit" ticketId={params.id} />;
}
