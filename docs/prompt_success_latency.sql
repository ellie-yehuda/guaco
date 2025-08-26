SELECT
  date_trunc('day', event_time) AS day,
  AVG(latency_ms) FILTER (WHERE event_name='recipe_generate_succeeded') AS p50_latency_ms,
  APPROX_PERCENTILE(latency_ms, 0.95) FILTER (WHERE event_name='recipe_generate_succeeded') AS p95_latency_ms,
  COUNT(*) FILTER (WHERE event_name='recipe_generate_succeeded') * 1.0
    / NULLIF(COUNT(*) FILTER (WHERE event_name IN ('recipe_generate_succeeded','recipe_generate_failed')),0)
    AS prompt_success_rate
FROM events
GROUP BY 1
ORDER BY 1 DESC;
