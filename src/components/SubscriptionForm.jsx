import { useState, useEffect } from "react";

function SubscriptionForm({
  formData,
  setFormData,
  onSave,
  onCancel,
  isEditing,
}) {
  const [customPlan, setCustomPlan] = useState(false);

  const standardPlans = ["Netflix Premium", "Spotify Family", "Amazon Prime", "Disney+ Hotstar", "YouTube Premium", "Other"];

  useEffect(() => {
    if (formData.plan_name && !standardPlans.slice(0, 5).includes(formData.plan_name)) {
      setCustomPlan(true);
    } else {
      setCustomPlan(false);
    }
  }, [formData.plan_name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlanSelectChange = (e) => {
    const value = e.target.value;
    if (value === "Other") {
      setCustomPlan(true);
      setFormData((prev) => ({ ...prev, plan_name: "" }));
    } else {
      setCustomPlan(false);
      setFormData((prev) => ({ ...prev, plan_name: value }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "Edit Subscription" : "Add New Subscription"}</h2>
          <button className="close-btn" onClick={onCancel}>&times;</button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
          <div className="form-group">
            <label htmlFor="user_email">User Email <span className="required">*</span></label>
            <input
              id="user_email"
              type="email"
              name="user_email"
              value={formData.user_email || ""}
              onChange={handleChange}
              placeholder="e.g. user@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="plan_select">Subscription Plan <span className="required">*</span></label>
            {!customPlan ? (
              <select
                id="plan_select"
                value={standardPlans.includes(formData.plan_name) ? formData.plan_name : "Other"}
                onChange={handlePlanSelectChange}
              >
                {standardPlans.map((plan) => (
                  <option key={plan} value={plan}>
                    {plan}
                  </option>
                ))}
              </select>
            ) : (
              <div className="custom-plan-wrapper">
                <input
                  type="text"
                  name="plan_name"
                  value={formData.plan_name || ""}
                  onChange={handleChange}
                  placeholder="Enter custom plan name"
                  required
                />
                <button
                  type="button"
                  className="switch-plan-btn"
                  onClick={() => setCustomPlan(false)}
                >
                  Select Preset
                </button>
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_date">Start Date <span className="required">*</span></label>
              <input
                id="start_date"
                type="date"
                name="start_date"
                value={formData.start_date || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_date">End Date <span className="required">*</span></label>
              <input
                id="end_date"
                type="date"
                name="end_date"
                value={formData.end_date || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="monthly_cost">Monthly Cost ($) <span className="required">*</span></label>
              <input
                id="monthly_cost"
                type="number"
                step="0.01"
                min="0"
                name="monthly_cost"
                value={formData.monthly_cost !== undefined ? formData.monthly_cost : ""}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status <span className="required">*</span></label>
              <select
                id="status"
                name="status"
                value={formData.status || "Active"}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="btn-group">
            <button type="submit" className="save-btn">
              {isEditing ? "Update Subscription" : "Add Subscription"}
            </button>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubscriptionForm;