# KPI Tracker Layout Bug Investigation

## Task Checklist
- [x] Navigate to http://localhost:5174/
- [x] Locate 'Weekly Breakdown' in 'KPI Tracker' module
- [ ] Take screenshot of the layout bug
- [/] Analyze the DOM/UI to understand why it's overflowing
- [ ] Summarize findings and describe the bug

### Findings
- 'Weekly Breakdown' and 'KPI Tracker' have very large negative `top` values (e.g., -4344px), suggesting they are being pushed way above the current viewport or are in a massive container.
- Large vertical bars (blue and green) are visible in the screenshot, likely part of a chart that has grown to a massive height.
- The `KPI Overview` header is visible, but the cards below it are missing/not visible.
