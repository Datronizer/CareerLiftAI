import React, { FC, useEffect, useState } from "react";


const AddCoursePage: FC<{ db: any; userId: string }> = ({ db, userId }) =>
{
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [listError, setListError] = useState(null);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [level, setLevel] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [success, setSuccess] = useState(null);

    const API_BASE = "http://localhost:4000"; // change if your backend uses another port

    const fetchCourses = async () =>
    {
        try
        {
            setLoading(true);
            setListError(null);
            const res = await fetch(`${API_BASE}/api/courses`);
            const data = await res.json();
            setCourses(data || []);
        } catch (err)
        {
            setListError("Failed to load courses: " + err.message);
        } finally
        {
            setLoading(false);
        }
    };

    useEffect(() =>
    {
        fetchCourses();
    }, []);

    const handleOpenAdd = () =>
    {
        setEditingCourse(null);
        setTitle("");
        setCategory("");
        setLevel("");
        setDescription("");
        setUrl("");
        setSaveError(null);
        setSuccess(null);
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (course) =>
    {
        setEditingCourse(course);
        setTitle(course.title || "");
        setCategory(course.category || "");
        setLevel(course.level || "");
        setDescription(course.description || "");
        setUrl(course.url || "");
        setSaveError(null);
        setSuccess(null);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () =>
    {
        setIsDrawerOpen(false);
        setEditingCourse(null);
        setSaveError(null);
        setSuccess(null);
    };

    const handleSave = async () =>
    {
        if (!title || !category || !level)
        {
            setSaveError("Please fill in all required fields.");
            return;
        }

        setSaving(true);
        setSaveError(null);
        setSuccess(null);

        try
        {
            const payload = {
                title,
                category,
                level,
                description,
                url,
                createdBy: userId || null,
            };

            let res;
            if (editingCourse)
            {
                res = await fetch(`${API_BASE}/api/courses/${editingCourse.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } else
            {
                res = await fetch(`${API_BASE}/api/courses`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }

            const data = await res.json();
            if (!res.ok)
            {
                throw new Error(data.error || "Failed to save course");
            }

            setSuccess(editingCourse ? "Course updated successfully!" : "Course added successfully!");
            await fetchCourses();
            handleCloseDrawer();
        } catch (err)
        {
            setSaveError(err.message);
        } finally
        {
            setSaving(false);
        }
    };

    const handleDelete = async (id) =>
    {
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (!confirmDelete) return;

        try
        {
            const res = await fetch(`${API_BASE}/api/courses/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok)
            {
                throw new Error(data.error || "Failed to delete course");
            }
            setCourses((prev) => prev.filter((c) => c.id !== id));
        } catch (err)
        {
            alert("Error deleting course: " + err.message);
        }
    };

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 md:px-6">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <h2 className="section-title">Courses</h2>
                {!isDrawerOpen && (
                    <button onClick={handleOpenAdd} className="btn btn-primary shadow-glow">
                        + Add Course
                    </button>
                )}
            </div>

            {listError && <p className="alert alert-error">{listError}</p>}
            {success && <p className="alert alert-success">{success}</p>}

            {loading ? (
                <p className="muted">Loading courses...</p>
            ) : courses.length === 0 ? (
                <p className="muted">No courses yet. Click “Add Course” to create one.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="flex flex-col justify-between gap-3 rounded-2xl border border-purple-400/40 bg-slate-900/70 p-4 shadow-xl backdrop-blur-xl sm:flex-row"
                        >
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-slate-50">{course.title}</h3>
                                <p className="text-slate-200/85">
                                    <span className="font-semibold text-cyan-300">Category:</span>{" "}
                                    {course.category || "N/A"}
                                </p>
                                <p className="text-slate-200/85">
                                    <span className="font-semibold text-cyan-300">Level:</span>{" "}
                                    {course.level || "N/A"}
                                </p>
                                {course.description && <p className="text-slate-200/85">{course.description}</p>}
                                {course.url && (
                                    <a
                                        href={course.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-semibold text-cyan-300 underline"
                                    >
                                        Open Course
                                    </a>
                                )}
                            </div>

                            <div className="flex flex-row gap-2 sm:min-w-[140px] sm:flex-col">
                                <button onClick={() => handleOpenEdit(course)} className="btn btn-ghost">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(course.id)} className="btn btn-secondary">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isDrawerOpen && (
                <div className="fixed inset-y-16 right-0 z-20 w-full max-w-md overflow-y-auto border-l border-purple-400/40 bg-gradient-to-b from-slate-900/95 to-slate-900/85 p-4 shadow-2xl backdrop-blur-xl sm:inset-y-16 sm:w-[380px]">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-50">
                            {editingCourse ? "Edit Course" : "Add New Course"}
                        </h3>
                        <button onClick={handleCloseDrawer} className="text-slate-200 hover:text-white">
                            ✕
                        </button>
                    </div>

                    {saveError && <p className="alert alert-error">{saveError}</p>}

                    <div className="flex flex-col gap-3">
                        <label className="field-label">
                            Course Title *
                            <input
                                className="input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Introduction to Cybersecurity"
                            />
                        </label>

                        <label className="field-label">
                            Category *
                            <input
                                className="input"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Ex: IT / Business / Engineering"
                            />
                        </label>

                        <label className="field-label">
                            Level *
                            <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
                                <option value="">Select...</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </label>

                        <label className="field-label">
                            Short Description
                            <textarea
                                className="textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add a short summary of the course..."
                            />
                        </label>

                        <label className="field-label">
                            Course URL
                            <input
                                className="input"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com/my-course"
                            />
                        </label>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn btn-primary shadow-glow"
                        >
                            {saving ? "Saving..." : editingCourse ? "Update Course" : "Save Course"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddCoursePage;
