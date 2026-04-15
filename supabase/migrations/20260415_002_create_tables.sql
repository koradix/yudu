-- Perfil base (vinculado ao auth.users automaticamente)
CREATE TABLE profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role         user_role NOT NULL DEFAULT 'learner',
  full_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  avatar_url   TEXT,
  cpf_hash     TEXT,
  is_verified  BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE learner_profiles (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  bio                TEXT,
  xp_points          INTEGER NOT NULL DEFAULT 0,
  sessions_completed INTEGER NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE expert_profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  headline            TEXT,
  bio                 TEXT,
  rating_avg          NUMERIC(3,2) DEFAULT 0,
  sessions_count      INTEGER NOT NULL DEFAULT 0,
  response_time_hours INTEGER DEFAULT 24,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE client_profiles (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  company_name   TEXT,
  sessions_count INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE skill_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  type        skill_category NOT NULL,
  icon_name   TEXT,
  color_token TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE skills (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES skill_categories(id),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE expert_skills (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id  UUID NOT NULL REFERENCES expert_profiles(id) ON DELETE CASCADE,
  skill_id   UUID NOT NULL REFERENCES skills(id),
  years_exp  INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (expert_id, skill_id)
);

CREATE TABLE learner_skill_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id      UUID NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
  skill_id        UUID NOT NULL REFERENCES skills(id),
  sessions_count  INTEGER NOT NULL DEFAULT 0,
  total_hours     NUMERIC(6,1) NOT NULL DEFAULT 0,
  last_session_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (learner_id, skill_id)
);

CREATE TABLE offers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id     UUID NOT NULL REFERENCES expert_profiles(id) ON DELETE CASCADE,
  skill_id      UUID NOT NULL REFERENCES skills(id),
  offer_type    offer_type NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  base_price    NUMERIC(10,2) NOT NULL,
  min_price     NUMERIC(10,2),
  duration_min  INTEGER DEFAULT 60,
  location_type location_type DEFAULT 'remote',
  max_learners  INTEGER DEFAULT 1,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE availability (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID NOT NULL REFERENCES expert_profiles(id) ON DELETE CASCADE,
  weekday   SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time   TIME NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (expert_id, weekday, start_time)
);

CREATE TABLE session_requests (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id       UUID NOT NULL REFERENCES offers(id),
  requester_id   UUID NOT NULL REFERENCES profiles(id),
  status         session_request_status NOT NULL DEFAULT 'pending',
  proposed_price NUMERIC(10,2),
  counter_price  NUMERIC(10,2),
  message        TEXT,
  proposed_date  TIMESTAMPTZ,
  responded_at   TIMESTAMPTZ,
  expires_at     TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '48 hours'),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id      UUID UNIQUE REFERENCES session_requests(id),
  expert_id       UUID NOT NULL REFERENCES expert_profiles(id),
  learner_id      UUID REFERENCES learner_profiles(id),
  client_id       UUID REFERENCES client_profiles(id),
  offer_id        UUID NOT NULL REFERENCES offers(id),
  offer_type      offer_type NOT NULL,
  status          session_status NOT NULL DEFAULT 'scheduled',
  scheduled_at    TIMESTAMPTZ NOT NULL,
  duration_min    INTEGER NOT NULL DEFAULT 60,
  price_paid      NUMERIC(10,2) NOT NULL,
  location_type   location_type NOT NULL,
  location_detail TEXT,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payments (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id         UUID NOT NULL UNIQUE REFERENCES sessions(id),
  payer_id           UUID NOT NULL REFERENCES profiles(id),
  amount             NUMERIC(10,2) NOT NULL,
  platform_fee       NUMERIC(10,2) NOT NULL,
  expert_payout      NUMERIC(10,2) NOT NULL,
  status             payment_status NOT NULL DEFAULT 'pending',
  gateway            TEXT DEFAULT 'manual',
  gateway_payment_id TEXT,
  pix_code           TEXT,
  captured_at        TIMESTAMPTZ,
  released_at        TIMESTAMPTZ,
  refunded_at        TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID NOT NULL REFERENCES sessions(id),
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  reviewee_id UUID NOT NULL REFERENCES profiles(id),
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, reviewer_id)
);

CREATE TABLE messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID REFERENCES sessions(id),
  sender_id    UUID NOT NULL REFERENCES profiles(id),
  recipient_id UUID NOT NULL REFERENCES profiles(id),
  body         TEXT NOT NULL,
  sent_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at      TIMESTAMPTZ
);
