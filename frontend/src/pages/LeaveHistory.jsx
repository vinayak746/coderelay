import { useState } from 'react';

function LeaveHistory() {
  const [leaveHistory] = useState([
    {
      id: 1,
      dateRange: '2026-01-15 to 2026-01-17',
      type: 'Sick',
      reason: 'Flu',
      status: 'Approved',
      submittedDate: '2026-01-10',
    },
    {
      id: 2,
      dateRange: '2026-02-01 to 2026-02-05',
      type: 'Vacation',
      reason: 'Family trip',
      status: 'Approved',
      submittedDate: '2026-01-25',
    },
    {
      id: 3,
      dateRange: '2026-02-10 to 2026-02-12',
      type: 'Personal',
      reason: 'Personal matters',
      status: 'Pending',
      submittedDate: '2026-02-05',
    },
    {
      id: 4,
      dateRange: '2025-12-20 to 2025-12-22',
      type: 'Sick',
      reason: 'Cold',
      status: 'Approved',
      submittedDate: '2025-12-15',
    },
    {
      id: 5,
      dateRange: '2025-11-10 to 2025-11-15',
      type: 'Vacation',
      reason: 'Holiday',
      status: 'Approved',
      submittedDate: '2025-11-01',
    },
  ]);

  const [filter, setFilter] = useState('all');

  const filteredHistory = leaveHistory.filter((leave) => {
    if (filter === 'all') return true;
    return leave.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved':
        return { bg: '#ecfdf5', text: '#166534' };
      case 'Rejected':
        return { bg: '#fef2f2', text: '#991b1b' };
      case 'Pending':
        return { bg: '#fffbeb', text: '#92400e' };
      default:
        return { bg: '#f5f5f4', text: '#44403c' };
    }
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'Sick':
        return { bg: '#fef2f2', text: '#991b1b' };
      case 'Vacation':
        return { bg: '#f5f5f4', text: '#44403c' };
      case 'Personal':
        return { bg: '#faf5ff', text: '#6b21a8' };
      default:
        return { bg: '#f5f5f4', text: '#44403c' };
    }
  };

  const filterTabs = ['all', 'approved', 'pending', 'rejected'];
  const filterLabels = { all: 'All', approved: 'Approved', pending: 'Pending', rejected: 'Rejected' };

  return (
    <div className="space-y-8">
      <div>
        <h2
          className="text-2xl"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          Leave history
        </h2>
        <p className="mt-1 text-[15px]" style={{ color: 'var(--color-muted)' }}>
          Past and current leave requests.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterTabs.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 text-[14px] font-medium rounded transition-colors"
            style={
              filter === f
                ? { backgroundColor: 'var(--color-accent)', color: '#fff' }
                : { backgroundColor: 'var(--color-border)', color: 'var(--color-muted)' }
            }
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      <div
        className="rounded-lg border overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <table className="min-w-full">
          <thead>
            <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
              <th className="px-5 py-3 text-left text-[12px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
                Submitted
              </th>
              <th className="px-5 py-3 text-left text-[12px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
                Dates
              </th>
              <th className="px-5 py-3 text-left text-[12px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
                Type
              </th>
              <th className="px-5 py-3 text-left text-[12px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
                Reason
              </th>
              <th className="px-5 py-3 text-left text-[12px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-5 py-10 text-center text-[14px]" style={{ color: 'var(--color-muted)' }}>
                  No leave requests found
                </td>
              </tr>
            ) : (
              filteredHistory.map((leave) => {
                const sc = getStatusStyle(leave.status);
                const tc = getTypeStyle(leave.type);
                return (
                  <tr
                    key={leave.id}
                    className="border-t transition-colors hover:bg-black/[0.02]"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <td className="px-5 py-3.5 text-[14px]">{leave.submittedDate}</td>
                    <td className="px-5 py-3.5 text-[14px]">{leave.dateRange}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className="px-2 py-0.5 text-[12px] font-medium rounded"
                        style={{ backgroundColor: tc.bg, color: tc.text }}
                      >
                        {leave.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[14px]" style={{ color: 'var(--color-muted)' }}>
                      {leave.reason}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="px-2 py-0.5 text-[12px] font-medium rounded"
                        style={{ backgroundColor: sc.bg, color: sc.text }}
                      >
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: leaveHistory.length, color: 'var(--color-text)' },
          { label: 'Approved', value: leaveHistory.filter((l) => l.status === 'Approved').length, color: '#166534' },
          { label: 'Pending', value: leaveHistory.filter((l) => l.status === 'Pending').length, color: '#92400e' },
          { label: 'Rejected', value: leaveHistory.filter((l) => l.status === 'Rejected').length, color: '#991b1b' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-lg border"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="text-[13px]" style={{ color: 'var(--color-muted)' }}>{stat.label}</div>
            <div className="text-xl font-medium mt-0.5" style={{ color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaveHistory;
