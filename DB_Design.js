//Find all the topics and tasks taught in the month of October:
db.topics.aggregate([
  {
    $lookup: {
      from: "tasks",
      localField: "_id",
      foreignField: "kata_id",
      as: "tasks",
    }
  },
  {
    $match: {
      "tasks.date_assigned": {
        $gte: ISODate("2023-10-01"),
        $lt: ISODate("2023-11-01"),
      },
    },
  },
  {
    $project: {
      _id: 0,
      topic_name: "$name",
      task_names: "$tasks.name",
    },
  },
]);
//Find all the company drives between 15-Oct-2020 and 31-Oct-2020:
db.company_drives.find({
  date: {
    $gte: ISODate("2020-10-15"),
    $lte: ISODate("2020-10-31"),
  },
});
//Find all the company drives and students who appeared for the placement:
db.company_drives.aggregate([
  {
    $lookup: {
      from: "attendance",
      localField: "date",
      foreignField: "date",
      as: "attendance",
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "attendance.user_id",
      foreignField: "_id",
      as: "students",
    },
  },
  {
    $match: {
      "students.role": "student",
    },
  },
  {
    $project: {
      _id: 0,
      drive_name: "$name",
      student_names: "$students.username",
    },
  },
]);
//Find the number of problems solved by the user in codekata:
db.users.aggregate([
  {
    $lookup: {
      from: "tasks",
      localField: "_id",
      foreignField: "user_id",
      as: "tasks",
    },
  },
  {
    $project: {
      _id: 0,
      username: 1,
      problems_solved: { $size: "$tasks" },
    },
  },
]);
//Find the number of problems solved by the user in codekata:
db.users.aggregate([
  {
    $lookup: {
      from: "tasks",
      localField: "_id",
      foreignField: "user_id",
      as: "tasks",
    },
  },
  {
    $project: {
      _id: 0,
      username: 1,
      problems_solved: { $size: "$tasks" },
    },
  },
]);
//Find all the mentors with mentee count more than 15:
db.mentors.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "mentor_id",
      as: "mentees",
    },
  },
  {
    $project: {
      _id: 0,
      mentor_name: "$name",
      mentee_count: { $size: "$mentees" },
    },
  },
  {
    $match: {
      mentee_count: { $gt: 15 },
    },
  },
]);
//Find the number of users who are absent and tasks not submitted between 15-Oct-2020 and 31-Oct-2020:
db.users.aggregate([
  {
    $lookup: {
      from: "attendance",
      localField: "_id",
      foreignField: "user_id",
      as: "attendance",
    },
  },
  {
    $lookup: {
      from: "tasks",
      let: { user_id: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$user_id", "$$user_id"] },
                { $gte: ["$date_assigned", ISODate("2020-10-15")] },
                { $lte: ["$date_assigned", ISODate("2020-10-31")] },
                { $eq: ["$date_submitted", null] },
              ],
            },
          },
        },
      ],
      as: "unsolved_tasks",
    },
  },
  {
    $match: {
      "attendance.present": false,
      unsolved_tasks: { $ne: [] },
    },
  },
  {
    $count: "absent_users_with_unsolved_tasks",
  },
]);
