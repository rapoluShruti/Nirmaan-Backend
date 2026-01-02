module.exports.deriveTaskState = (task) => {
  const now = new Date();
  let derivedStatus = task.status;
  let overdue = false;
  let overdueDays = 0;

  // ✅ Approved & locked = final
  if (task.approved && task.isLocked) {
    return {
      derivedStatus: "APPROVED",
      overdue: false,
      overdueDays: 0
    };
  }

  // 🔴 End date passed
  if (task.endDate && now > task.endDate) {
    overdue = true;
    overdueDays = Math.ceil(
      (now - task.endDate) / (1000 * 60 * 60 * 24)
    );

    if (!task.beforePhotoUrl) {
      derivedStatus = "OVERDUE_NOT_STARTED";
    } else if (task.beforePhotoUrl && !task.afterPhotoUrl) {
      derivedStatus = "OVERDUE_IN_PROGRESS";
    } else if (task.afterPhotoUrl && !task.approved) {
      derivedStatus = "OVERDUE_PENDING_APPROVAL";
    }

    return { derivedStatus, overdue, overdueDays };
  }

  // 🟡 Start date passed but not started
  if (task.startDate && now >= task.startDate && !task.beforePhotoUrl) {
    derivedStatus = "NOT_STARTED";
  }

  return { derivedStatus, overdue, overdueDays };
};
