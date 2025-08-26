-- Users who activated in first 24h
SELECT
  COUNT(DISTINCT u.user_id) FILTER (WHERE a.activated_within_24h) * 1.0
  / COUNT(DISTINCT u.user_id) AS d0_activation_rate
FROM users u
LEFT JOIN (
  SELECT user_id,
         MIN(event_time) AS t_first_gen,
         MIN(event_time) FILTER (WHERE event_name='recipe_added_to_day') AS t_first_add
  FROM events
  WHERE event_name IN ('recipe_generate_succeeded','recipe_added_to_day')
  GROUP BY user_id
) e ON e.user_id = u.user_id
CROSS JOIN LATERAL (
  SELECT (e.t_first_gen IS NOT NULL AND e.t_first_add IS NOT NULL
          AND e.t_first_add - u.signup_time <= INTERVAL '24 hours') AS activated_within_24h
) a;
