import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";

function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({ totalUsers: 0, totalBooks: 0 });
  const [loading, setLoading] = useState(true);
  const [bookForm, setBookForm] = useState({ title: "", author: "" });
  const [adminForm, setAdminForm] = useState({ name: "", email: "", password: "" });
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const requests = [axiosInstance.get("/books")];

      if (isAdmin) {
        requests.push(axiosInstance.get("/users/summary"));
        requests.push(axiosInstance.get("/users"));
      }

      const [booksResponse, summaryResponse, usersResponse] = await Promise.all(requests);
      setBooks(booksResponse.data.data);
      setSummary(summaryResponse?.data?.data || { totalUsers: 0, totalBooks: booksResponse.data.data.length });
      setUsers(usersResponse?.data?.data || []);
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Failed to load dashboard";
      setError(message);

      if (requestError.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleIssue = async (id) => {
    setFeedback("");
    setError("");

    try {
      await axiosInstance.post(`/books/${id}/issue`);
      setFeedback("Book issued successfully");
      loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to issue book");
    }
  };

  const handleReturn = async (id) => {
    setFeedback("");
    setError("");

    try {
      await axiosInstance.post(`/books/${id}/return`);
      setFeedback("Book returned successfully");
      loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to return book");
    }
  };

  const handleDelete = async (id) => {
    setFeedback("");
    setError("");

    try {
      await axiosInstance.delete(`/books/${id}`);
      setFeedback("Book deleted successfully");
      loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete book");
    }
  };

  const handleAddBook = async (event) => {
    event.preventDefault();
    setFeedback("");
    setError("");

    try {
      await axiosInstance.post("/books", bookForm);
      setBookForm({ title: "", author: "" });
      setFeedback("Book added successfully");
      loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to add book");
    }
  };

  const updateBookForm = (event) => {
    setBookForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const updateAdminForm = (event) => {
    setAdminForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleAddAdmin = async (event) => {
    event.preventDefault();
    setFeedback("");
    setError("");

    try {
      await axiosInstance.post("/users/admins", adminForm);
      setAdminForm({ name: "", email: "", password: "" });
      setFeedback("Admin added successfully");
      loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to add admin");
    }
  };

  const handleRemoveUser = async (listedUser) => {
    setFeedback("");
    setError("");

    try {
      await axiosInstance.delete(`/users/${listedUser._id}`);
      setFeedback(`${listedUser.name} removed successfully`);
      loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to remove user");
    }
  };

  return (
    <div className="dashboard-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">Library Console</span>
          <h1>{isAdmin ? "Admin Dashboard" : "User Dashboard"}</h1>
          <p className="muted">
            Signed in as {user?.name} ({user?.role})
          </p>
        </div>
        <button className="secondary-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {feedback ? <div className="feedback success">{feedback}</div> : null}
      {error ? <div className="feedback error">{error}</div> : null}

      <section className="panel-grid">
        {isAdmin ? (
          <section className="stats-grid">
            <article className="panel stat-card">
              <span className="eyebrow">Users</span>
              <h2>{summary.totalUsers}</h2>
              <p className="muted">Registered accounts in the system</p>
            </article>
            <article className="panel stat-card">
              <span className="eyebrow">Books</span>
              <h2>{summary.totalBooks}</h2>
              <p className="muted">Books currently in the catalog</p>
            </article>
          </section>
        ) : null}

        <section className="panel panel-wide">
          <div className="panel-header">
            <h2>Books</h2>
            <p className="muted">Browse catalog and manage issue or return actions.</p>
          </div>

          {loading ? (
            <p>Loading books...</p>
          ) : (
            <div className="book-grid">
              {books.map((book) => {
                const isIssuedByCurrentUser = book.issuedTo?._id === user?._id;

                return (
                  <article className="book-card" key={book._id}>
                    <div>
                      <h3>{book.title}</h3>
                      <p>{book.author}</p>
                      <span className={book.available ? "status available" : "status issued"}>
                        {book.available ? "Available" : `Issued to ${book.issuedTo?.name || "User"}`}
                      </span>
                    </div>
                    <div className="book-actions">
                      <button disabled={!book.available} onClick={() => handleIssue(book._id)}>
                        Issue
                      </button>
                      <button
                        className="secondary-btn"
                        disabled={book.available || !isIssuedByCurrentUser}
                        onClick={() => handleReturn(book._id)}
                      >
                        Return
                      </button>
                      {isAdmin ? (
                        <button className="danger-btn" onClick={() => handleDelete(book._id)}>
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {isAdmin ? (
          <>
            <section className="panel">
              <div className="panel-header">
                <h2>Add Book</h2>
                <p className="muted">Create a new catalog item.</p>
              </div>
              <form className="auth-form" onSubmit={handleAddBook}>
                <input
                  name="title"
                  placeholder="Book title"
                  value={bookForm.title}
                  onChange={updateBookForm}
                  required
                />
                <input
                  name="author"
                  placeholder="Author name"
                  value={bookForm.author}
                  onChange={updateBookForm}
                  required
                />
                <button type="submit">Add Book</button>
              </form>
            </section>

            <section className="panel">
              <div className="panel-header">
                <h2>Add Admin</h2>
                <p className="muted">Create another admin account from the dashboard.</p>
              </div>
              <form className="auth-form" onSubmit={handleAddAdmin}>
                <input
                  name="name"
                  placeholder="Admin name"
                  value={adminForm.name}
                  onChange={updateAdminForm}
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Admin email"
                  value={adminForm.email}
                  onChange={updateAdminForm}
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={adminForm.password}
                  onChange={updateAdminForm}
                  minLength={6}
                  required
                />
                <button type="submit">Add Admin</button>
              </form>
            </section>

            <section className="panel">
              <div className="panel-header">
                <h2>Users</h2>
                <p className="muted">View members and remove user accounts when needed.</p>
              </div>
              <div className="user-list">
                {users.map((listedUser) => {
                  const canRemove = listedUser.role === "user" && listedUser._id !== user?._id;

                  return (
                    <div className="user-row" key={listedUser._id}>
                      <div>
                        <strong>{listedUser.name}</strong>
                        <p className="muted">{listedUser.email}</p>
                      </div>
                      <div className="user-row-actions">
                        <span className="pill">{listedUser.role}</span>
                        {canRemove ? (
                          <button
                            className="danger-btn"
                            type="button"
                            onClick={() => handleRemoveUser(listedUser)}
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        ) : null}
      </section>
    </div>
  );
}

export default DashboardPage;
