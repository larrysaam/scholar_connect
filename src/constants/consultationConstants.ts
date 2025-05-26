
export const CONSULTATION_CONSTANTS = {
  GOOGLE_MEET: {
    BASE_URL: 'https://meet.google.com/abc-defg-hij',
    CALENDAR_URL: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Consultation+Reschedule&details=Reschedule+consultation+session&location=Google+Meet'
  },
  RECORDINGS: {
    BASE_URL: 'https://drive.google.com/file/d/recording-'
  },
  FILE_UPLOAD: {
    ACCEPTED_TYPES: '.pdf,.doc,.docx,.ppt,.pptx,.txt',
    MULTIPLE: true
  },
  MESSAGES: {
    CONSULTATION_ACCEPTED: 'Consultation accepted with comment:',
    CONSULTATION_DECLINED: 'Consultation declined with comment:',
    DOCUMENTS_UPLOADED: 'document(s) uploaded successfully. Students will receive these before the session.',
    GOOGLE_CALENDAR_OPENED: 'Google Calendar opened for rescheduling. Please create a new event and share it with the student.',
    AI_NOTES_OPENING: 'Opening AI-generated notes for consultation',
    LIVE_DOCUMENT_OPENING: 'Opening shared Google Docs document from student...'
  }
};
