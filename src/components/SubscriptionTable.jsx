function SubscriptionTable({
  subscriptions,
  calculateRemainingDays,
  handleEdit,
  handleDelete,
  isLoading
}) {
  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading subscriptions...</p>
      </div>
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">💳</div>
        <h3>No Subscriptions Found</h3>
        <p>Click "+ Add Subscription" above to create your first record.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="subscription-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Plan</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Remaining Days</th>
            <th>Monthly Cost</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => {
            const { text: remainingText, isExpired } = calculateRemainingDays(sub.end_date);
            const displayStatus = isExpired && sub.status === "Active" ? "Expired" : sub.status;

            return (
              <tr key={sub.subscription_id}>
                <td className="id-cell">#{sub.subscription_id}</td>
                <td className="email-cell">{sub.user_email}</td>
                <td className="plan-cell">
                  <span className="plan-name">{sub.plan_name}</span>
                </td>
                <td>{sub.start_date}</td>
                <td>{sub.end_date}</td>
                <td>
                  <span className={`remaining-badge ${isExpired ? "expired-days" : "active-days"}`}>
                    {remainingText}
                  </span>
                </td>
                <td className="cost-cell">${Number(sub.monthly_cost).toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${displayStatus.toLowerCase()}`}>
                    {displayStatus}
                  </span>
                </td>
                <td className="actions-cell">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(sub)}
                    title="Edit Subscription"
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(sub.subscription_id)}
                    title="Delete Subscription"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default SubscriptionTable;