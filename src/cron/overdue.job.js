const Task = require("../models/Task");

/**
 * R32
 */
module.exports = async () => {
  const today = new Date();

  const overdue = await Task.find({
    endDate: { $lt: today },
    approved: false
  });

  // overdue.forEach(t => {
  //   console.log(
  //     `⚠️ Task ${t.taskId} overdue by ${
  //       Math.ceil((today - t.endDate) / 86400000)
  //     } days`
  //   );
  // });
  overdue.forEach(t => {
  // 1. Get current time
  const now = new Date();

  // 2. Set the task's end date to 11:59:59.999 PM of that day
  const deadline = new Date(t.endDate);
  deadline.setHours(23, 59, 59, 999);

  // 3. Calculate difference
  const diffInMs = now - deadline;
  
  // 4. Only show days if the current time is actually past 11:59 PM
  if (diffInMs > 0) {
    const daysOverdue = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    
    console.log(
      `⚠️ Task ${t.taskId} overdue by ${daysOverdue} day(s)`
    );
  }
});
};
