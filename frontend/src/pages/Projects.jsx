import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const { data } = await API.get("/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects(data);
    } catch (error) {
      console.log("Fetch projects error:", error);
      alert(error.response?.data?.message || "Failed to fetch projects ❌");
    } finally {
      setLoading(false);
    }
  };

  const createProjectHandler = async (e) => {
    e.preventDefault();

    if (!projectName || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/api/projects",
        {
          projectName,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Project created successfully ✅");

      setProjectName("");
      setDescription("");
      fetchProjects();
    } catch (error) {
      console.log("Create project error:", error);
      alert(error.response?.data?.message || "Project creation failed ❌");
    }
  };

  const deleteProjectHandler = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Project deleted successfully ✅");
      fetchProjects();
    } catch (error) {
      console.log("Delete project error:", error);
      alert(error.response?.data?.message || "Delete failed ❌");
    }
  };

  useEffect(() => {
    const loadProjects = async () => {
      await fetchProjects();
    };

    loadProjects();
  }, []);

  return (
    <main className="p-6">
      <section className="mb-8">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
          Project Workspace
        </p>

        <h2 className="text-4xl font-bold text-slate-900 mt-2">
          My Projects
        </h2>

        <p className="text-slate-600 mt-2">
          Create projects and manage all bugs project-wise.
        </p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          onSubmit={createProjectHandler}
          className="bg-white p-6 rounded-2xl shadow lg:col-span-1 space-y-4"
        >
          <h3 className="text-2xl font-bold text-slate-900">
            Create Project
          </h3>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Project Name
            </label>

            <input
              type="text"
              placeholder="Example: DevTrack AI"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Description
            </label>

            <textarea
              placeholder="Write short project description"
              rows="4"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            + Create Project
          </button>
        </form>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white rounded-2xl shadow p-8 text-center">
              <p className="text-lg font-semibold text-slate-700">
                Loading projects...
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-8 text-center">
              <p className="text-4xl mb-3">📦</p>
              <h3 className="text-xl font-bold text-slate-900">
                No projects found
              </h3>
              <p className="text-slate-500 mt-2">
                Create your first project to start tracking bugs.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {project.projectName}
                      </h3>

                      <p className="text-slate-600 mt-2">
                        {project.description}
                      </p>
                    </div>

                    <span className="text-3xl">📁</span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 mt-5">
                    <p className="text-sm text-slate-500">Total Bugs</p>
                    <p className="text-3xl font-bold text-red-600">
                      {project.bugCount || 0}
                    </p>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button
                      type="button"
                      onClick={() => navigate(`/bugs/${project._id}`)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                      View Bugs
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteProjectHandler(project._id)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Projects;