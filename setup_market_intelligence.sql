-- 1. Create Intelligence Table
-- This acts as a cache/index for company signals.
-- We key by company_name since that is our common denominator in job_posts.
CREATE TABLE IF NOT EXISTS company_intelligence (
    company_name TEXT PRIMARY KEY,
    
    -- Metrics
    active_jobs_count INT DEFAULT 0, -- Jobs active now (last 30 days)
    previous_period_count INT DEFAULT 0, -- Jobs active in prior period (30-60 days ago)
    hiring_velocity_score FLOAT DEFAULT 0.0, -- (Current - Previous) / Previous
    
    -- Signals
    signal_label TEXT, -- 'Aggressive Hirer', 'Leaker', 'Stable'
    last_updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE company_intelligence ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users (Candidates need to see signals too)
CREATE POLICY "Public read access" ON company_intelligence FOR SELECT USING (true);


-- 2. Create Calculation Function (The Engine)
-- This function aggregates job_posts and updates the intelligence table.
-- It can be run via a cron job (pg_cron) or manually via admin RPC.

CREATE OR REPLACE FUNCTION refresh_market_intelligence()
RETURNS void AS $$
DECLARE
    rec RECORD;
    v_active_count INT;
    v_prev_count INT;
    v_velocity FLOAT;
    v_signal TEXT;
BEGIN
    -- Iterate over every unique company with jobs in the last 60 days
    FOR rec IN 
        SELECT DISTINCT company 
        FROM job_posts 
        WHERE created_at > (now() - interval '60 days')
        AND company IS NOT NULL
    LOOP
        -- 1. Count Active Jobs (Last 30 days)
        SELECT COUNT(*) INTO v_active_count
        FROM job_posts
        WHERE company = rec.company
        AND created_at > (now() - interval '30 days');

        -- 2. Count Previous Period Jobs (30-60 days ago)
        SELECT COUNT(*) INTO v_prev_count
        FROM job_posts
        WHERE company = rec.company
        AND created_at BETWEEN (now() - interval '60 days') AND (now() - interval '30 days');

        -- 3. Calculate Velocity
        -- Avoid division by zero
        IF v_prev_count = 0 THEN
            IF v_active_count > 0 THEN
                v_velocity := 1.0; -- 100% growth (New Entrant)
            ELSE
                v_velocity := 0.0;
            END IF;
        ELSE
            v_velocity := (v_active_count::FLOAT - v_prev_count::FLOAT) / v_prev_count::FLOAT;
        END IF;

        -- 4. Determine Signal
        IF v_velocity > 0.2 THEN
            v_signal := 'Aggressive Hirer'; -- > 20% Growth
        ELSIF v_velocity < -0.2 THEN
             -- Note: A drop in ADS might just mean they filled roles, BUT
             -- if it's a massive drop across the board, it could mean "Hiring Freeze" or "Downsizing"
             -- For now, we call it "Cooling Down" to be safe, or "Churn Risk" if we had employee data.
            v_signal := 'Cooling Down'; 
        ELSE
            v_signal := 'Stable';
        END IF;

        -- 5. Upsert into Intelligence Table
        INSERT INTO company_intelligence (
            company_name, 
            active_jobs_count, 
            previous_period_count, 
            hiring_velocity_score, 
            signal_label, 
            last_updated_at
        )
        VALUES (
            rec.company, 
            v_active_count, 
            v_prev_count, 
            v_velocity, 
            v_signal, 
            now()
        )
        ON CONFLICT (company_name) DO UPDATE SET
            active_jobs_count = EXCLUDED.active_jobs_count,
            previous_period_count = EXCLUDED.previous_period_count,
            hiring_velocity_score = EXCLUDED.hiring_velocity_score,
            signal_label = EXCLUDED.signal_label,
            last_updated_at = now();
            
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
