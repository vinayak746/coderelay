import { useState } from 'react';
import ImpactVisualization from '../components/ImpactVisualization';

function ManagerDashboard() {
  const [pendingRequests] = useState([
    {
      id: 1,
      employeeName: 'John Doe',
      leaveType: 'Vacation',
      startDate: '2026-02-25',
      endDate: '2026-02-28',
      reason: 'Family vacation',
      teamAbsence: 5,
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      leaveType: 'Sick',
      startDate: '2026-03-01',
      endDate: '2026-03-03',
      reason: 'Medical appointment',
      teamAbsence: 8,
    },
    {
      id: 3,
      employeeName: 'Mike Johnson',
      leaveType: 'Personal',
      startDate: '2026-03-10',
      endDate: '2026-03-12',
      reason: 'Personal matters',
      teamAbsence: 12,
    },
  ]);

  const [projectDeadlines] = useState([
    { date: '2026-02-28', project: 'Project Alpha' },
    { date: '2026-03-05', project: 'Project Beta' },
    { date: '2026-03-15', project: 'Project Gamma' },
  ]);

  const handleApprove = (id) => {
    alert(`Leave request ${id} approved!`);
  };

  const handleReject = (id) => {
    alert(`Leave request ${id} rejected!`);
  };

  const checkDeadlineConflict = (startDate, endDate) => {
    return projectDeadlines.some((deadline) => {
      const deadlineDate = new Date(deadline.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return deadlineDate >= start && deadlineDate <= end;
    });
  };

  const getConflictingDeadline = (startDate, endDate) => {
    return projectDeadlines.find((deadline) => {
      const deadlineDate = new Date(deadline.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return deadlineDate >= start && deadlineDate <= end;
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2
          className="text-2xl"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          Manager
        </h2>
        <p className="mt-1 text-[15px]" style={{ color: 'var(--color-muted)' }}>
          Review leave requests and workload.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="rounded-lg border p-6"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h3 className="text-base font-medium mb-4" style={{ color: 'var(--color-text)' }}>
            Pending requests
          </h3>
          <div className="space-y-4">
            {pendingRequests.map((request) => {
              const hasConflict = checkDeadlineConflict(
                request.startDate,
                request.endDate
              );
              const conflictingDeadline = hasConflict
                ? getConflictingDeadline(request.startDate, request.endDate)
                : null;
              const isAutoApprovable = request.teamAbsence < 10;

              return (
                <div
                  key={request.id}
                  className="rounded-md p-4 transition-colors"
                  style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-[15px]" style={{ color: 'var(--color-text)' }}>
                        {request.employeeName}
                      </h4>
                      <p className="text-[13px]" style={{ color: 'var(--color-muted)' }}>
                        {request.leaveType} · {request.startDate} → {request.endDate}
                      </p>
                    </div>
                    {isAutoApprovable && (
                      <span className="px-2 py-0.5 text-[11px] font-medium rounded" style={{ backgroundColor: '#ecfdf5', color: '#166534' }}>
                        Low impact
                      </span>
                    )}
                  </div>

                  <p className="text-[14px] mb-3" style={{ color: 'var(--color-muted)' }}>{request.reason}</p>

                  {hasConflict && (
                    <div className="mb-3 p-2.5 rounded text-[13px]" style={{ backgroundColor: '#fef2f2', color: '#991b1b' }}>
                      Conflicts with {conflictingDeadline.project} ({conflictingDeadline.date})
                    </div>
                  )}

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="flex-1 px-4 py-2 text-[14px] font-medium rounded-md transition-colors"
                      style={{ backgroundColor: '#427a5b', color: '#fff' }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="flex-1 px-4 py-2 text-[14px] font-medium rounded-md border transition-colors"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}
                    >
                      Reject
                    </button>
                  </div>
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
            Workload impact
          </h3>
          <div className="space-y-4">
            {pendingRequests.map((request) => {
              const hasConflict = checkDeadlineConflict(
                request.startDate,
                request.endDate
              );
              const conflictingDeadline = hasConflict
                ? getConflictingDeadline(request.startDate, request.endDate)
                : null;

              return (
                <div
                  key={request.id}
                  className="rounded-md p-4"
                  style={{ border: '1px solid var(--color-border)' }}
                >
                  <h4 className="font-medium text-[14px] mb-2" style={{ color: 'var(--color-text)' }}>
                    {request.employeeName}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[13px]">
                      <span style={{ color: 'var(--color-muted)' }}>Team absence</span>
                      <span
                        className="font-medium"
                        style={{ color: request.teamAbsence < 10 ? '#166534' : '#92400e' }}
                      >
                        {request.teamAbsence}%
                      </span>
                    </div>
                    {hasConflict && (
                      <p className="text-[12px]" style={{ color: '#991b1b' }}>
                        Conflicts with {conflictingDeadline.project}
                      </p>
                    )}
                    <div className="mt-2">
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ backgroundColor: 'var(--color-border)' }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${100 - request.teamAbsence}%`,
                            backgroundColor: request.teamAbsence < 10 ? '#427a5b' : '#a16207',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Impact Visualization */}
      <div className="mt-6">
        <ImpactVisualization />
      </div>
    </div>
  );
}

export default ManagerDashboard;
