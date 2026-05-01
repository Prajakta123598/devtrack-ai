import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

function Bugs() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [bugs, setBugs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Low");
  const [rootCause, setRootCause] = useState("");
  const [loading, setLoading] = useState(true);

  const getStatusClass = (status) => {
    if (status === "Closed") return "bg-green-100 text-green-700";
    if (status === "In Progress") return "bg-yellow-100 text-yellow-700";
    return "bg-blue-100 text-blue-700";
  };

  const getSeverityClass = (level) => {
    if (level === "High") return "bg-red-100 text-red-700";
    if (level === "Medium") return "bg-orange-100 text-orange-700";
    return "bg-slate-100 text-slate-700";
  };

  const getPriorityClass = (priority) => {
    if (priority === "Critical") return "bg-purple-100 text-purple-700";
    if (priority === "High") return "bg-red-100 text-red-700";
    if (priority === "Medium") return "bg-orange-100 text-orange-700";
    return "bg-slate-100 text-slate-700";
  };

  const fetchBugs = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const { data } = await API.get(`/api/bugs/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBugs(data);
    } catch (error) {
      console.log("Fetch bugs error:", error);
      alert(error.response?.data?.message || "Failed to fetch bugs ❌");
    } finally {
      setLoading(false);
    }
  };

  const createBugHandler = async (e) => {
    e.preventDefault();

    if (!title || !description || !severity || !rootCause) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/api/bugs",
        {
          projectId,
          title,
          description,
          severity,
          rootCause,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Bug created successfully ✅");

      setTitle("");
      setDescription("");
      setSeverity("Low");
      setRootCause("");

      fetchBugs();
    } catch (error) {
      console.log("Create bug error:", error);
      alert(error.response?.data?.message || "Bug creation failed ❌");
    }
  };

  const updateStatusHandler = async (bugId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/api/bugs/${bugId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchBugs();
    } catch (error) {
      console.log("Update bug error:", error);
      alert(error.response?.data?.message || "Bug update failed ❌");
    }
  };

  const deleteBugHandler = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bug?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/api/bugs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Bug deleted successfully ✅");
      fetchBugs();
    } catch (error) {
      console.log("Delete bug error:", error);
      alert(error.response?.data?.message || "Bug delete failed ❌");
    }
  };

  useEffect(() => {
    const loadBugs = async () => {
      await fetchBugs();
    };

    loadBugs();
  }, []);

  return (
    <main className="p-6">
      <section className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Bug Workspace
          </p>

          <h2 className="text-4xl font-bold text-slate-900 mt-2">
            Project Bugs
          </h2>

          <p className="text-slate-600 mt-2">
            Add, track, update, and resolve bugs for this project.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/projects")}
          className="bg-slate-900 text-white px-5 py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
        >
          ← Back to Projects
        </button>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          onSubmit={createBugHandler}
          className="bg-white p-6 rounded-2xl shadow lg:col-span-1 space-y-4"
        >
          <h3 className="text-2xl font-bold text-slate-900">Create Bug</h3>

          <input
            type="text"
            placeholder="Bug Title"
            className="w-full border border-slate-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            rows="4"
            className="w-full border border-slate-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="w-full border border-slate-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="Low">Low Severity</option>
            <option value="Medium">Medium Severity</option>
            <option value="High">High Severity</option>
          </select>

          <input
            type="text"
            placeholder="Root Cause"
            className="w-full border border-slate-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            + Create Bug
          </button>
        </form>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white rounded-2xl shadow p-8 text-center">
              <p className="text-lg font-semibold text-slate-700">
                Loading bugs...
              </p>
            </div>
          ) : bugs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-8 text-center">
              <p className="text-4xl mb-3">🐞</p>
              <h3 className="text-xl font-bold text-slate-900">
                No bugs found
              </h3>
              <p className="text-slate-500 mt-2">
                Create your first bug for this project.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bugs.map((bug) => (
                <div
                  key={bug._id}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {bug.title}
                      </h3>

                      <p className="text-slate-600 mt-2">{bug.description}</p>
                    </div>

                    <span className="text-3xl">🐞</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-5">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityClass(
                        bug.severity
                      )}`}
                    >
                      Severity: {bug.severity}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityClass(
                        bug.priority
                      )}`}
                    >
                      Priority: {bug.priority || "Not assigned"}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                        bug.status || "Open"
                      )}`}
                    >
                      Status: {bug.status || "Open"}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 mt-5">
                    <p className="text-sm text-slate-500">Root Cause</p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {bug.rootCause}
                    </p>
                  </div>

                  <div className="mt-5">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Update Status
                    </label>

                    <select
                      className="w-full border border-slate-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      value={bug.status || "Open"}
                      onChange={(e) =>
                        updateStatusHandler(bug._id, e.target.value)
                      }
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteBugHandler(bug._id)}
                    className="mt-5 w-full bg-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
                  >
                    Delete Bug
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Bugs;