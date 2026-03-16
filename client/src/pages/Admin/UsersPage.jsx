import React, { useEffect, useState } from 'react';
import { SearchBar, ConfirmDialog, EmptyState, StatusBadge } from '../../components/ui/SharedComponents';

const demoUsers = [
  { id: 1, name: "Suresh K", email: "sk@depots.com", role: "depot", active: true },
  { id: 2, name: "Leela P", email: "leela@crew.com", role: "crew", active: true },
  { id: 3, name: "Arjun S", email: "arjun@dtc.com", role: "admin", active: false },
];
const roleOptions = ["admin", "depot", "scheduler", "crew"];

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => { setUsers(demoUsers); setLoading(false); }, 700);
  }, []);

  const filtered = users.filter(
    u => u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.role.toLowerCase().includes(query.toLowerCase())
  );

  const handleRoleChange = (id, role) => {
    setUsers(users => users.map(u => (u.id === id ? { ...u, role } : u)));
    alert("Role updated!");
  };

  const handleSelect = (id, checked) => {
    setSelected(s => { const sNew = new Set(s); if (checked) sNew.add(id); else sNew.delete(id); return sNew; });
  };

  const handleBulkDelete = () => {
    if (selected.size === 0) return;
    setUsers(users => users.filter(u => !selected.has(u.id)));
    setSelected(new Set());
    setConfirmOpen(false);
    alert("Users deleted!");
  };

  return (
    <div>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Users"
        message={`Are you sure you want to delete ${selected.size} selected user(s)? This action cannot be undone.`}
        onConfirm={handleBulkDelete}
        onCancel={() => setConfirmOpen(false)}
        type="danger"
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <SearchBar value={query} onChange={setQuery} placeholder="Search users by name, email, or role..." />
        <button className="btn-danger-custom" disabled={selected.size === 0} onClick={() => setConfirmOpen(true)}>
          <i className="bi bi-trash3"></i> Delete Selected ({selected.size})
        </button>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 20 }}>
              {[1, 2, 3].map(i => <div key={i} className="skeleton skeleton-row" style={{ marginBottom: 8 }}></div>)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState icon="bi-people" title="No users found" description="Try adjusting your search or add a new user." />
          ) : (
            <table className="table-custom">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <input type="checkbox"
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onChange={e => setSelected(e.target.checked ? new Set(filtered.map(u => u.id)) : new Set())}
                    />
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td>
                      <input type="checkbox" checked={selected.has(u.id)} onChange={e => handleSelect(u.id, e.target.checked)} />
                    </td>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td style={{ color: 'var(--gray-500)' }}>{u.email}</td>
                    <td>
                      <select className="select-custom" style={{ width: 'auto', padding: '5px 30px 5px 10px', fontSize: 12 }}
                        value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}>
                        {roleOptions.map(role => <option key={role} value={role}>{role}</option>)}
                      </select>
                    </td>
                    <td><StatusBadge status={u.active ? 'active' : 'idle'} /></td>
                    <td>
                      <button className="btn-danger-custom" style={{ padding: '5px 10px', fontSize: 12 }}
                        onClick={() => { setSelected(new Set([u.id])); setConfirmOpen(true); }}>
                        <i className="bi bi-trash3"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
