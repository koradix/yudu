CREATE TYPE user_role AS ENUM ('learner','expert','client','admin');
CREATE TYPE skill_category AS ENUM ('digital','physical');
CREATE TYPE offer_type AS ENUM ('practical_experience','hourly_mentoring','service');
CREATE TYPE session_request_status AS ENUM ('pending','accepted','declined','counter_proposed','expired');
CREATE TYPE session_status AS ENUM ('scheduled','in_progress','completed','cancelled','disputed');
CREATE TYPE payment_status AS ENUM ('pending','captured','released','refunded','failed');
CREATE TYPE location_type AS ENUM ('in_person','remote','hybrid');
