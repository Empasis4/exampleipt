import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Example() {
    const [contacts, setContacts] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        const res = await axios.get("/api/contacts");
        setContacts(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post("/api/contacts", form);
        setForm({ name: "", email: "", message: "" });
        fetchContacts();
    };

    const handleDelete = async (id) => {
        await axios.delete(`/api/contacts/${id}`);
        fetchContacts();
    };

    const handleUpdate = async (id) => {
        const updatedContact = { ...form, id };
        await axios.put(`/api/contacts/${id}`, updatedContact);
        setForm({ name: "", email: "", message: "" });
        fetchContacts();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-2xl rounded-lg p-10">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
                    Contact Us
                </h1>

                {/* Form */}
                <div className="mb-10">
                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-6"
                    >
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <textarea
                            placeholder="Message"
                            value={form.message}
                            onChange={(e) =>
                                setForm({ ...form, message: e.target.value })
                            }
                            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
                        >
                            Submit
                        </button>
                    </form>
                </div>

                {/* Contacts Table */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
                        Saved Contacts
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 text-sm rounded-lg overflow-hidden shadow-sm">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="px-4 py-3 border text-left">Name</th>
                                    <th className="px-4 py-3 border text-left">Email</th>
                                    <th className="px-4 py-3 border text-left w-1/2">Message</th>
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
                                            No contacts available.
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
                                            <td className="px-4 py-3 border align-top">{c.message}</td>
                                            <td className="px-4 py-3 border text-center">
                                                <button
                                                    onClick={() => handleDelete(c.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    onClick={() => handleUpdate(c.id)}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs ml-2"
                                                >
                                                    Edit
                                                </button>
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
