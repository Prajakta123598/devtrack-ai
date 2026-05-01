import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import API from "../api/api";

function Dashboard() {
  const [projectCount, setProjectCount] = useState(0);
  const [bugCount, setBugCount] = useState(0);
  const [criticalBugCount, setCriticalBugCount] = useState(0);
  const [statusData, setStatusData] = useState([]);
  const [severityData, setSeverityData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data: projects } = await API.get("/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjectCount(projects.length);

      let allBugs = [];

      for (const project of projects) {
        const { data: bugs } = await API.get(`/api/bugs/${project._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        allBugs = [...allBugs, ...bugs];
      }

      setBugCount(allBugs.length);

      const critical = allBugs.filter(
        (bug) => bug.priority === "Critical" || bug.severity === "High"
      );

      setCriticalBugCount(critical.length);

      // Status Data
      const open = allBugs.filter((b) => (b.status || "Open") === "Open");
      const progress = allBugs.filter((b) => b.status === "In Progress");
      const closed = allBugs.filter((b) => b.status === "Closed");

      setStatusData([
        { name: "Open", bugs: open.length },
        { name: "In Progress", bugs: progress.length },
        { name: "Closed", bugs: closed.length },
      ]);

      // Severity Data
      const low = allBugs.filter((b) => b.severity === "Low");
      const medium = allBugs.filter((b) => b.severity === "Medium");
      const high = allBugs.filter((b) => b.severity === "High");

      setSeverityData([
        { name: "Low", value: low.length },
        { name: "Medium", value: medium.length },
        { name: "High", value: high.length },
      ]);
    } catch (error) {
      console.log("Dashboard fetch error:", error);
      alert(error.response?.data?.message || "Failed to load dashboard ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED useEffect (NO WARNING)
  useEffect(() => {
    const loadData = async () => {
      await fetchDashboardData();
    };

    loadData();
  }, []);

  // Loading UI
  if (loading) {
    return (
      <main className="p-6">
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <p className="text-lg font-semibold text-slate-700">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      {/* Header */}
      <section className="mb-8">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
          Overview
        </p>

        <h2 className="text-4xl font-bold text-slate-900 mt-2">
          Dashboard
        </h2>

        <p className="text-slate-600 mt-2">
          Welcome to your smart bug tracking dashboard.
        </p>
      </section>

      {/* Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-slate-500 font-semibold">Total Projects 📦</h3>
          <p className="text-5xl font-bold text-blue-600 mt-5">
            {projectCount}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-slate-500 font-semibold">Total Bugs 🐞</h3>
          <p className="text-5xl font-bold text-red-600 mt-5">{bugCount}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-slate-500 font-semibold">Critical Bugs 🚨</h3>
          <p className="text-5xl font-bold text-purple-600 mt-5">
            {criticalBugCount}
          </p>
        </div>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">
            Bug Status Analytics
          </h3>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="bugs" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">
            Bug Severity Analytics
          </h3>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {severityData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={["#22c55e", "#f59e0b", "#ef4444"][index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Smart Features */}
      <section className="bg-white rounded-2xl shadow p-6 mt-8">
        <h3 className="text-2xl font-bold text-slate-900">
          Smart Features Active
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <div className="bg-slate-50 p-4 rounded-xl">
            ✅ Duplicate bug detection
          </div>

          <div className="bg-slate-50 p-4 rounded-xl">
            ✅ Automatic priority suggestion
          </div>

          <div className="bg-slate-50 p-4 rounded-xl">
            ✅ Project-wise bug counting
          </div>

          <div className="bg-slate-50 p-4 rounded-xl">
            ✅ Status workflow tracking
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
