import { useState } from "react";

export default function TicketList({ tickets, onDelete, onAdd }) {
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    priority: "",
    status: "",
    project: "",
  });
  const [newTicket, setNewTicket] = useState({
    incident_title: "",
    project: "",
    priority_id: "",
    assigned_person: ""
  });

  const role = localStorage.getItem("role");

  const toggleExpand = (ticketId) => {
    setExpandedTicket(expandedTicket === ticketId ? null : ticketId);
  };

  const filteredTickets = tickets.filter((t) => {
    const searchMatch =
      filters.search === "" ||
      t.incident_title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      t.id?.toString().includes(filters.search);
    const priorityMatch = filters.priority === "" || t.priority_name === filters.priority;
    const statusMatch = filters.status === "" || t.status === filters.status;
    const projectMatch = filters.project === "" || (t.project && t.project.toLowerCase().includes(filters.project.toLowerCase()));
    return searchMatch && priorityMatch && statusMatch && projectMatch;
  });

  const handleAddTicket = (e) => {
    e.preventDefault();
    if (!newTicket.incident_title || !newTicket.project || !newTicket.priority_id) {
      alert("Completează toate câmpurile!");
      return;
    }
    onAdd(newTicket);
    setNewTicket({
      incident_title: "",
      project: "",
      priority_id: "",
      assigned_person: ""
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Filtrare Avansată */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Filtrare Avansată
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Căutare ID / Titlu"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">Toate Prioritățile</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">Toate Statusurile</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>
          <input
            type="text"
            placeholder="Proiect"
            value={filters.project}
            onChange={(e) => setFilters({ ...filters, project: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Assigned Person"
            value={filters.assigned_person}
            onChange={(e) => setFilters({ ...filters, assigned_person: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Last Modified Date"
            value={filters.last_modified}
            onChange={(e) => setFilters({ ...filters, last_modified: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
      </div>

      {/* Form Adăugare Ticket (doar superuser) */}
      {role === "superuser" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-300">Adaugă Ticket Nou</h2>
          <form onSubmit={handleAddTicket} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Titlu Incident"
              value={newTicket.incident_title}
              onChange={(e) => setNewTicket({ ...newTicket, incident_title: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Proiect"
              value={newTicket.project}
              onChange={(e) => setNewTicket({ ...newTicket, project: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <select
              value={newTicket.priority_id}
              onChange={(e) => setNewTicket({ ...newTicket, priority_id: e.target.value })}
              className="p-2 border rounded"
              required
            >
              <option value="">Prioritate</option>
              <option value="1">Critical</option>
              <option value="2">High</option>
              <option value="3">Medium</option>
              <option value="4">Low</option>
            </select>
            <input
              type="text"
              placeholder="Assigned Person"
              value={newTicket.assigned_person}
              onChange={(e) => setNewTicket({ ...newTicket, assigned_person: e.target.value })}
              className="p-2 border rounded"
            />
            <div className="col-span-1 md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Adaugă Ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista Tickete */}
      <div className="grid grid-cols-1 gap-6">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className={`p-6 rounded-lg shadow transition-transform transform hover:scale-[1.01] ${
              ticket.priority_name === "Critical"
                ? "bg-red-200 dark:bg-red-700"
                : ticket.priority_name === "High"
                ? "bg-orange-200 dark:bg-orange-700"
                : ticket.priority_name === "Medium"
                ? "bg-yellow-200 dark:bg-yellow-700"
                : "bg-green-200 dark:bg-green-700"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                  #{ticket.id} - {ticket.incident_title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Status: <span className="font-semibold">{ticket.status}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Prioritate: {ticket.priority_name} | Proiect: {ticket.project}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleExpand(ticket.id)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  {expandedTicket === ticket.id ? "Ascunde" : "Detalii+"}
                </button>

                {role === "superuser" && onDelete && (
                  <button
                    onClick={() => onDelete(ticket.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Șterge
                  </button>
                )}
              </div>
            </div>

            {/* Informații suplimentare */}
            {expandedTicket === ticket.id && (
              <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded">
                <p className="text-gray-600 dark:text-gray-300"><b>Start Date:</b> {ticket.start_date}</p>
                <p className="text-gray-600 dark:text-gray-300"><b>Proiect:</b> {ticket.project}</p>
                <p className="text-gray-600 dark:text-gray-300"><b>Assigned:</b> {ticket.assigned_person || "Neasignat"}</p>
                <p className="text-gray-600 dark:text-gray-300"><b>Last Modified:</b> {ticket.last_modified_date || "N/A"}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
