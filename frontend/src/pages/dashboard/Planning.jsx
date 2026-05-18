import React, { useEffect, useState } from "react";
import { X, Plus, Info, Trash2, Edit } from "lucide-react";

const API_PLANNINGS = "http://localhost:5000/api/plannings";

export default function PlanningCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const [plannings, setPlannings] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [drawerItem, setDrawerItem] = useState(null);

  const [editItem, setEditItem] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    tag: "",
    date: "",
  });

  const token = localStorage.getItem("token");

  const fetchPlannings = async () => {
    const res = await fetch(API_PLANNINGS, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPlannings(data);
  };

  useEffect(() => {
    fetchPlannings();
  }, []);

  const addPlanning = async () => {
    const isEdit = !!editItem;

    const url = isEdit
      ? `${API_PLANNINGS}/${editItem._id}`
      : API_PLANNINGS;

    const method = isEdit ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    setForm({ title: "", description: "", tag: "", date: "" });
    setEditItem(null);
    setShowForm(false);
    fetchPlannings();
  };

  const deletePlanning = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this planning?"
    );

    if (!confirmDelete) return;

    await fetch(`${API_PLANNINGS}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchPlannings();
  };

  const updatePlanning = (item) => {
    setEditItem(item);

    setForm({
      title: item.title,
      description: item.description,
      tag: item.tag,
      date: item.date?.slice(0, 10),
    });

    setShowForm(true);
  };


  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  //2026-05-17
  const getDateStr = (day) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;

//This function filters planning items by date.
  const getItemsForDay = (day) => {
    const dateStr = getDateStr(day);
    return plannings.filter((p) => p.date?.slice(0, 10) === dateStr);
  };

  const today = new Date();

  const isToday = (day) =>
    year === today.getFullYear() &&
    month === today.getMonth() &&
    day === today.getDate();


    //This function counts how many items exist for each tag/category.
    const groupTags = (items) => {
    return items.reduce((acc, item) => {
      acc[item.tag] = (acc[item.tag] || 0) + 1;
      return acc;
    }, {});
  };

  return (
<div className="h-screen w-full bg-white flex flex-col px-3 sm:px-6 lg:px-8 py-4 overflow-hidden">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-blue-600">
          Planning Calendar
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(new Date(year, month - 1))}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Today
          </button>

          <button
            onClick={() => setCurrentDate(new Date(year, month + 1))}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>

      <h2 className="text-sm text-gray-600 mb-3">
        {currentDate.toLocaleString("default", { month: "long" })} {year}
      </h2>

      {/* CALENDAR */}
<div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 overflow-auto">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={i}></div>
        ))}

        {daysArray.map((day) => {
          const items = getItemsForDay(day);
          const tags = groupTags(items);

          return (
            <div
              key={day}
              onClick={() => {
                setSelectedDay(day);
                setShowModal(true);
              }}
              className={`
  border rounded-lg p-2 min-h-[90px]
  flex flex-col justify-between
  hover:border-blue-400 hover:shadow
  transition cursor-pointer
  overflow-hidden
  text-xs sm:text-sm
  ${isToday(day) ? "bg-blue-50 border-blue-500" : ""}
`}
            >
              <div className="flex justify-between">
                <span className="font-bold text-blue-600">{day}</span>

                {items.length > 0 && (
                  <span className="text-xs bg-blue-600 text-white px-2 rounded-full">
                    {items.length}
                  </span>
                )}
              </div>

              {/* TAGS */}
              <div className="mt-1 flex flex-wrap gap-1">
                {Object.entries(tags)
                  .slice(0, 3)
                  .map(([tag, count]) => (
                    <span
                      key={tag}
                      className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded"
                    >
                      {tag} {count > 1 ? `(${count})` : ""}
                    </span>
                  ))}
              </div>
            </div>
          );
        })}
      </div>


      {showModal && selectedDay && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-[550px] p-5 rounded-lg relative">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2"
            >
              <X />
            </button>

            <h2 className="text-lg font-bold text-blue-600">
              Day {selectedDay}
            </h2>

            {/* ADD BUTTON */}
            <button
              onClick={() => {
                setEditItem(null);
                setForm({
                  title: "",
                  description: "",
                  tag: "",
                  date: getDateStr(selectedDay),
                });
                setShowForm(true);
              }}
              className="mt-3 bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2"
            >
              <Plus size={14} /> Add Planning
            </button>

            {/* LIST */}
            <div className="mt-4 space-y-2 max-h-[300px] overflow-auto">

              {getItemsForDay(selectedDay).map((item) => (
                <div
                  key={item._id}
                  className="border p-2 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.tag}</p>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setDrawerItem(item)}>
                      <Info size={16} className="text-blue-600" />
                    </button>

                    <button onClick={() => updatePlanning(item)}>
                      <Edit size={16} className="text-green-600" />
                    </button>

                    <button onClick={() => deletePlanning(item._id)}>
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      )}


      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-[400px] p-4 rounded-lg">

            <h2 className="font-bold text-blue-600 mb-2">
              {editItem ? "Update Planning" : "Add Planning"}
            </h2>

            <input
              className="w-full border p-2 mb-2"
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <textarea
              className="w-full border p-2 mb-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input
              className="w-full border p-2 mb-2"
              placeholder="Tag"
              value={form.tag}
              onChange={(e) =>
                setForm({ ...form, tag: e.target.value })
              }
            />

            <button
              onClick={addPlanning}
              className="bg-blue-600 text-white px-3 py-1 rounded w-full"
            >
              {editItem ? "Update" : "Save"}
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="mt-2 w-full border px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}


      {drawerItem && (
        <div className="fixed right-0 top-0 h-full w-[350px] bg-white border-l p-4">

          <button
            onClick={() => setDrawerItem(null)}
            className="absolute top-2 right-2"
          >
            <X />
          </button>

          <h2 className="text-lg font-bold text-blue-600">
            {drawerItem.title}
          </h2>

          <p className="text-sm mt-2">{drawerItem.description}</p>

          <p className="text-xs mt-2 text-gray-500">
            Tag: {drawerItem.tag}
          </p>
        </div>
      )}
    </div>
  );
}