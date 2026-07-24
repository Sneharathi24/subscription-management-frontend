import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

import SubscriptionForm from "./components/SubscriptionForm";
import SubscriptionTable from "./components/SubscriptionTable";
import DeleteModal from "./components/DeleteModal";
import { API_BASE_URL } from "./config";

function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingSub, setEditingSub] = useState(null);

  const initialFormState = {
    user_email: "",
    plan_name: "Netflix Premium",
    start_date: "",
    end_date: "",
    monthly_cost: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/subscriptions`);
      if (!res.ok) {
        throw new Error("Failed to fetch subscriptions from server.");
      }
      const data = await res.json();
      setSubscriptions(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load subscriptions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const calculateRemainingDays = (endDate) => {
    if (!endDate) return { text: "-", isExpired: false };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: "Expired", isExpired: true };
    }
    if (diffDays === 0) {
      return { text: "Expires Today", isExpired: false };
    }
    return { text: `${diffDays} days`, isExpired: false };
  };

  const handleSave = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.user_email || !emailRegex.test(formData.user_email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!formData.plan_name || formData.plan_name.trim() === "") {
      toast.error("Please specify a plan name.");
      return;
    }

    if (!formData.start_date) {
      toast.error("Please select a start date.");
      return;
    }

    if (!formData.end_date) {
      toast.error("Please select an end date.");
      return;
    }

    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      toast.error("End Date cannot be before Start Date.");
      return;
    }

    if (
      formData.monthly_cost === undefined ||
      formData.monthly_cost === "" ||
      Number(formData.monthly_cost) < 0
    ) {
      toast.error("Monthly cost cannot be negative.");
      return;
    }

    try {
      if (!editingSub) {
        const res = await fetch(`${API_BASE_URL}/api/subscriptions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to create subscription.");
        }

        toast.success("Subscription added successfully!");
      } else {
        const res = await fetch(
          `${API_BASE_URL}/api/subscriptions/${editingSub.subscription_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to update subscription.");
        }

        toast.success("Subscription updated successfully!");
      }

      setShowForm(false);
      setEditingSub(null);
      setFormData(initialFormState);
      fetchSubscriptions();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "An error occurred.");
    }
  };

  const handleEdit = (subscription) => {
    setEditingSub(subscription);
    setFormData({
      user_email: subscription.user_email,
      plan_name: subscription.plan_name,
      start_date: subscription.start_date,
      end_date: subscription.end_date,
      monthly_cost: subscription.monthly_cost,
      status: subscription.status,
    });
    setShowForm(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/subscriptions/${deleteId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete subscription.");
      }

      toast.success("Subscription deleted successfully!");
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchSubscriptions();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "An error occurred.");
    }
  };

  return (
    <div className="app-wrapper">
      <ToastContainer position="top-right" autoClose={3000} />

      <header className="app-header">
        <div className="header-content">
          <div className="logo-group">
            <span className="logo-icon">⚡</span>
            <div>
              <h1>Subscription Manager</h1>
              <p className="subtitle">Track and manage active user subscriptions</p>
            </div>
          </div>
          <button
            className="add-btn"
            onClick={() => {
              setEditingSub(null);
              setFormData(initialFormState);
              setShowForm(true);
            }}
          >
            + Add New Subscription
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="stats-bar">
          <div className="stat-card">
            <span className="stat-label">Total Subscriptions</span>
            <span className="stat-value">{subscriptions.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Active Subscriptions</span>
            <span className="stat-value active-count">
              {subscriptions.filter((s) => s.status === "Active").length}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Monthly Spend</span>
            <span className="stat-value">
              $
              {subscriptions
                .reduce((acc, s) => acc + Number(s.monthly_cost || 0), 0)
                .toFixed(2)}
            </span>
          </div>
        </div>

        <SubscriptionTable
          subscriptions={subscriptions}
          calculateRemainingDays={calculateRemainingDays}
          handleEdit={handleEdit}
          handleDelete={handleDeleteClick}
          isLoading={isLoading}
        />

        {showForm && (
          <SubscriptionForm
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingSub(null);
            }}
            isEditing={!!editingSub}
          />
        )}

        {showDeleteModal && (
          <DeleteModal
            onCancel={() => setShowDeleteModal(false)}
            onDelete={confirmDelete}
          />
        )}
      </main>
    </div>
  );
}

export default App;
