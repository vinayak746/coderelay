import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

function ImpactVisualization() {
  // Mock data for the next 4 weeks
  const weeklyData = [
    {
      week: 'Week 1',
      totalCapacity: 100,
      requiredWorkload: 85,
      capacityAfterLeaves: 92,
    },
    {
      week: 'Week 2',
      totalCapacity: 100,
      requiredWorkload: 90,
      capacityAfterLeaves: 88,
    },
    {
      week: 'Week 3',
      totalCapacity: 100,
      requiredWorkload: 95,
      capacityAfterLeaves: 85,
    },
    {
      week: 'Week 4',
      totalCapacity: 100,
      requiredWorkload: 88,
      capacityAfterLeaves: 90,
    },
  ];

  // Calculate system reliability score (based on capacity vs workload)
  const calculateReliabilityScore = () => {
    const avgCapacityAfterLeaves =
      weeklyData.reduce((sum, week) => sum + week.capacityAfterLeaves, 0) /
      weeklyData.length;
    const avgRequiredWorkload =
      weeklyData.reduce((sum, week) => sum + week.requiredWorkload, 0) /
      weeklyData.length;

    const score = Math.min(
      100,
      Math.max(0, (avgCapacityAfterLeaves / avgRequiredWorkload) * 100)
    );
    return Math.round(score);
  };

  // Calculate current team availability
  const calculateTeamAvailability = () => {
    const avgCapacity =
      weeklyData.reduce((sum, week) => sum + week.capacityAfterLeaves, 0) /
      weeklyData.length;
    return Math.round(avgCapacity);
  };

  const reliabilityScore = calculateReliabilityScore();
  const teamAvailability = calculateTeamAvailability();

  const getReliabilityColor = (score) => {
    if (score >= 90) return '#166534';
    if (score >= 70) return '#a16207';
    return '#991b1b';
  };

  const getAvailabilityColor = (availability) => {
    if (availability >= 90) return '#166534';
    if (availability >= 75) return '#a16207';
    return '#991b1b';
  };

  const chartColors = { capacity: '#a16207', workload: '#991b1b', afterLeaves: '#427a5b' };

  return (
    <div
      className="rounded-lg border p-6"
      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      <h3 className="text-base font-medium mb-6" style={{ color: 'var(--color-text)' }}>
        Capacity & impact
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div
          className="rounded-lg p-5 border"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
        >
          <p className="text-[13px] mb-1" style={{ color: 'var(--color-muted)' }}>
            Reliability score
          </p>
          <p
            className="text-3xl font-medium"
            style={{ color: getReliabilityColor(reliabilityScore) }}
          >
            {reliabilityScore}%
          </p>
          <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${reliabilityScore}%`,
                backgroundColor: reliabilityScore >= 90 ? '#427a5b' : reliabilityScore >= 70 ? '#a16207' : '#991b1b',
              }}
            />
          </div>
        </div>

        <div
          className="rounded-lg p-5 border"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
        >
          <p className="text-[13px] mb-1" style={{ color: 'var(--color-muted)' }}>
            Team availability
          </p>
          <p
            className="text-3xl font-medium"
            style={{ color: getAvailabilityColor(teamAvailability) }}
          >
            {teamAvailability}%
          </p>
          <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${teamAvailability}%`,
                backgroundColor: teamAvailability >= 90 ? '#427a5b' : teamAvailability >= 75 ? '#a16207' : '#991b1b',
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-[13px] font-medium mb-3" style={{ color: 'var(--color-muted)' }}>
          Next 4 weeks
        </h4>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="2 2" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="var(--color-muted)" />
            <YAxis tick={{ fontSize: 12 }} stroke="var(--color-muted)" domain={[0, 110]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                fontSize: 13,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="totalCapacity" fill={chartColors.capacity} name="Capacity" radius={[2, 2, 0, 0]} />
            <Bar dataKey="requiredWorkload" fill={chartColors.workload} name="Workload" radius={[2, 2, 0, 0]} />
            <Bar dataKey="capacityAfterLeaves" fill={chartColors.afterLeaves} name="After leaves" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <h4 className="text-[13px] font-medium mb-3" style={{ color: 'var(--color-muted)' }}>
          Trend
        </h4>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="2 2" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="var(--color-muted)" />
            <YAxis tick={{ fontSize: 12 }} stroke="var(--color-muted)" domain={[0, 110]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                fontSize: 13,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="totalCapacity" stroke={chartColors.capacity} strokeWidth={2} name="Capacity" dot={false} />
            <Line type="monotone" dataKey="requiredWorkload" stroke={chartColors.workload} strokeWidth={2} name="Workload" dot={false} />
            <Line type="monotone" dataKey="capacityAfterLeaves" stroke={chartColors.afterLeaves} strokeWidth={2} name="After leaves" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        className="mt-6 p-4 rounded-lg"
        style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
      >
        <h4 className="text-[13px] font-medium mb-2" style={{ color: 'var(--color-text)' }}>
          Summary
        </h4>
        <ul className="space-y-1 text-[14px]" style={{ color: 'var(--color-muted)' }}>
          <li>Avg capacity after leaves: {Math.round(weeklyData.reduce((s, w) => s + w.capacityAfterLeaves, 0) / weeklyData.length)}%</li>
          <li>Avg required workload: {Math.round(weeklyData.reduce((s, w) => s + w.requiredWorkload, 0) / weeklyData.length)}%</li>
          <li>
            Buffer:{' '}
            {(
              weeklyData.reduce((s, w) => s + w.capacityAfterLeaves, 0) / weeklyData.length -
              weeklyData.reduce((s, w) => s + w.requiredWorkload, 0) / weeklyData.length
            ).toFixed(1)}%
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ImpactVisualization;
