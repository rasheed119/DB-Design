/* Find all the topics and tasks that were taught in the month of October: */

SELECT t.topic_id, t.topic_name, t.description, ts.task_id, ts.task_name, ts.description
FROM topics t
JOIN tasks ts ON t.topic_id = ts.topic_id
WHERE EXTRACT(MONTH FROM ts.deadline) = 10;

/* Find all the company drives that appeared between 15th Oct 2020 and 31st Oct 2020: */

SELECT drive_id, company_name, drive_date
FROM company_drives
WHERE drive_date BETWEEN '2020-10-15' AND '2020-10-31';


/* Find all the company drives and students who appeared for the placement: */

SELECT cd.drive_id, cd.company_name, cd.drive_date, u.user_id, u.name
FROM company_drives cd
JOIN attendance a ON cd.drive_date = a.class_date
JOIN users u ON a.user_id = u.user_id;

/* Find the number of problems solved by the user in codekata: */

SELECT user_id, COUNT(codekata_id) AS problems_solved
FROM codekata
GROUP BY user_id;


/* Find all the mentors who have mentees count more than 15: */

SELECT m.mentor_id, m.name, COUNT(mentee_id) AS mentees_count
FROM mentors m
JOIN users u ON m.mentor_id = u.mentor_id
GROUP BY m.mentor_id, m.name
HAVING COUNT(mentee_id) > 15;

/* Find the number of users who are absent, and their tasks are not submitted between 15th Oct 2020 and 31st Oct 2020: */

SELECT COUNT(DISTINCT u.user_id) AS num_users_absent
FROM users u
LEFT JOIN attendance a ON u.user_id = a.user_id AND a.class_date BETWEEN '2020-10-15' AND '2020-10-31'
LEFT JOIN tasks t ON u.user_id = t.user_id AND t.deadline BETWEEN '2020-10-15' AND '2020-10-31'
WHERE a.is_present IS FALSE AND t.task_id IS NULL;
