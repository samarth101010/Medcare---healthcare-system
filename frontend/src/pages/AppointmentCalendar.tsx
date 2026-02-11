import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { appointmentAPI } from '@/services/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, User, FileText } from 'lucide-react';
import { format } from 'date-fns';

const localizer = momentLocalizer(moment);

const AppointmentCalendar = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await appointmentAPI.getAll();
      const appts = data.data.appointments || [];
      setAppointments(appts);

      // Transform appointments to calendar events
      const calendarEvents = appts.map((apt: any) => ({
        id: apt._id,
        title: apt.reason || 'Appointment',
        start: new Date(`${apt.appointmentDate}T${apt.appointmentTime}`),
        end: new Date(new Date(`${apt.appointmentDate}T${apt.appointmentTime}`).getTime() + 30 * 60000), // 30 min duration
        resource: apt,
        status: apt.status
      }));

      setEvents(calendarEvents);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const eventStyleGetter = (event: any) => {
    const statusColors: any = {
      scheduled: { backgroundColor: '#3b82f6', borderColor: '#2563eb' },
      confirmed: { backgroundColor: '#10b981', borderColor: '#059669' },
      completed: { backgroundColor: '#6b7280', borderColor: '#4b5563' },
      cancelled: { backgroundColor: '#ef4444', borderColor: '#dc2626' }
    };

    const colors = statusColors[event.status] || statusColors.scheduled;

    return {
      style: {
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '1px solid',
        display: 'block',
        fontSize: '0.85rem',
        padding: '2px 5px'
      }
    };
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event.resource);
    setShowDetails(true);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      scheduled: 'bg-blue-500',
      confirmed: 'bg-green-500',
      completed: 'bg-gray-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="text-center py-12">Loading calendar...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CalendarIcon className="h-8 w-8" />
              Appointment Calendar
            </h1>
            <p className="text-muted-foreground mt-2">Visual overview of all appointments</p>
          </div>
        </div>

        {/* Legend */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">Scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <span className="text-sm">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">Cancelled</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardContent className="p-6">
            <div style={{ height: '600px' }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={handleSelectEvent}
                views={['month', 'week', 'day', 'agenda']}
                defaultView="month"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(selectedEvent.status)}>
                  {selectedEvent.status}
                </Badge>
                <span className="text-sm text-muted-foreground font-mono">
                  {selectedEvent.appointmentId}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-medium">
                      {format(new Date(selectedEvent.appointmentDate), 'PPP')} at {selectedEvent.appointmentTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Reason</p>
                    <p className="font-medium">{selectedEvent.reason}</p>
                  </div>
                </div>

                {selectedEvent.notes && (
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p className="font-medium">{selectedEvent.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowDetails(false)} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default AppointmentCalendar;
