WITH weekly AS (
  SELECT user_id, date_trunc('week', event_time) AS wk,
         MAX(event_name='recipe_generate_succeeded') AS gen,
         MAX(event_name='recipe_added_to_day')     AS add_day
  FROM events
  GROUP BY 1,2
)
SELECT wk, COUNT(*) FILTER (WHERE gen AND add_day) AS wamp
FROM weekly
GROUP BY 1
ORDER BY 1 DESC;
