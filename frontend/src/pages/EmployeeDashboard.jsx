import { useEffect, useState } from "react";
import api from "../lib/axios";

function EmployeeDashboard() {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [leaveHistory, setLeaveHistory] = useState([]);

  useEffect(() => {
    api.get("/api/leave/my-leaves").then(({ data: { count, leaves } }) => {
      console.log(leaves);
      setLeaveHistory(leaves);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.endDate < formData.startDate) {
      alert("End date cannot be before start date");
      return;
    }
    if (
      !formData.leaveType ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.reason
    ) {
      alert("Please fill in all fields");
      return;
    }
    api
      .post("/api/leave/request", formData)
      .then(({ data }) => {
        console.log(data);
        alert("Leave request submitted successfully!");
      })
      .catch(console.error);
    setFormData({
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return { bg: "#ecfdf5", text: "#166534" };
      case "Rejected":
        return { bg: "#fef2f2", text: "#991b1b" };
      case "Pending":
        return { bg: "#fffbeb", text: "#92400e" };
      default:
        return { bg: "#f5f5f4", text: "#44403c" };
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 text-[15px] border rounded-md bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-colors";
  const labelClass = "block text-[13px] font-medium mb-1.5";

  return (
    <div className="space-y-10">
      <div>
        <h2
          className="text-2xl"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
          }}
        >
          Request leave
        </h2>
        <p className="mt-1 text-[15px]" style={{ color: "var(--color-muted)" }}>
          Submit a new leave request and track your history.
        </p>
      </div>

      <div
        className="p-6 rounded-lg border"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="leaveType"
                className={labelClass}
                style={{ color: "var(--color-text)" }}
              >
                Leave type
              </label>
              <select
                id="leaveType"
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className={inputClass}
                style={{ borderColor: "var(--color-border)" }}
                required
              >
                <option value="">Choose type</option>
                <option value="Sick">Sick</option>
                <option value="Vacation">Vacation</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="startDate"
                className={labelClass}
                style={{ color: "var(--color-text)" }}
              >
                Start date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={inputClass}
                style={{ borderColor: "var(--color-border)" }}
                required
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className={labelClass}
                style={{ color: "var(--color-text)" }}
              >
                End date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate}
                className={inputClass}
                style={{ borderColor: "var(--color-border)" }}
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="reason"
              className={labelClass}
              style={{ color: "var(--color-text)" }}
            >
              Reason
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={3}
              className={inputClass}
              style={{ borderColor: "var(--color-border)" }}
              placeholder="Brief reason for your leave (optional but helpful)"
              required
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 text-[15px] font-medium rounded-md transition-colors"
            style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
          >
            Submit request
          </button>
        </form>
      </div>

      <div>
        <h3
          className="text-lg font-medium mb-4"
          style={{ color: "var(--color-text)" }}
        >
          Your leave history
        </h3>
        <div
          className="rounded-lg border overflow-hidden"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <table className="min-w-full">
            <thead>
              <tr style={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
                <th
                  className="px-5 py-3 text-left text-[12px] font-medium uppercase tracking-wider"
                  style={{ color: "var(--color-muted)" }}
                >
                  Dates
                </th>
                <th
                  className="px-5 py-3 text-left text-[12px] font-medium uppercase tracking-wider"
                  style={{ color: "var(--color-muted)" }}
                >
                  Type
                </th>
                <th
                  className="px-5 py-3 text-left text-[12px] font-medium uppercase tracking-wider"
                  style={{ color: "var(--color-muted)" }}
                >
                  Impact Score
                </th>
                <th
                  className="px-5 py-3 text-left text-[12px] font-medium uppercase tracking-wider"
                  style={{ color: "var(--color-muted)" }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((leave) => {
                const sc = getStatusColor(leave.status);
                return (
                  <tr
                    key={leave._id}
                    className="border-t transition-colors hover:bg-black/2"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <td className="px-5 py-3.5 text-[14px]">
                      {new Date(leave.startDate).toLocaleDateString()} -{" "}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-[14px]">
                      {leave.leaveType}
                    </td>
                    <td
                      className="px-5 py-3.5 text-[14px]"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {leave.impactScore.toFixed(2)}
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
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
