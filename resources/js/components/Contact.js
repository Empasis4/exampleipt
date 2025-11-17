import React, { useState, useEffect } from "react";
import axios from "axios";

const IconButton=({title,onClick,children})=> (
  <button onClick={onClick} title={title} className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gray-900 text-white border border-gray-900">
    {children}
  </button>
);
const iconProps={width:16,height:16,fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'};
const PencilIcon=()=> (
  <svg {...iconProps} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
  </svg>
);
const TrashIcon=()=> (
  <svg {...iconProps} viewBox="0 0 24 24" aria-hidden="true">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/>
    <path d="M14 11v6"/>
    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
  </svg>
);

export default function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [editing, setEditing] = useState(null);

    // GET - Fetch contacts
    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await axios.get("/contacts");
            setContacts(res.data);
        } catch (err) {
            console.error("Error fetching contacts:", err);
        }
    };

    // POST or PUT - Save contact
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                // PUT (update)
                await axios.put(`/contacts/${editing}`, form);
            } else {
                // POST (create)
                await axios.post("/contacts", form);
            }
            setForm({ name: "", email: "", message: "" });
            setEditing(null);
            fetchContacts();
        } catch (err) {
            console.error("Error saving contact:", err);
        }
    };

    // DELETE
    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this contact?")) {
            await axios.delete(`/contacts/${id}`);
            fetchContacts();
        }
    };

    // Edit (load form with data)
    const handleEdit = (contact) => {
        setForm({ name: contact.name, email: contact.email, message: contact.message });
        setEditing(contact.id);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10">
            <div className="w-full max-w-3xl space-y-8">
                {/* Form Card */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">
                        {editing ? "✏️ Edit Contact" : "➕ Add New Contact"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <textarea
                            placeholder="Message"
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                        >
                            {editing ? "Update Contact" : "Save Contact"}
                        </button>
                    </form>
                </div>

                {/* Contacts Table */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">📋 Contacts</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 text-sm rounded-lg">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="px-4 py-3 border text-left">Full Name</th>
                                    <th className="px-4 py-3 border text-left">Email</th>
                                    <th className="px-4 py-3 border text-left">Message</th>
                                    <th className="px-4 py-3 border text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-4 py-6 text-center text-gray-500"
                                        >
                                            No contacts found.
                                        </td>
                                    </tr>
                                ) : (
                                    contacts.map((c) => (
                                        <tr
                                            key={c.id}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="px-4 py-3 border">{c.name}</td>
                                            <td className="px-4 py-3 border">{c.email}</td>
                                            <td className="px-4 py-3 border">{c.message}</td>
                                            <td className="px-4 py-3 border text-center">
                                                <span className="inline-flex gap-2 justify-center">
                                                  <IconButton title="Edit" onClick={() => handleEdit(c)}><PencilIcon/></IconButton>
                                                  <IconButton title="Delete" onClick={() => handleDelete(c.id)}><TrashIcon/></IconButton>
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
