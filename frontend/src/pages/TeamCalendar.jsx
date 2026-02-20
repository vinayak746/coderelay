import { useState } from 'react';

function TeamCalendar() {
  const [currentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Mock data for project deadlines
  const projectDeadlines = [
    { date: new Date(2026, 1, 15), project: 'Project Alpha', color: 'red' },
    { date: new Date(2026, 1, 28), project: 'Project Beta', color: 'red' },
    { date: new Date(2026, 2, 5), project: 'Project Gamma', color: 'red' },
    { date: new Date(2026, 2, 15), project: 'Project Delta', color: 'red' },
  ];

  // Mock data for approved team leaves
  const approvedLeaves = [
    { date: new Date(2026, 1, 10), employee: 'John Doe', color: 'blue' },
    { date: new Date(2026, 1, 11), employee: 'John Doe', color: 'blue' },
    { date: new Date(2026, 1, 12), employee: 'John Doe', color: 'blue' },
    { date: new Date(2026, 1, 20), employee: 'Jane Smith', color: 'blue' },
    { date: new Date(2026, 1, 21), employee: 'Jane Smith', color: 'blue' },
    { date: new Date(2026, 2, 1), employee: 'Mike Johnson', color: 'blue' },
    { date: new Date(2026, 2, 2), employee: 'Mike Johnson', color: 'blue' },
    { date: new Date(2026, 2, 3), employee: 'Mike Johnson', color: 'blue' },
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDate = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const deadlines = projectDeadlines.filter(
      (d) =>
        d.date.getDate() === date.getDate() &&
        d.date.getMonth() === date.getMonth() &&
        d.date.getFullYear() === date.getFullYear()
    );
    const leaves = approvedLeaves.filter(
      (l) =>
        l.date.getDate() === date.getDate() &&
        l.date.getMonth() === date.getMonth() &&
        l.date.getFullYear() === date.getFullYear()
    );
    return { deadlines, leaves };
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2
          className="text-2xl"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          Team calendar
        </h2>
        <p className="mt-1 text-[15px]" style={{ color: 'var(--color-muted)' }}>
          Deadlines and approved leave.
        </p>
      </div>

      <div
        className="rounded-lg border p-4 flex gap-6"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#991b1b' }} />
          <span className="text-[14px]" style={{ color: 'var(--color-muted)' }}>Deadlines</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#427a5b' }} />
          <span className="text-[14px]" style={{ color: 'var(--color-muted)' }}>Leave</span>
        </div>
      </div>

      <div
        className="rounded-lg border p-6"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <h3
          className="text-xl mb-5 text-center"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          {monthNames[currentMonth]} {currentYear}
        </h3>

        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-[12px] font-medium py-2"
              style={{ color: 'var(--color-muted)' }}
            >
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDay }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square"></div>
          ))}

          {/* Calendar days */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const events = getEventsForDate(day);
            const hasDeadline = events.deadlines.length > 0;
            const hasLeave = events.leaves.length > 0;

            return (
              <div
                key={day}
                className={`aspect-square border p-2 rounded-md flex flex-col ${
                  isToday(day) ? 'ring-2 ring-[var(--color-accent)]' : ''
                }`}
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: hasDeadline || hasLeave ? 'rgba(0,0,0,0.02)' : 'transparent',
                }}
              >
                <div
                  className={`text-[13px] font-medium mb-1 ${
                    isToday(day) ? 'text-[var(--color-accent)]' : ''
                  }`}
                >
                  {day}
                </div>
                <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                  {hasDeadline && (
                    <div className="w-full h-1 rounded-sm" style={{ backgroundColor: '#991b1b' }} />
                  )}
                  {hasLeave && (
                    <div className="w-full h-1 rounded-sm" style={{ backgroundColor: '#427a5b' }} />
                  )}
                </div>
                {hasDeadline && (
                  <div className="text-[10px] mt-0.5 truncate" style={{ color: '#991b1b' }}>
                    {events.deadlines[0].project}
                  </div>
                )}
                {hasLeave && !hasDeadline && (
                  <div className="text-[10px] mt-0.5 truncate" style={{ color: '#427a5b' }}>
                    {events.leaves[0].employee}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="rounded-lg border p-6"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <h3 className="text-base font-medium mb-4" style={{ color: 'var(--color-text)' }}>
          Upcoming
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-[13px] font-medium mb-2" style={{ color: '#991b1b' }}>Deadlines</h4>
            <ul className="space-y-1.5">
              {projectDeadlines.map((deadline, index) => (
                <li key={index} className="text-[14px] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-sm shrink-0" style={{ backgroundColor: '#991b1b' }} />
                  {deadline.project} — {deadline.date.toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[13px] font-medium mb-2" style={{ color: '#427a5b' }}>Leave</h4>
            <ul className="space-y-1">
              {approvedLeaves
                .filter((leave, index, self) => {
                  // Group consecutive leaves by employee
                  const prev = self[index - 1];
                  if (
                    prev &&
                    prev.employee === leave.employee &&
                    leave.date.getTime() - prev.date.getTime() ===
                      24 * 60 * 60 * 1000
                  ) {
                    return false;
                  }
                  return true;
                })
                .map((leave, index) => {
                  const consecutiveDays = approvedLeaves.filter(
                    (l) =>
                      l.employee === leave.employee &&
                      Math.abs(
                        (l.date.getTime() - leave.date.getTime()) /
                          (24 * 60 * 60 * 1000)
                      ) < 7
                  ).length;
                  return (
                    <li key={index} className="text-[14px] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-sm shrink-0" style={{ backgroundColor: '#427a5b' }} />
                      {leave.employee} — {leave.date.toLocaleDateString()}
                      {consecutiveDays > 1 && ` (${consecutiveDays}d)`}
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamCalendar;
